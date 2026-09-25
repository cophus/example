// virtual-detector.js
// AnyWidget: the core 4D-STEM idea. A synthetic 4D dataset (48 x 48 probe
// positions, 64 x 64 diffraction pixels) is built once in the browser: a field
// of view with five crystalline grains (different lattices and in-plane
// orientations), one amorphous region, and a vacuum hole, over a gently
// varying thickness. Each diffraction pattern is a bright-field disk (dimmer
// where the sample is thicker), Bragg disks on the local rotated lattice or a
// diffuse amorphous ring, a weak diffuse background, and counting noise.
// Left: the virtual image. Right: the diffraction pattern at the selected
// probe position (hover the image, click to pin). Drag or resize the virtual
// detector on the pattern: bright field disk, annular dark field, or a small
// virtual aperture placed on one Bragg disk to light up the grains that
// produce it. The virtual image recomputes live from the stored patterns.
//
//   :::{anywidget} ../../widgets/virtual-detector.js
//   :::

const NS = 48, NK = 64, NP = NS * NS, NKK = NK * NK;
const KC = (NK - 1) / 2;      // pattern center in pixel coordinates
const MRAD = 0.5;             // mrad per detector pixel
const RD = 3.0;               // bright-field disk radius (px)
const NTOT = 12000;           // electrons per probe position

// grains: seed position, lattice [|a1|, |a2|, angle between] in detector px,
// in-plane rotation (deg), a small tilt that biases disk intensities, and a
// scattering strength (diffraction contrast in the bright-field image)
const GRAINS = [
  { x: 9,  y: 10, lat: [11.5, 11.5, 60], th: 4,  t: [3, -2],  str: 1.0 },
  { x: 30, y: 9,  lat: [13, 13, 90],     th: 17, t: [-2, 3],  str: 0.6 },
  { x: 12, y: 29, lat: [10, 15, 90],     th: 72, t: [2, 2],   str: 1.35 },
  { x: 31, y: 28, lat: [11.5, 11.5, 60], th: 34, t: [-3, -1], str: 0.8 },
  { x: 45, y: 16, lat: [13, 13, 90],     th: 58, t: [1, -3],  str: 1.15 },
];
const AMORPH = { x: 38, y: 41, r: 8.5 };
const HOLE = { x: 8, y: 42, r: 5.2 };
const REGION_NAMES = ["grain 1", "grain 2", "grain 3", "grain 4", "grain 5", "amorphous", "vacuum"];

function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
// wobbly blob mask, 1 inside, soft edge about one scan pixel wide
function blob(x, y, b, ph) {
  const dx = x - b.x, dy = y - b.y, d = Math.hypot(dx, dy), f = Math.atan2(dy, dx);
  const R = b.r * (1 + 0.13 * Math.sin(3 * f + ph) + 0.07 * Math.sin(5 * f + 2 * ph));
  return clamp01((R - d) / 1.3 + 0.5);
}

// Bragg disk positions (detector px, relative to center) for one grain
function grainDisks(gr) {
  const [l1, l2, gam] = gr.lat, th = gr.th * Math.PI / 180, ga = gam * Math.PI / 180;
  const a1 = [l1 * Math.cos(th), l1 * Math.sin(th)];
  const a2 = [l2 * Math.cos(th + ga), l2 * Math.sin(th + ga)];
  const out = [];
  for (let h = -5; h <= 5; h++) for (let k = -5; k <= 5; k++) {
    if (!h && !k) continue;
    const gx = h * a1[0] + k * a2[0], gy = h * a1[1] + k * a2[1];
    const gg = Math.hypot(gx, gy);
    if (gg > 30) continue;
    const exc = Math.exp(-((gx - gr.t[0]) ** 2 + (gy - gr.t[1]) ** 2) / (2 * 15 * 15));
    out.push({ x: gx, y: gy, I: exc * (0.6 + 0.4 * Math.exp(-gg / 10)) });
  }
  return out;
}
function diskTemplate(list) {
  const T = new Float32Array(NKK);
  for (const d of list) {
    const x0 = Math.floor(KC + d.x - RD - 1), x1 = Math.ceil(KC + d.x + RD + 1);
    const y0 = Math.floor(KC + d.y - RD - 1), y1 = Math.ceil(KC + d.y + RD + 1);
    for (let ky = Math.max(0, y0); ky <= Math.min(NK - 1, y1); ky++)
      for (let kx = Math.max(0, x0); kx <= Math.min(NK - 1, x1); kx++) {
        const r = Math.hypot(kx - KC - d.x, ky - KC - d.y);
        T[ky * NK + kx] += d.I * clamp01(RD + 0.5 - r);
      }
  }
  let s = 0; for (let i = 0; i < NKK; i++) s += T[i];
  for (let i = 0; i < NKK; i++) T[i] /= s;
  return T;
}

