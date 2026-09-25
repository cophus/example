// strain-lattice.js
// AnyWidget: strain mapping from Bragg disk positions. A reference reciprocal
// lattice (origin r0, lattice vectors u and v, disks labeled by index) is
// compared with the measured lattice of a strained crystal. Sliders set the
// real-space strain exx, eyy, exy and rotation theta; the real-space lattice
// (inset) deforms by F = R(theta)(I + eps), while the diffraction spots move by
// the inverse transpose F^-T, so tension in real space pulls the spots closer
// together. Reference disks are faint outlines, measured disks are filled.
// The strain is recovered by a least-squares fit of r0, u, v to all measured
// disks; "add noise" jitters the measured positions and compares the fitted
// strain with the true strain.
//
//   :::{anywidget} ../../widgets/strain-lattice.js
//   :::

// least-squares lattice fit: q = r0 + h u + k v for every measured disk
function fitLattice(pts) {
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], bx = [0, 0, 0], by = [0, 0, 0];
  for (const p of pts) {
    const row = [1, p.h, p.k];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) S[i][j] += row[i] * row[j];
      bx[i] += row[i] * p.x; by[i] += row[i] * p.y;
    }
  }
  const solve = b => {
    const M = S.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < 3; c++) {
      let piv = c;
      for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      [M[c], M[piv]] = [M[piv], M[c]];
      for (let r = 0; r < 3; r++) if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
      }
    }
    return M.map((r, i) => r[3] / r[i]);
  };
  const X = solve(bx), Y = solve(by);
  return { r0: [X[0], Y[0]], u: [X[1], Y[1]], v: [X[2], Y[2]] };
}
// strain from measured reciprocal vectors (reference u0 = x, v0 = y, unit
// length): B' = [u v] = F^-T  ->  F = B'^-T, then polar split F = R U
function strainFromUV(u, v) {
  const a = u[0], b = v[0], c = u[1], d = v[1];     // B' = [[a b],[c d]]
  const det = a * d - b * c;
  // B'^-1 = [[d -b],[-c a]]/det ; F = (B'^-1)^T
  const F = [[d / det, -c / det], [-b / det, a / det]];
  const th = Math.atan2(F[1][0] - F[0][1], F[0][0] + F[1][1]);
  const cs = Math.cos(th), sn = Math.sin(th);
  // U = R(-th) F
  const U = [[cs * F[0][0] + sn * F[1][0], cs * F[0][1] + sn * F[1][1]],
             [-sn * F[0][0] + cs * F[1][0], -sn * F[0][1] + cs * F[1][1]]];
  return { exx: U[0][0] - 1, eyy: U[1][1] - 1, exy: (U[0][1] + U[1][0]) / 2, th };
}

function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

function render({ model, el }) {
  const uid = "sl" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; }
.${uid}.w-dark { --w-panel:#221f1e; --w-fg:#eee; --w-muted:#999; --w-border:#3a3735;
  --w-accent:rgb(255,63,63); }
