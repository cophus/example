// convergence-angle.js
// AnyWidget: the probe convergence semiangle trade-off at 300 kV
// (lambda = 1.97 pm). A log slider sets alpha from 0.2 to 30 mrad. Left: the
// diffraction-limited probe intensity (Airy pattern, FWHM ~ 0.51 lambda/alpha)
// over a projected crystal with 0.4 nm spacing, with a scale bar and the probe
// size readout. Right: the diffraction pattern of that crystal, one disk of
// radius alpha at every Bragg angle (reciprocal spacing lambda/a ~ 4.9 mrad).
// Small alpha gives sharp spots and a large probe; large alpha gives an
// atom-sized probe and overlapping disks. Overlap zones, where neighboring
// disks interfere, are tinted and shaded by how many disks overlap. A status
// label names the regime and the 4D-STEM methods that use it.
//
//   :::{anywidget} ../../widgets/convergence-angle.js
//   :::

const LAMBDA = 1.97e-3;          // nm (300 kV)
const A_LAT = 0.4;               // nm lattice spacing
const G_MRAD = LAMBDA / A_LAT * 1000;   // reciprocal spacing in mrad (~4.93)
const AMIN = 0.2, AMAX = 30;

// Bessel J1 (Numerical Recipes rational approximation) for the Airy LUT
function besselJ1(x) {
  const ax = Math.abs(x);
  if (ax < 8) {
    const y = x * x;
    const a1 = x * (72362614232.0 + y * (-7895059235.0 + y * (242396853.1 + y * (-2972611.439 + y * (15704.48260 + y * (-30.16036606))))));
    const a2 = 144725228442.0 + y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y))));
    return a1 / a2;
  }
  const z = 8 / ax, y = z * z, xx = ax - 2.356194491;
  const p1 = 1 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * (-0.240337019e-6))));
  const p2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
  const ans = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * p1 - z * Math.sin(xx) * p2);
  return x < 0 ? -ans : ans;
}
const XMAX = 40, NLUT = 4096;
const AIRY = new Float32Array(NLUT + 1);
for (let i = 0; i <= NLUT; i++) {
  const x = i / NLUT * XMAX;
  AIRY[i] = x < 1e-6 ? 1 : (2 * besselJ1(x) / x) ** 2;
}
// FWHM of the Airy intensity: x_half = 1.6163 -> r = x/(2 pi alpha/lambda)
const fwhmNm = aMrad => 2 * 1.6163 * LAMBDA / (2 * Math.PI * aMrad * 1e-3);

// colormap for the diffraction intensity (dark blue -> white)
const STOPS = [[4, 6, 18], [20, 40, 90], [40, 95, 170], [95, 160, 225], [190, 225, 250], [255, 255, 255]];
const LUT = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const f = i / 255 * (STOPS.length - 1), j = Math.min(STOPS.length - 2, Math.floor(f)), t = f - j;
  for (let c = 0; c < 3; c++) LUT[i * 3 + c] = Math.round(STOPS[j][c] * (1 - t) + STOPS[j + 1][c] * t);
}
const TINT = [255, 150, 60];     // overlap (interference) zones

function niceBar(target) {
  const p = Math.pow(10, Math.floor(Math.log10(target)));
  for (const m of [5, 2, 1]) if (m * p <= target) return m * p;
  return p;
}
function fmtLen(nm) {
  return nm < 1 ? (nm * 10).toFixed(nm < 0.1 ? 2 : 1) + " Å" : nm < 10 ? nm.toFixed(2) + " nm" : nm.toFixed(1) + " nm";
}
function regime(a) {
  if (a < 2) return ["Nanobeam diffraction", "small separated spots: strain mapping, orientation mapping, amorphous short-range order (probes ~1 to 500 nm)"];
  if (a < 10) return ["Medium-range order", "fluctuation electron microscopy (FEM); disks begin to overlap"];
  if (a < 20) return ["Transition", "large disks overlap heavily; the probe approaches atomic size"];
  return ["Atomic resolution", "overlapping disks: DPC and ptychography use the interference zones (probes ~0.1 to 5 nm)"];
}