// the dataset is shared by every instance on the page: built once, lazily
let DATA = null;
function buildData() {
  if (DATA) return DATA;
  const Ct = diskTemplate([{ x: 0, y: 0, I: 1 }]);
  const Gt = GRAINS.map(g => diskTemplate(grainDisks(g)));
  const At = new Float32Array(NKK), Dt = new Float32Array(NKK);
  let sa = 0, sd = 0;
  for (let ky = 0; ky < NK; ky++) for (let kx = 0; kx < NK; kx++) {
    const k = Math.hypot(kx - KC, ky - KC), i = ky * NK + kx;
    At[i] = Math.exp(-((k - 12.5) ** 2) / (2 * 2.0 * 2.0)) + 0.45 * Math.exp(-((k - 22.5) ** 2) / (2 * 3.2 * 3.2))
      + 0.3 * Math.exp(-k / 6);
    Dt[i] = Math.exp(-k / 9);
    sa += At[i]; sd += Dt[i];
  }
  for (let i = 0; i < NKK; i++) { At[i] /= sa; Dt[i] /= sd; }

  // per-probe weights of each template
  const wC = new Float32Array(NP), wA = new Float32Array(NP), wD = new Float32Array(NP);
  const wG = GRAINS.map(() => new Float32Array(NP));
  const label = new Uint8Array(NP), thick = new Float32Array(NP);
  for (let iy = 0; iy < NS; iy++) for (let ix = 0; ix < NS; ix++) {
    const p = iy * NS + ix, x = ix + 0.5, y = iy + 0.5;
    const vac = blob(x, y, HOLE, 0.7), am = blob(x, y, AMORPH, 2.1);
    const t = (0.45 + 0.9 * (x + 0.6 * y) / 77 + 0.08 * Math.sin(x * 0.3) * Math.cos(y * 0.26)) * (1 - vac);
    thick[p] = t;
    // Voronoi grains with wavy boundaries, blended over ~half a pixel
    const d = GRAINS.map((g, i) => Math.hypot(x - g.x, y - g.y) + 1.4 * Math.sin(0.37 * x + 1.7 * i) * Math.cos(0.31 * y + i));
    let dmin = Infinity, imin = 0;
    d.forEach((v, i) => { if (v < dmin) { dmin = v; imin = i; } });
    let ws = 0, kst = 0;
    const w = d.map(v => { const e = Math.exp(-(v - dmin) * 2.5); ws += e; return e; });
    w.forEach((e, i) => { kst += e * GRAINS[i].str; });
    kst = (kst / ws) * (1 - am) + 0.9 * am;
    const s = 1 - Math.exp(-1.3 * t * kst);      // scattered fraction
    wC[p] = 1 - s;
    for (let i = 0; i < GRAINS.length; i++) wG[i][p] = s * 0.72 * (1 - am) * w[i] / ws;
    wA[p] = s * 0.72 * am;
    wD[p] = s * 0.28;
    label[p] = vac > 0.5 ? 6 : am > 0.5 ? 5 : imin;
  }
  // normal-deviate table for fast counting noise
  const rng = makeRng(20240925);
  const NT = 1 << 18, nrm = new Float32Array(NT);
  for (let i = 0; i < NT; i += 2) {
    const u1 = Math.max(1e-9, rng()), u2 = rng(), r = Math.sqrt(-2 * Math.log(u1));
    nrm[i] = r * Math.cos(2 * Math.PI * u2); nrm[i + 1] = r * Math.sin(2 * Math.PI * u2);
  }
  // data stored detector-pixel-major: data[k * NP + p], so a virtual detector
  // sums contiguous rows of NP values
  const data = new Float32Array(NKK * NP);
  let ni = 1;
  for (let k = 0; k < NKK; k++) {
    const c = Ct[k] * NTOT, a = At[k] * NTOT, dd = Dt[k] * NTOT, off = k * NP;
    for (let p = 0; p < NP; p++) data[off + p] = wC[p] * c + wA[p] * a + wD[p] * dd;
    for (let i = 0; i < Gt.length; i++) {
      const gk = Gt[i][k] * NTOT;
      if (gk <= 0) continue;
      const wg = wG[i];
      for (let p = 0; p < NP; p++) data[off + p] += wg[p] * gk;
    }
    for (let p = 0; p < NP; p++) {
      ni = (Math.imul(ni, 1103515245) + 12345) >>> 0;
      const I = data[off + p] + Math.sqrt(data[off + p] + 0.15) * nrm[ni >>> 14];
      data[off + p] = I > 0 ? I : 0;
    }
  }
  // radial bins (0.5 px wide) about the pattern center, for fast annular detectors
  const NRB = 92, rad = new Float32Array(NRB * NP);
  for (let k = 0; k < NKK; k++) {
    const b = Math.floor(2 * Math.hypot(k % NK - KC, Math.floor(k / NK) - KC));
    if (b >= NRB) continue;
    const off = k * NP, ro = b * NP;
    for (let p = 0; p < NP; p++) rad[ro + p] += data[off + p];
  }
  let imax = 0;
  for (let i = 0; i < NKK; i++) imax = Math.max(imax, Ct[i]);
  DATA = { data, rad, NRB, label, thick, imax: imax * NTOT, disks: GRAINS.map(grainDisks) };
  return DATA;
}