.${uid} .w-row { display:flex; gap:10px; flex-wrap:wrap; }
.${uid} .w-main { flex:2 1 320px; min-width:280px; }
.${uid} .w-side { flex:1 1 200px; min-width:190px; display:flex; flex-direction:column; gap:8px; }
.${uid} canvas { border:1px solid var(--w-border); border-radius:8px; display:block; width:100%; }
.${uid} canvas.w-dp { background:#0b0a0a; }
.${uid} canvas.w-rs { background:var(--w-panel); }
.${uid} table { border-collapse:collapse; font-size:13px; width:100%; font-variant-numeric:tabular-nums; }
.${uid} th, .${uid} td { padding:3px 6px; text-align:right; border-bottom:1px solid var(--w-border); }
.${uid} th { color:var(--w-muted); font-weight:500; }
.${uid} td:first-child, .${uid} th:first-child { text-align:left; }
.${uid} td.w-fit { color:var(--w-accent); font-weight:600; }
.${uid} .w-note { font-size:12.5px; color:var(--w-muted); line-height:1.45; }
.${uid} .w-note b { color:var(--w-fg); font-variant-numeric:tabular-nums; }
.${uid} .w-bar { display:flex; gap:14px; align-items:center; margin-top:8px; font-size:13px;
  color:var(--w-muted); flex-wrap:wrap; }
.${uid} .w-bar label { display:flex; align-items:center; gap:6px; }
.${uid} .w-bar b { color:var(--w-fg); font-variant-numeric:tabular-nums; min-width:48px; display:inline-block; }
.${uid} input[type=range] { width:100px; accent-color:var(--w-accent); }
.${uid} input[type=checkbox] { accent-color:var(--w-accent); }
.${uid} button { border:1px solid var(--w-border); border-radius:6px; background:var(--w-panel);
  color:var(--w-fg); padding:3px 10px; cursor:pointer; font-size:13px; }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-row">
  <div class="w-main"><canvas class="w-dp"></canvas></div>
  <div class="w-side">
    <canvas class="w-rs"></canvas>
    <table><thead><tr><th></th><th>true</th><th>fitted</th></tr></thead><tbody class="w-tb"></tbody></table>
    <div class="w-note"></div>
  </div>
</div>
<div class="w-bar">
  <label>ε<sub>xx</sub> <input class="w-exx" type="range" min="-5" max="5" step="0.1" value="3"><b class="w-exxv"></b></label>
  <label>ε<sub>yy</sub> <input class="w-eyy" type="range" min="-5" max="5" step="0.1" value="0"><b class="w-eyyv"></b></label>
  <label>ε<sub>xy</sub> <input class="w-exy" type="range" min="-5" max="5" step="0.1" value="0"><b class="w-exyv"></b></label>
  <label>θ <input class="w-th" type="range" min="-5" max="5" step="0.1" value="0"><b class="w-thv"></b></label>
</div>
<div class="w-bar">
  <label><input class="w-noise" type="checkbox"> add noise</label>
  <button class="w-renoise">new noise</button>
  <label><input class="w-shift" type="checkbox" checked> show shifts ×5</label>
  <button class="w-reset">reset</button>
</div>`;
  el.appendChild(style); el.appendChild(root);
  const cap = document.createElement("div");
  cap.style.cssText = "margin:10px 2px 0 2px; font-size:13.5px; line-height:1.5; color:var(--w-muted);";
  cap.innerHTML = "<b style='color:var(--w-fg)'>Strain from Bragg disk positions.</b> Stretching the crystal in real space moves the diffraction spots closer together: reciprocal lattice vectors transform with the inverse transpose of the deformation. Fitting r<sub>0</sub>, u and v to every disk at once averages down the position noise.";
  root.appendChild(cap);

  const cvD = root.querySelector(".w-dp"), cvR = root.querySelector(".w-rs");
  const ins = ["exx", "eyy", "exy", "th"].map(k => root.querySelector(".w-" + k));
  const chkN = root.querySelector(".w-noise"), chkS = root.querySelector(".w-shift");
  let seed = 11;

  function dark() { return document.documentElement.classList.contains("dark"); }
  function syncTheme() { root.classList.toggle("w-dark", dark()); draw(); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  function setup(cv, aspect) {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 300, h = Math.round(w * aspect);
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    }
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [g, w, h];
  }
  function arrow(g, x0, y0, x1, y1, col, lw, dash) {
    const a = Math.atan2(y1 - y0, x1 - x0), hl = 9;
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw;
    g.setLineDash(dash || []);
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - Math.cos(a) * hl * 0.8, y1 - Math.sin(a) * hl * 0.8); g.stroke();
    g.setLineDash([]);
    g.beginPath(); g.moveTo(x1, y1);
    g.lineTo(x1 - hl * Math.cos(a - 0.4), y1 - hl * Math.sin(a - 0.4));
    g.lineTo(x1 - hl * Math.cos(a + 0.4), y1 - hl * Math.sin(a + 0.4)); g.closePath(); g.fill();
  }
  function label(g, txt, x, y, col, font) {
    g.font = font || "12.5px system-ui"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,0.75)";
    g.strokeText(txt, x, y); g.fillStyle = col || "#eee"; g.fillText(txt, x, y);
  }
  const pct = v => (v >= 0 ? "+" : "") + (v * 100).toFixed(2) + "%";
  const deg = v => (v >= 0 ? "+" : "") + (v * 180 / Math.PI).toFixed(2) + "°";

  function draw() {
    const isD = dark();
    const eps = { exx: +ins[0].value / 100, eyy: +ins[1].value / 100, exy: +ins[2].value / 100 };
    const th = +ins[3].value * Math.PI / 180;
    const cs = Math.cos(th), sn = Math.sin(th);
    // F = R (I + eps)
    const E = [[1 + eps.exx, eps.exy], [eps.exy, 1 + eps.eyy]];
    const F = [[cs * E[0][0] - sn * E[1][0], cs * E[0][1] - sn * E[1][1]],
               [sn * E[0][0] + cs * E[1][0], sn * E[0][1] + cs * E[1][1]]];
    const det = F[0][0] * F[1][1] - F[0][1] * F[1][0];
    // B' = F^-T = [[F11 -F10],[-F01 F00]]/det  (reference B = identity)
    const B = [[F[1][1] / det, -F[1][0] / det], [-F[0][1] / det, F[0][0] / det]];
    const U = [B[0][0], B[1][0]], V = [B[0][1], B[1][1]];

    // ---------- diffraction panel ----------
    const [g, w, h] = setup(cvD, 1);
    g.fillStyle = "#0b0a0a"; g.fillRect(0, 0, w, h);
    const G0 = w * 0.118, cx = w / 2, cy = h / 2 + 6, rd = G0 * 0.2;
    const S = (x, y) => [cx + x * G0, cy - y * G0];   // math y up
    const rng = makeRng(seed);
    const gauss = () => { const u = Math.max(1e-9, rng()), v2 = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v2); };
    const sigma = chkN.checked ? 0.025 : 0;           // in units of |g|
    const pts = [];
    for (let hh = -4; hh <= 4; hh++) for (let kk = -4; kk <= 4; kk++) {
      const rx = hh, ry = kk;
      const mx = hh * U[0] + kk * V[0], my = hh * U[1] + kk * V[1];
      if (Math.hypot(rx, ry) * G0 > w * 0.47 - rd) continue;
      const nx = gauss() * sigma, ny = gauss() * sigma;
      pts.push({ h: hh, k: kk, rx, ry, tx: mx, ty: my, mx: mx + nx, my: my + ny });
    }
    // reference outlines
    g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 1.2; g.setLineDash([3, 3]);
    for (const p of pts) { const [x, y] = S(p.rx, p.ry); g.beginPath(); g.arc(x, y, rd, 0, 2 * Math.PI); g.stroke(); }
    g.setLineDash([]);
    // measured disks: glowing fill, brightness falling with |g|
    for (const p of pts) {
      const [x, y] = S(p.mx, p.my);
      const I = p.h || p.k ? 0.35 + 0.65 * Math.exp(-(p.h * p.h + p.k * p.k) / 5) : 1;
      const gr = g.createRadialGradient(x, y, 0, x, y, rd);
      gr.addColorStop(0, `rgba(255,${Math.round(200 + 55 * I)},${Math.round(120 + 110 * I)},${0.35 + 0.65 * I})`);
      gr.addColorStop(0.8, `rgba(255,${Math.round(120 + 60 * I)},40,${0.25 + 0.6 * I})`);
      gr.addColorStop(1, "rgba(255,90,20,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rd * 1.05, 0, 2 * Math.PI); g.fill();
    }
    // exaggerated shift arrows
    if (chkS.checked) {
      for (const p of pts) {
        const dx = (p.tx - p.rx) * 5, dy = (p.ty - p.ry) * 5;
        if (Math.hypot(dx, dy) * G0 < 3) continue;
        const [x0, y0] = S(p.rx, p.ry), [x1, y1] = S(p.rx + dx, p.ry + dy);
        g.globalAlpha = 0.8;
        arrow(g, x0, y0, x1, y1, "rgb(190,160,255)", 1.3);
        g.globalAlpha = 1;
      }
    }
    // fit
    const fit = fitLattice(pts.map(p => ({ h: p.h, k: p.k, x: p.mx, y: p.my })));
    const fs = strainFromUV(fit.u, fit.v);
    if (sigma > 0) {
      g.strokeStyle = "rgba(120,255,160,0.9)"; g.lineWidth = 1.2;
      for (const p of pts) {
        const [x, y] = S(fit.r0[0] + p.h * fit.u[0] + p.k * fit.v[0], fit.r0[1] + p.h * fit.u[1] + p.k * fit.v[1]);
        g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 4, y); g.moveTo(x, y - 4); g.lineTo(x, y + 4); g.stroke();
      }
    }
    // index labels
    for (const p of pts) {
      if (Math.abs(p.h) + Math.abs(p.k) > 2) continue;
      const [x, y] = S(p.mx, p.my);
      label(g, `(${p.h},${p.k})`, x + rd * 0.75, y + rd + 11, "rgba(235,235,235,0.9)", "11px system-ui");
    }
    // lattice vectors: reference dashed, measured solid
    const O = S(0, 0);
    const colU = "rgb(255,80,80)", colV = "rgb(80,200,255)";
    arrow(g, O[0], O[1], ...S(1, 0), "rgba(255,120,120,0.55)", 1.4, [4, 3]);
    arrow(g, O[0], O[1], ...S(0, 1), "rgba(120,210,255,0.55)", 1.4, [4, 3]);
    arrow(g, O[0], O[1], ...S(U[0], U[1]), colU, 2.4);
    arrow(g, O[0], O[1], ...S(V[0], V[1]), colV, 2.4);
    const Ul = S(U[0] * 0.55, U[1] * 0.55), Vl = S(V[0] * 0.55, V[1] * 0.55);
    label(g, "u", Ul[0] - 3, Ul[1] - 8, colU, "bold 14px system-ui");
    label(g, "v", Vl[0] - 16, Vl[1] + 4, colV, "bold 14px system-ui");
    // r0 from the panel corner
    const ry0 = O[1] - G0 / 2;
    arrow(g, 6, ry0, O[0] - rd * 0.8, O[1] - rd * 0.5, "rgba(230,230,230,0.8)", 1.4);
    label(g, "r₀", 10, ry0 - 6, "#eee", "bold 13px system-ui");
    label(g, "reciprocal space: dashed = reference, filled = measured", 8, 17);
    if (sigma > 0) label(g, "+ = least-squares fitted lattice", 8, h - 10, "rgb(120,255,160)");

    // ---------- real-space inset ----------
    {
      const [q, wr, hr] = setup(cvR, 0.8);
      q.fillStyle = isD ? "#221f1e" : "#ffffff"; q.fillRect(0, 0, wr, hr);
      const a = wr * 0.13, ox = wr / 2, oy = hr / 2 + 6;
      const P = (x, y) => [ox + a * x, oy - a * y];
      const fg = isD ? "#eee" : "#222", ghost = isD ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
      // reference and deformed unit cells
      const cell = M => [[0, 0], [1, 0], [1, 1], [0, 1]].map(([i, j]) => P(M[0][0] * i + M[0][1] * j, M[1][0] * i + M[1][1] * j));
      const I2 = [[1, 0], [0, 1]];
      q.fillStyle = isD ? "rgba(255,63,63,0.22)" : "rgba(204,0,0,0.13)";
      const cd = cell(F);
      q.beginPath(); cd.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); q.fill();
      q.strokeStyle = isD ? "rgb(255,63,63)" : "rgb(204,0,0)"; q.lineWidth = 1.5; q.stroke();
      const cr = cell(I2);
      q.setLineDash([3, 3]); q.strokeStyle = ghost; q.lineWidth = 1.2;
      q.beginPath(); cr.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); q.stroke();
      q.setLineDash([]);
      for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
        const [xr, yr] = P(i, j);
        const [xd, yd] = P(F[0][0] * i + F[0][1] * j, F[1][0] * i + F[1][1] * j);
        q.strokeStyle = ghost; q.lineWidth = 1;
        q.beginPath(); q.arc(xr, yr, a * 0.22, 0, 2 * Math.PI); q.stroke();
        q.fillStyle = fg;
        q.beginPath(); q.arc(xd, yd, a * 0.16, 0, 2 * Math.PI); q.fill();
      }
      q.fillStyle = isD ? "#221f1e" : "#ffffff"; q.fillRect(0, 0, wr, 22);
      q.fillStyle = isD ? "#ccc" : "#444"; q.font = "12.5px system-ui";
      q.fillText("real-space lattice", 8, 16);
    }

    // ---------- readouts ----------
    const trueV = [eps.exx, eps.eyy, eps.exy, th];
    const fitV = [fs.exx, fs.eyy, fs.exy, fs.th];
    const names = ["ε<sub>xx</sub>", "ε<sub>yy</sub>", "ε<sub>xy</sub>", "θ"];
    root.querySelector(".w-tb").innerHTML = names.map((n, i) =>
      `<tr><td>${n}</td><td>${i < 3 ? pct(trueV[i]) : deg(trueV[i])}</td><td class="w-fit">${i < 3 ? pct(fitV[i]) : deg(fitV[i])}</td></tr>`).join("");
    const a1 = Math.hypot(F[0][0], F[1][0]) - 1, g10 = Math.hypot(U[0], U[1]) - 1;
    const a2 = Math.hypot(F[0][1], F[1][1]) - 1, g01 = Math.hypot(V[0], V[1]) - 1;
    let res = 0;
    for (const p of pts) {
      res += (p.mx - fit.r0[0] - p.h * fit.u[0] - p.k * fit.v[0]) ** 2 + (p.my - fit.r0[1] - p.h * fit.u[1] - p.k * fit.v[1]) ** 2;
    }
    res = Math.sqrt(res / pts.length);
    root.querySelector(".w-note").innerHTML =
      `real |a₁| <b>${pct(a1)}</b> → |g(1,0)| <b>${pct(g10)}</b><br>` +
      `real |a₂| <b>${pct(a2)}</b> → |g(0,1)| <b>${pct(g01)}</b><br>` +
      `${pts.length} disks fitted` + (sigma > 0 ? `, rms residual <b>${(res * 100).toFixed(1)}%</b> of |g|` : "");
    ["exx", "eyy", "exy"].forEach((k, i) => root.querySelector(`.w-${k}v`).textContent = pct(trueV[i]).replace(".00", ".0"));
    root.querySelector(".w-thv").textContent = deg(th);
  }
  let pend = 0;
  const schedule = () => { if (!pend) pend = requestAnimationFrame(() => { pend = 0; draw(); }); };
  for (const i of [...ins, chkN, chkS]) i.addEventListener("input", schedule);
  root.querySelector(".w-renoise").addEventListener("click", () => { seed = (seed * 48271) % 2147483647; chkN.checked = true; schedule(); });
  root.querySelector(".w-reset").addEventListener("click", () => { ins.forEach(i => i.value = 0); schedule(); });
  new ResizeObserver(schedule).observe(cvD);
  syncTheme();
  return () => { obs.disconnect(); if (pend) cancelAnimationFrame(pend); };
}

export default { render, fitLattice, strainFromUV };