function render({ model, el }) {
  const uid = "ca" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-col { flex:1 1 240px; min-width:220px; }
.${uid} canvas { background:#0b0a0a; border:1px solid var(--w-border); border-radius:8px;
  display:block; width:100%; }
.${uid} .w-bar { display:flex; gap:16px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} input[type=range] { width:220px; accent-color:var(--w-accent); }
.${uid} .w-status { margin-top:8px; font-size:13.5px; line-height:1.45; padding:6px 10px;
  border-left:3px solid var(--w-accent); background:var(--w-panel); border-radius:4px; }
.${uid} .w-status b { color:var(--w-accent); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-row">
  <div class="w-col"><canvas class="w-rs"></canvas></div>
  <div class="w-col"><canvas class="w-dp"></canvas></div>
</div>
<div class="w-bar">
  <label>convergence semiangle α <input class="w-a" type="range" min="0" max="1000" step="1" value="700"><b class="w-av"></b></label>
  <span>probe FWHM <b class="w-fw"></b></span>
  <span>2α / Bragg spacing <b class="w-ov"></b></span>
  <span>300 kV, λ = 1.97 pm</span>
</div>
<div class="w-status"></div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Convergence angle trade-off.</b> A larger convergence semiangle focuses the probe to a smaller spot, but every Bragg disk grows to the same radius α. Once 2α exceeds the Bragg spacing the disks overlap; the tinted lenses are where they interfere (shading alternates with the number of overlapping disks).";
  root.appendChild(cap);

  const cvR = root.querySelector(".w-rs"), cvD = root.querySelector(".w-dp");
  const inA = root.querySelector(".w-a");
  const alpha = () => AMIN * Math.pow(AMAX / AMIN, +inA.value / 1000);

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function setup(cv) {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 300;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr); }
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [g, w, dpr];
  }
  function label(g, txt, x, y, col) {
    g.font = "12.5px system-ui"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,0.75)";
    g.strokeText(txt, x, y); g.fillStyle = col || "#eee"; g.fillText(txt, x, y);
  }
  let offR = document.createElement("canvas"), offD = document.createElement("canvas"), bufD = null, bufR = null;

  function drawReal(a) {
    const [g, w] = setup(cvR);
    const N = Math.round(w);                     // compute at CSS resolution
    const ctx = offR.getContext("2d");
    if (offR.width !== N || !bufR) { offR.width = N; offR.height = N; bufR = ctx.createImageData(N, N); }
    const id = bufR, px = id.data;
    const fw = fwhmNm(a);
    const L = Math.min(40, Math.max(1.6, 7 * fw));   // field of view (nm)
    const ps = L / N;                                 // nm per pixel
    const sig = 0.045, se2 = sig * sig + (0.45 * ps) ** 2, amp = sig * sig / se2;
    const kx = 2 * Math.PI * a * 1e-3 / LAMBDA;       // x per nm
    const lutS = NLUT / XMAX;
    for (let j = 0; j < N; j++) {
      const y = (j + 0.5 - N / 2) * ps;
      const fy = y / A_LAT, dy = (fy - Math.round(fy)) * A_LAT;
      const fy2 = fy - 0.5, dy2 = (fy2 - Math.round(fy2)) * A_LAT;
      for (let i = 0; i < N; i++) {
        const x = (i + 0.5 - N / 2) * ps;
        const fx = x / A_LAT, dx = (fx - Math.round(fx)) * A_LAT;
        const fx2 = fx - 0.5, dx2 = (fx2 - Math.round(fx2)) * A_LAT;
        const at = amp * (Math.exp(-(dx * dx + dy * dy) / (2 * se2)) + 0.45 * Math.exp(-(dx2 * dx2 + dy2 * dy2) / (2 * se2)));
        const xr = Math.sqrt(x * x + y * y) * kx * lutS;
        const pr = xr < NLUT ? AIRY[xr | 0] : 0;
        const q = Math.sqrt(pr);                      // gamma 0.5 shows the rings
        const base = 22 + 150 * at;
        const o = (j * N + i) * 4;
        px[o] = Math.min(255, base * (1 - 0.35 * q) + 255 * q);
        px[o + 1] = Math.min(255, base * (1 - 0.35 * q) + 150 * q);
        px[o + 2] = Math.min(255, base * 1.05 * (1 - 0.35 * q) + 40 * q);
        px[o + 3] = 255;
      }
    }
    ctx.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = true;
    g.drawImage(offR, 0, 0, w, w);
    // FWHM circle
    const rpx = fw / 2 / L * w;
    g.setLineDash([4, 3]); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 1.2;
    g.beginPath(); g.arc(w / 2, w / 2, Math.max(2, rpx), 0, 2 * Math.PI); g.stroke(); g.setLineDash([]);
    // scale bar
    const bar = niceBar(L / 4), bl = bar / L * w;
    g.fillStyle = "#fff"; g.fillRect(12, w - 16, bl, 4);
    label(g, fmtLen(bar), 12, w - 22);
    label(g, "probe on a 0.4 nm crystal (real space)", 8, 17);
    label(g, "FWHM " + fmtLen(fw), w - 108, w - 12, "rgb(255,190,110)");
  }

  function drawDiff(a) {
    const [g, w, dpr] = setup(cvD);
    const N = Math.min(640, Math.round(w * dpr));
    const ctx = offD.getContext("2d");
    if (offD.width !== N || !bufD) {
      offD.width = N; offD.height = N;
      bufD = { id: ctx.createImageData(N, N), I: new Float32Array(N * N), C: new Uint8Array(N * N) };
    }
    const id = bufD.id, px = id.data;
    const H = Math.max(20, 1.4 * a + 14);        // half field of view (mrad)
    const mpp = 2 * H / N;                        // mrad per pixel
    const r = Math.max(a, 1.4 * mpp * dpr);       // keep tiny spots visible
    const nMax = Math.ceil((H + r) / G_MRAD);
    const I = [];                                  // disk weights by index
    for (let m = -nMax; m <= nMax; m++) for (let n = -nMax; n <= nMax; n++) {
      const gg = Math.hypot(m, n) * G_MRAD;
      I.push(m || n ? 0.6 * Math.exp(-gg * gg / (2 * 11 * 11)) * (1 - 0.3 * ((m + n) & 1)) : 1);
    }
    const W1 = nMax * 2 + 1;
    const cnt = new Int16Array(N + 1), acc = new Float32Array(N + 1);
    const toPix = v => v / mpp + N / 2;
    // intensity per unit area falls as 1/alpha^2, so fixed log display
    let vmax = 0;
    const rowI = new Float32Array(N), rowC = new Int16Array(N);
    const Ibuf = bufD.I, Cbuf = bufD.C;
    for (let j = 0; j < N; j++) {
      const ky = (j + 0.5 - N / 2) * mpp;
      cnt.fill(0); acc.fill(0);
      const m0 = Math.ceil((ky - r) / G_MRAD), m1 = Math.floor((ky + r) / G_MRAD);
      for (let m = Math.max(-nMax, m0); m <= Math.min(nMax, m1); m++) {
        const dy = ky - m * G_MRAD, s = Math.sqrt(Math.max(0, r * r - dy * dy));
        for (let n = -nMax; n <= nMax; n++) {
          const gx = n * G_MRAD;
          const i0 = Math.max(0, Math.round(toPix(gx - s))), i1 = Math.min(N, Math.round(toPix(gx + s)));
          if (i1 <= i0) continue;
          const wI = I[(m + nMax) * W1 + (n + nMax)];
          cnt[i0]++; cnt[i1]--; acc[i0] += wI; acc[i1] -= wI;
        }
      }
      let c = 0, s = 0;
      for (let i = 0; i < N; i++) {
        c += cnt[i]; s += acc[i];
        rowC[i] = c; rowI[i] = s;
      }
      for (let i = 0; i < N; i++) {
        Ibuf[j * N + i] = rowI[i]; Cbuf[j * N + i] = Math.min(255, rowC[i]);
        if (rowI[i] > vmax) vmax = rowI[i];
      }
    }
    const Lg = 1 / vmax;
    for (let q = 0; q < N * N; q++) {
      const n = Cbuf[q], o = q * 4;
      if (!n) { px[o] = 4; px[o + 1] = 6; px[o + 2] = 14; px[o + 3] = 255; continue; }
      const v = Math.sqrt(Ibuf[q] * Lg);        // gamma 0.5 display
      const ci = Math.min(255, Math.round((0.18 + 0.82 * v) * 255)) * 3;
      let R = LUT[ci], G = LUT[ci + 1], B = LUT[ci + 2];
      if (n >= 2) {
        // alternate the tint with overlap parity so every lens-shaped zone
        // stands out, even when many disks overlap
        const t = n & 1 ? 0.24 : 0.55, sh = 0.35 + 0.65 * v;
        R = R * (1 - t) + TINT[0] * sh * t;
        G = G * (1 - t) + TINT[1] * sh * t;
        B = B * (1 - t) + TINT[2] * sh * t;
      }
      px[o] = R; px[o + 1] = G; px[o + 2] = B; px[o + 3] = 255;
    }
    ctx.putImageData(id, 0, 0);
    g.imageSmoothingEnabled = true;
    g.drawImage(offD, 0, 0, w, w);
    const sc = w / (2 * H), cx = w / 2, cy = w / 2;
    // faint outlines of every disk once they overlap: the lens network
    if (2 * a > G_MRAD) {
      g.strokeStyle = "rgba(255,255,255,0.13)"; g.lineWidth = 1;
      const nn = Math.min(4, Math.ceil((H + a) / G_MRAD));
      for (let m = -nn; m <= nn; m++) for (let n = -nn; n <= nn; n++) {
        g.beginPath(); g.arc(cx + n * G_MRAD * sc, cy + m * G_MRAD * sc, a * sc, 0, 2 * Math.PI); g.stroke();
      }
    }
    // outline central disk and first neighbors
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 1.2;
    for (const [m, n] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (m || n) { g.setLineDash([3, 3]); g.strokeStyle = "rgba(255,255,255,0.45)"; }
      g.beginPath(); g.arc(cx + n * G_MRAD * sc, cy + m * G_MRAD * sc, Math.max(2, r * sc), 0, 2 * Math.PI); g.stroke();
      g.setLineDash([]);
    }
    // alpha radius marker on the central disk
    if (a * sc > 14) {
      const ang = -Math.PI / 4, ex = cx + Math.cos(ang) * a * sc, ey = cy + Math.sin(ang) * a * sc;
      g.strokeStyle = "#fff"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke();
      label(g, "α", (cx + ex) / 2 + 4, (cy + ey) / 2 - 2);
    }
    // Bragg spacing bracket under the pattern center
    const by = w - 36;
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(cx, by - 4); g.lineTo(cx, by + 4); g.moveTo(cx, by);
    g.lineTo(cx + G_MRAD * sc, by); g.moveTo(cx + G_MRAD * sc, by - 4); g.lineTo(cx + G_MRAD * sc, by + 4); g.stroke();
    label(g, G_MRAD.toFixed(1) + " mrad", cx + G_MRAD * sc + 6, by + 4);
    const bar = niceBar(H / 2.5), bl = bar * sc;
    g.fillStyle = "#fff"; g.fillRect(12, w - 16, bl, 4);
    label(g, bar + " mrad", 12, w - 22);
    label(g, "diffraction pattern (disks of radius α)", 8, 17);
  }

  let pend = 0;
  function draw() {
    if (pend) return;
    pend = requestAnimationFrame(() => {
      pend = 0;
      const a = alpha();
      drawReal(a); drawDiff(a);
      root.querySelector(".w-av").textContent = (a < 1 ? a.toFixed(2) : a < 10 ? a.toFixed(1) : a.toFixed(0)) + " mrad";
      root.querySelector(".w-fw").textContent = fmtLen(fwhmNm(a));
      const ov = 2 * a / G_MRAD;
      root.querySelector(".w-ov").textContent = ov.toFixed(2) + (ov < 1 ? " (separated)" : ov < 2 ? " (partial overlap)" : " (multiple overlap)");
      const [t, d] = regime(a);
      root.querySelector(".w-status").innerHTML = `<b>${t}.</b> ${d}`;
    });
  }
  inA.addEventListener("input", draw);
  new ResizeObserver(draw).observe(cvR);
  syncTheme();
  return () => { obs.disconnect(); if (pend) cancelAnimationFrame(pend); };
}

export default { render, fwhmNm };