// inferno-like colormap for the diffraction pattern
const STOPS = [[0, 0, 4], [31, 12, 72], [85, 15, 109], [136, 34, 106], [186, 54, 85],
  [227, 89, 51], [249, 140, 10], [249, 201, 50], [252, 255, 164]];
const LUT = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const f = i / 255 * (STOPS.length - 1), j = Math.min(STOPS.length - 2, Math.floor(f)), t = f - j;
  for (let c = 0; c < 3; c++) LUT[i * 3 + c] = Math.round(STOPS[j][c] * (1 - t) + STOPS[j + 1][c] * t);
}

function render({ model, el }) {
  const uid = "vd" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-top { display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap; align-items:center; }
.${uid} .w-top button { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 12px; cursor:pointer; font-size:13px; }
.${uid} .w-top button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} .w-hint { font-size:12.5px; color:var(--w-muted); margin-left:6px; }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-col { flex:1 1 240px; min-width:220px; }
.${uid} canvas { background:#0b0a0a; border:1px solid var(--w-border); border-radius:8px;
  display:block; width:100%; touch-action:none; }
.${uid} .w-bar { display:flex; gap:16px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; min-height:26px; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; min-width:62px; display:inline-block; }
.${uid} input[type=range] { width:110px; accent-color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-top"><span class="w-hint">hover the image to move the probe, click to pin; drag the detector on the pattern</span></div>
<div class="w-row">
  <div class="w-col"><canvas class="w-vi"></canvas></div>
  <div class="w-col"><canvas class="w-dp"></canvas></div>
</div>
<div class="w-bar">
  <label class="w-s-bf">BF radius <input class="w-bfr" type="range" min="1" max="12" step="0.25" value="3.5"><b class="w-bfrv"></b></label>
  <label class="w-s-adf">inner <input class="w-rin" type="range" min="3" max="28" step="0.25" value="6"><b class="w-rinv"></b></label>
  <label class="w-s-adf">outer <input class="w-rout" type="range" min="5" max="31" step="0.25" value="24"><b class="w-routv"></b></label>
  <label class="w-s-df">aperture radius <input class="w-dfr" type="range" min="1" max="6" step="0.25" value="2.5"><b class="w-dfrv"></b></label>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Virtual detectors.</b> Every probe position stores a full diffraction pattern, so any detector shape can be applied after the experiment. A bright-field disk shows thickness and the hole, an annulus lights up everything that scatters, and a small aperture on one Bragg disk picks out the grains that produce it.";
  root.appendChild(cap);

  const D = buildData();
  const cvI = root.querySelector(".w-vi"), cvD = root.querySelector(".w-dp");
  const inBF = root.querySelector(".w-bfr"), inRin = root.querySelector(".w-rin");
  const inRout = root.querySelector(".w-rout"), inDF = root.querySelector(".w-dfr");

  // detector state per mode (detector pixel units)
  const g4 = D.disks[3].slice().sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y) || a.x - b.x)
    .find(d => d.x > 0 && d.y > 0) || D.disks[3][0];
  const det = {
    mode: "BF",
    bf: { cx: KC, cy: KC, r: +inBF.value },
    adf: { rin: +inRin.value, rout: +inRout.value },
    df: { cx: KC + g4.x, cy: KC + g4.y, r: +inDF.value },
  };
  let probe = { x: 31, y: 28 }, pinned = false;

  const top = root.querySelector(".w-top");
  const hint = top.querySelector(".w-hint");
  const MODES = [["BF", "Bright field"], ["ADF", "Annular dark field"], ["DF", "Virtual aperture"]];
  for (const [m, name] of MODES) {
    const b = document.createElement("button");
    b.textContent = name; b.dataset.m = m;
    if (m === det.mode) b.classList.add("on");
    b.addEventListener("click", () => {
      det.mode = m;
      top.querySelectorAll("button").forEach(q => q.classList.toggle("on", q === b));
      syncSliders(); recompute(); drawAll();
    });
    top.insertBefore(b, hint);
  }
  function syncSliders() {
    root.querySelectorAll(".w-s-bf").forEach(e => e.style.display = det.mode === "BF" ? "" : "none");
    root.querySelectorAll(".w-s-adf").forEach(e => e.style.display = det.mode === "ADF" ? "" : "none");
    root.querySelectorAll(".w-s-df").forEach(e => e.style.display = det.mode === "DF" ? "" : "none");
    inBF.value = det.bf.r; inRin.value = det.adf.rin; inRout.value = det.adf.rout; inDF.value = det.df.r;
    root.querySelector(".w-bfrv").textContent = (det.bf.r * MRAD).toFixed(2) + " mrad";
    root.querySelector(".w-rinv").textContent = (det.adf.rin * MRAD).toFixed(2) + " mrad";
    root.querySelector(".w-routv").textContent = (det.adf.rout * MRAD).toFixed(2) + " mrad";
    root.querySelector(".w-dfrv").textContent = (det.df.r * MRAD).toFixed(2) + " mrad";
  }

  // ---------- virtual image from a soft-edged detector mask ----------
  const img = new Float32Array(NP);
  let imgLo = 0, imgHi = 1;
  function recompute() {
    const idx = [], wt = [];
    if (det.mode === "ADF") {
      // annulus from the radial bins: weight = overlap of each bin with [rin, rout]
      for (let b = 0; b < D.NRB; b++) {
        const w = Math.max(0, Math.min((b + 1) / 2, det.adf.rout) - Math.max(b / 2, det.adf.rin)) * 2;
        if (w > 0.01) { idx.push(b); wt.push(w); }
      }
      img.fill(0);
      for (let j = 0; j < idx.length; j++) {
        const off = idx[j] * NP, w = wt[j];
        for (let p = 0; p < NP; p++) img[p] += w * D.rad[off + p];
      }
      return finishImage();
    }
    const c = det.mode === "BF" ? det.bf : det.df;
    for (let ky = 0; ky < NK; ky++) for (let kx = 0; kx < NK; kx++) {
      const w = clamp01(c.r + 0.5 - Math.hypot(kx - c.cx, ky - c.cy));
      if (w > 0.01) { idx.push(ky * NK + kx); wt.push(w); }
    }
    img.fill(0);
    const data = D.data;
    for (let j = 0; j < idx.length; j++) {
      const off = idx[j] * NP, w = wt[j];
      for (let p = 0; p < NP; p++) img[p] += w * data[off + p];
    }
    finishImage();
  }
  function finishImage() {
    // robust display range: 0.5 and 99.7 percentiles
    const s = Float32Array.from(img).sort();
    imgLo = s[Math.floor(NP * 0.005)]; imgHi = s[Math.floor(NP * 0.997)];
    if (imgHi <= imgLo) imgHi = imgLo + 1;
  }

  const offI = document.createElement("canvas"); offI.width = offI.height = NS;
  const offD = document.createElement("canvas"); offD.width = offD.height = NK;
  const ctxI = offI.getContext("2d"), ctxD = offD.getContext("2d");
  const idI = ctxI.createImageData(NS, NS), idD = ctxD.createImageData(NK, NK);

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); drawAll(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function setup(cv) {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 300;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr); }
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [g, w];
  }
  function label(g, txt, x, y) {
    g.font = "12.5px system-ui"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,0.7)";
    g.strokeText(txt, x, y); g.fillStyle = "#eee"; g.fillText(txt, x, y);
  }
  const ACC = () => dark() ? "rgb(255,63,63)" : "rgb(230,30,30)";
  const DET = "rgb(80,220,255)";

  function drawImage() {
    const [g, w] = setup(cvI);
    const px = idI.data, sc = 255 / (imgHi - imgLo);
    for (let p = 0; p < NP; p++) {
      const v = Math.max(0, Math.min(255, (img[p] - imgLo) * sc));
      px[p * 4] = v; px[p * 4 + 1] = v; px[p * 4 + 2] = v; px[p * 4 + 3] = 255;
    }
    ctxI.putImageData(idI, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(offI, 0, 0, w, w);
    const s = w / NS, cx = (probe.x + 0.5) * s, cy = (probe.y + 0.5) * s;
    g.strokeStyle = ACC(); g.lineWidth = 1.2;
    g.globalAlpha = 0.75;
    g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, cy - s * 1.2); g.moveTo(cx, cy + s * 1.2); g.lineTo(cx, w);
    g.moveTo(0, cy); g.lineTo(cx - s * 1.2, cy); g.moveTo(cx + s * 1.2, cy); g.lineTo(w, cy); g.stroke();
    g.globalAlpha = 1; g.lineWidth = 2;
    g.strokeRect(cx - s * 0.5 - 1, cy - s * 0.5 - 1, s + 2, s + 2);
    const nm = { BF: "bright field", ADF: "annular dark field", DF: "virtual aperture (dark field)" }[det.mode];
    label(g, "virtual image: " + nm, 8, 17);
    label(g, pinned ? "probe pinned (click to release)" : "hover to scan the probe", 8, w - 9);
  }

  function drawPattern() {
    const [g, w] = setup(cvD);
    const px = idD.data, p = probe.y * NS + probe.x, data = D.data;
    const L = 1 / Math.log1p(D.imax / 1.5);
    for (let k = 0; k < NKK; k++) {
      const v = Math.log1p(data[k * NP + p] / 1.5) * L;
      const c = Math.max(0, Math.min(255, Math.round(v * 255))) * 3;
      px[k * 4] = LUT[c]; px[k * 4 + 1] = LUT[c + 1]; px[k * 4 + 2] = LUT[c + 2]; px[k * 4 + 3] = 255;
    }
    ctxD.putImageData(idD, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(offD, 0, 0, w, w);
    // detector overlay
    const s = w / NK, P = v => (v + 0.5) * s;
    g.save();
    g.fillStyle = "rgba(80,220,255,0.16)"; g.strokeStyle = DET; g.lineWidth = 1.6;
    g.beginPath();
    if (det.mode === "ADF") {
      g.arc(P(KC), P(KC), det.adf.rout * s, 0, 2 * Math.PI);
      g.moveTo(P(KC) + det.adf.rin * s, P(KC));
      g.arc(P(KC), P(KC), det.adf.rin * s, 0, 2 * Math.PI, true);
      g.fill("evenodd");
    } else {
      const c = det.mode === "BF" ? det.bf : det.df;
      g.arc(P(c.cx), P(c.cy), c.r * s, 0, 2 * Math.PI);
      g.fill();
    }
    g.stroke();
    g.restore();
    // scale bar: 5 mrad
    const bl = 5 / MRAD * s;
    g.fillStyle = "#eee"; g.fillRect(w - bl - 10, w - 14, bl, 3);
    label(g, "5 mrad", w - bl - 10, w - 20);
    label(g, `diffraction at (${probe.x}, ${probe.y}): ${REGION_NAMES[D.label[p]]}`, 8, 17);
    label(g, "log display", 8, w - 9);
  }
  function drawAll() { drawImage(); drawPattern(); }

  // rAF-throttled redraws
  let pend = 0, needRe = false;
  function schedule(re) {
    needRe = needRe || re;
    if (pend) return;
    pend = requestAnimationFrame(() => {
      pend = 0;
      if (needRe) { recompute(); needRe = false; }
      drawAll();
    });
  }

  // ---------- probe selection on the virtual image ----------
  function probeFrom(ev) {
    const r = cvI.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(NS - 1, Math.floor((ev.clientX - r.left) / r.width * NS))),
      y: Math.max(0, Math.min(NS - 1, Math.floor((ev.clientY - r.top) / r.height * NS))),
    };
  }
  cvI.style.cursor = "crosshair";
  cvI.addEventListener("pointermove", ev => {
    if (pinned && ev.pointerType === "mouse") return;
    const q = probeFrom(ev);
    if (q.x !== probe.x || q.y !== probe.y) { probe = q; schedule(false); }
  });
  cvI.addEventListener("pointerdown", ev => {
    probe = probeFrom(ev);
    pinned = ev.pointerType === "mouse" ? !pinned : true;
    schedule(false);
  });

  // ---------- detector dragging / resizing on the pattern ----------
  function kFrom(ev) {
    const r = cvD.getBoundingClientRect();
    return [(ev.clientX - r.left) / r.width * NK - 0.5, (ev.clientY - r.top) / r.height * NK - 0.5];
  }
  let drag = null;
  function hit(kx, ky) {
    const tol = Math.max(0.9, 6 / (cvD.clientWidth / NK));
    if (det.mode === "ADF") {
      const r = Math.hypot(kx - KC, ky - KC);
      return Math.abs(r - det.adf.rin) < Math.abs(r - det.adf.rout) ? "rin" : "rout";
    }
    const c = det.mode === "BF" ? det.bf : det.df;
    const d = Math.hypot(kx - c.cx, ky - c.cy);
    if (Math.abs(d - c.r) < tol) return "r";
    return "move";
  }
  cvD.addEventListener("pointerdown", ev => {
    const [kx, ky] = kFrom(ev);
    const h = hit(kx, ky);
    const c = det.mode === "BF" ? det.bf : det.df;
    drag = { h, dx: 0, dy: 0 };
    if (h === "move") {
      const inside = Math.hypot(kx - c.cx, ky - c.cy) < c.r;
      if (!inside) { c.cx = kx; c.cy = ky; }
      drag.dx = c.cx - kx; drag.dy = c.cy - ky;
    }
    cvD.setPointerCapture(ev.pointerId);
    onDrag(kx, ky);
  });
  function onDrag(kx, ky) {
    const lim = v => Math.max(0, Math.min(NK - 1, v));
    if (det.mode === "ADF") {
      const r = Math.hypot(kx - KC, ky - KC);
      if (drag.h === "rin") det.adf.rin = Math.max(3, Math.min(det.adf.rout - 1, r));
      else det.adf.rout = Math.min(31, Math.max(det.adf.rin + 1, r));
    } else {
      const c = det.mode === "BF" ? det.bf : det.df;
      if (drag.h === "r") c.r = Math.max(1, Math.min(det.mode === "BF" ? 12 : 6, Math.hypot(kx - c.cx, ky - c.cy)));
      else { c.cx = lim(kx + drag.dx); c.cy = lim(ky + drag.dy); }
    }
    syncSliders(); schedule(true);
  }
  cvD.addEventListener("pointermove", ev => {
    const [kx, ky] = kFrom(ev);
    if (drag) { onDrag(kx, ky); return; }
    const h = hit(kx, ky);
    cvD.style.cursor = det.mode === "ADF" || h === "r" ? "ew-resize" : "move";
  });
  const endDrag = () => { drag = null; };
  cvD.addEventListener("pointerup", endDrag);
  cvD.addEventListener("pointercancel", endDrag);

  inBF.addEventListener("input", () => { det.bf.r = +inBF.value; syncSliders(); schedule(true); });
  inDF.addEventListener("input", () => { det.df.r = +inDF.value; syncSliders(); schedule(true); });
  inRin.addEventListener("input", () => {
    det.adf.rin = Math.min(+inRin.value, det.adf.rout - 1); syncSliders(); schedule(true);
  });
  inRout.addEventListener("input", () => {
    det.adf.rout = Math.max(+inRout.value, det.adf.rin + 1); syncSliders(); schedule(true);
  });

  syncSliders();
  recompute();
  new ResizeObserver(() => schedule(false)).observe(cvI);
  root.classList.toggle("w-dark", dark());
  drawAll();
  return () => { obs.disconnect(); if (pend) cancelAnimationFrame(pend); };
}

export default { render };
