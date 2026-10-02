// Stylized in-world signage for each workplace, drawn on canvas in the colors
// of the real brands (from reference photos), simplified to fit the soft style.
// Each function is a TextPanel `draw(ctx, w, h)`.

const center = (ctx) => {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
};

const roundRect = (ctx, x, y, w, h, r, fill, stroke, lw) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
};

/* ------------------------------ Performance Lab ------------------------------ */

// Wordmark with the signature O cut by a diagonal gap
export const equinox = (ctx, w, h) => {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const size = h * 0.36;
  ctx.font = `600 ${size}px Poppins, sans-serif`;
  const letters = ["E", "Q", "U", "I", "N", "O", "X"];
  const step = w * 0.12;
  const x0 = w / 2 - step * 3;
  const y = h * 0.42;
  letters.forEach((l, i) => {
    const x = x0 + i * step;
    if (l !== "O") return ctx.fillText(l, x, y);
    const r = size * 0.36;
    ctx.lineWidth = size * 0.13;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.moveTo(x + r * 0.9, y - r * 1.3);
    ctx.lineTo(x - r * 0.9, y + r * 1.3);
    ctx.stroke();
  });
  ctx.font = `500 ${h * 0.12}px Poppins, sans-serif`;
  ctx.fillText("IT'S NOT FITNESS. IT'S LIFE.", w / 2, h * 0.8);
};

export const murray = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  // black / blue split circle
  const r = h * 0.34;
  const cx = w * 0.2;
  const cy = h / 2;
  ctx.fillStyle = "#1d4ed8";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.arc(cx, cy - r / 2, r / 2, Math.PI / 2, -Math.PI / 2, true);
  ctx.arc(cx, cy + r / 2, r / 2, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1e3a8a";
  ctx.font = `800 ${h * 0.3}px Poppins, sans-serif`;
  ctx.fillText("MURRAY", w * 0.38, h * 0.4);
  ctx.fillStyle = "#1e293b";
  ctx.font = `500 ${h * 0.12}px Poppins, sans-serif`;
  ctx.fillText("ATHLETIC DEVELOPMENT", w * 0.38, h * 0.68);
};

export const luxfit = (ctx, w, h) => {
  ctx.fillStyle = "#3f3f46";
  ctx.fillRect(0, 0, w, h);
  center(ctx);
  ctx.fillStyle = "#facc15";
  ctx.font = `800 ${h * 0.5}px Poppins, sans-serif`;
  ctx.fillText("LUXFIT", w / 2, h * 0.55);
  // square brackets
  ctx.lineWidth = h * 0.07;
  ctx.strokeStyle = "#facc15";
  const bx = w * 0.12;
  const bw = w * 0.05;
  [
    [bx, 1],
    [w - bx, -1],
  ].forEach(([x, dir]) => {
    ctx.beginPath();
    ctx.moveTo(x + dir * bw, h * 0.18);
    ctx.lineTo(x, h * 0.18);
    ctx.lineTo(x, h * 0.86);
    ctx.lineTo(x + dir * bw, h * 0.86);
    ctx.stroke();
  });
};

// Navy circle with stacked serif "Bay / Club", matching their logo
export const bayClubBadge = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#26386b";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = `400 ${h * 0.3}px Georgia, 'Times New Roman', serif`;
  ctx.fillText("Bay", w * 0.86, h * 0.5);
  ctx.fillText("Club", w * 0.86, h * 0.78);
};

// Painted on the turf itself, in the logo's serif
export const bayClubTurf = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `400 ${h * 0.6}px Georgia, 'Times New Roman', serif`;
  ctx.fillText("Bay Club", w / 2, h / 2);
};

export const skrapPack = (ctx, w, h) => {
  // white padded wall panels
  ctx.fillStyle = "#f5f5f4";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#d6d3d1";
  ctx.lineWidth = w * 0.006;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo((w * i) / 4, 0);
    ctx.lineTo((w * i) / 4, h);
    ctx.stroke();
  }
  center(ctx);
  ctx.fillStyle = "#0a0a0a";
  ctx.save();
  ctx.translate(w * 0.45, h * 0.32);
  ctx.transform(1, 0, -0.25, 1, 0, 0);
  ctx.font = `900 ${h * 0.26}px Poppins, sans-serif`;
  ctx.fillText("SKRAP", 0, 0);
  ctx.fillText("PACK", -w * 0.04, h * 0.27);
  ctx.restore();
  ctx.font = `italic 500 ${h * 0.15}px Georgia, serif`;
  ctx.fillText("Marina", w * 0.72, h * 0.84);
};

/* ----------------------------- Front of House Café --------------------------- */

export const presidio = (ctx, w, h) => {
  roundRect(ctx, 0, 0, w, h, h * 0.04, "#9f1239");
  roundRect(ctx, w * 0.025, h * 0.1, w * 0.95, h * 0.8, h * 0.02, "#fdfcf8");
  ctx.fillStyle = "#9f1239";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `italic 400 ${h * 0.46}px Georgia, serif`;
  ctx.fillText("Presidio", w * 0.06, h * 0.5);
  ctx.font = `600 ${h * 0.2}px Poppins, sans-serif`;
  ctx.letterSpacing = `${h * 0.03}px`;
  ctx.fillText("SOCIAL CLUB", w * 0.44, h * 0.52);
  ctx.letterSpacing = "0px";
  ctx.textAlign = "right";
  ctx.font = `italic 400 ${h * 0.13}px Georgia, serif`;
  ctx.fillText("Restaurant", w * 0.95, h * 0.36);
  ctx.fillText("Bar • Cocktails", w * 0.95, h * 0.62);
};

export const magicFlute = (ctx, w, h) => {
  // weathered wood hanging sign
  roundRect(ctx, 0, 0, w, h, w * 0.08, "#3b2416");
  roundRect(ctx, w * 0.04, h * 0.04, w * 0.92, h * 0.92, w * 0.06, "#e8d5b0");
  ctx.strokeStyle = "rgba(120,90,60,0.25)";
  ctx.lineWidth = 2;
  for (let y = h * 0.1; y < h * 0.95; y += h * 0.05) {
    ctx.beginPath();
    ctx.moveTo(w * 0.06, y);
    ctx.lineTo(w * 0.94, y + h * 0.01);
    ctx.stroke();
  }
  center(ctx);
  ctx.fillStyle = "#3f4a2a";
  ctx.font = `600 ${h * 0.08}px Georgia, serif`;
  ctx.fillText("3673", w / 2, h * 0.13);
  ctx.font = `italic 700 ${h * 0.13}px Georgia, serif`;
  ctx.fillText("The", w / 2, h * 0.28);
  ctx.fillText("Magic Flute", w / 2, h * 0.43, w * 0.82);
  // the flute
  ctx.fillStyle = "#3b2416";
  roundRect(ctx, w * 0.2, h * 0.53, w * 0.6, h * 0.025, h * 0.01, "#3b2416");
  ctx.fillStyle = "#3f4a2a";
  ctx.font = `700 ${h * 0.09}px Georgia, serif`;
  ctx.fillText("GARDEN", w / 2, h * 0.65);
  ctx.fillText("RISTORANTE", w / 2, h * 0.76, w * 0.84);
  ctx.font = `600 ${h * 0.07}px Georgia, serif`;
  ctx.fillText("Est. 1981", w / 2, h * 0.88);
};

// Dark wood planks, brush-painted four-color circle, white brush lettering
export const kElements = (ctx, w, h) => {
  ctx.fillStyle = "#2a1d14";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,230,200,0.05)" : "rgba(0,0,0,0.18)";
    ctx.fillRect(0, (h * i) / 4, w, h / 4 - 2);
  }
  ctx.strokeStyle = "rgba(255,220,180,0.08)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    const y = (h * (i + 0.5)) / 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.3, y - 6, w * 0.6, y + 6, w, y - 3);
    ctx.stroke();
  }
  // four brush blobs in a ring
  const cx = h * 0.55;
  const cy = h / 2;
  const r = h * 0.17;
  [
    ["#e11d2e", 0, -1],
    ["#f97316", 1, 0],
    ["#9ca3af", 0, 1],
    ["#2563eb", -1, 0],
  ].forEach(([c, dx, dy]) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(cx + dx * r * 0.95, cy + dy * r * 0.95, r * 1.05, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = h * 0.05;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.05, Math.PI * 0.7, Math.PI * 1.35);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.save();
  ctx.transform(1, 0, -0.12, 1, 0, 0);
  ctx.font = `900 ${h * 0.82}px Poppins, sans-serif`;
  ctx.fillText("K", h * 1.15, h * 0.53);
  ctx.font = `800 ${h * 0.3}px Poppins, sans-serif`;
  ctx.fillText("-ELEMENTS", h * 1.68, h * 0.32);
  ctx.font = `800 ${h * 0.34}px Poppins, sans-serif`;
  ctx.fillText("BBQ", h * 2.3, h * 0.72);
  ctx.restore();
};

/* --------------------------------- Flyers --------------------------------- */

export const flyerArt = {
  sierra: (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.31, w * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.31, w * 0.26, 0, Math.PI * 2);
    ctx.fill();
    // mountains + red raft
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.32);
    ctx.lineTo(w * 0.4, h * 0.2);
    ctx.lineTo(w * 0.5, h * 0.29);
    ctx.lineTo(w * 0.6, h * 0.18);
    ctx.lineTo(w * 0.72, h * 0.32);
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    roundRect(ctx, w * 0.35, h * 0.35, w * 0.3, h * 0.06, h * 0.03, "#dc2626");
    // rainbow wordmark
    const grad = ctx.createLinearGradient(w * 0.25, 0, w * 0.75, 0);
    ["#dc2626", "#f59e0b", "#16a34a", "#2563eb", "#7c3aed"].forEach((c, i) => grad.addColorStop(i / 4, c));
    center(ctx);
    ctx.fillStyle = "#dc2626";
    ctx.font = `800 ${w * 0.12}px Poppins, sans-serif`;
    ctx.fillText("SIERRA", w / 2, h * 0.72);
    ctx.fillStyle = grad;
    ctx.font = `800 ${w * 0.13}px Poppins, sans-serif`;
    ctx.fillText("Adventures", w / 2, h * 0.86);
  },
  pureBarre: (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e11d2e";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.36, w * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = w * 0.02;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.36, w * 0.27, 0, Math.PI * 2);
    ctx.stroke();
    center(ctx);
    ctx.fillStyle = "#ffffff";
    ctx.font = `500 ${w * 0.32}px Poppins, sans-serif`;
    ctx.fillText("p", w / 2, h * 0.33);
    ctx.fillStyle = "#e11d2e";
    ctx.font = `700 ${w * 0.1}px Poppins, sans-serif`;
    ctx.fillText("PURE BARRE", w / 2, h * 0.76);
  },
  obour: (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.42, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    center(ctx);
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = w * 0.012;
    ctx.font = `300 ${w * 0.18}px Poppins, sans-serif`;
    ctx.strokeText("OBOUR", w / 2, h * 0.17);
    // little lion silhouette
    ctx.fillStyle = "#0a0a0a";
    ctx.font = `${w * 0.26}px serif`;
    ctx.fillText("🦁", w / 2, h * 0.44);
    // banner
    ctx.beginPath();
    ctx.moveTo(w * 0.14, h * 0.66);
    ctx.lineTo(w * 0.86, h * 0.66);
    ctx.lineTo(w * 0.82, h * 0.74);
    ctx.lineTo(w * 0.86, h * 0.82);
    ctx.lineTo(w * 0.14, h * 0.82);
    ctx.lineTo(w * 0.18, h * 0.74);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#0a0a0a";
    ctx.font = `800 ${w * 0.11}px Poppins, sans-serif`;
    ctx.fillText("FOODS", w / 2, h * 0.745);
    ctx.font = `700 ${w * 0.06}px Poppins, sans-serif`;
    ctx.fillText("SF  ·  CA", w / 2, h * 0.92);
  },
};

/* -------------------------------- AI Sales HQ ------------------------------- */

export const numeral = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#4a4e6e";
  ctx.fillRect(0, 0, w, h * 0.16);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  // folded-corner mark
  ctx.fillStyle = "#1e2340";
  ctx.beginPath();
  ctx.moveTo(w * 0.06, h * 0.72);
  ctx.lineTo(w * 0.06, h * 0.32);
  ctx.lineTo(w * 0.17, h * 0.32);
  ctx.lineTo(w * 0.06, h * 0.72);
  ctx.fill();
  ctx.fillStyle = "#1e2340";
  ctx.font = `700 ${h * 0.3}px Poppins, sans-serif`;
  ctx.fillText("Numeral", w * 0.2, h * 0.5);
  ctx.font = `600 ${h * 0.12}px Poppins, sans-serif`;
  ctx.fillText("Sales tax, solved.", w * 0.2, h * 0.8);
};

export const revyl = (ctx, w, h) => {
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, w, h);
  // dotted grid
  ctx.fillStyle = "rgba(167,139,250,0.18)";
  for (let x = w * 0.04; x < w; x += w * 0.04) for (let y = h * 0.1; y < h; y += h * 0.15) ctx.fillRect(x, y, 2, 2);
  // diamond mark
  const cx = w * 0.14;
  const cy = h * 0.42;
  const r = h * 0.2;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = h * 0.05;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.45);
  ctx.lineTo(cx + r * 0.45, cy);
  ctx.lineTo(cx, cy + r * 0.45);
  ctx.lineTo(cx - r * 0.45, cy);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${h * 0.3}px Poppins, sans-serif`;
  ctx.fillText("Revyl", w * 0.27, h * 0.42);
  ctx.fillStyle = "#c4b5fd";
  ctx.font = `500 ${h * 0.12}px Poppins, sans-serif`;
  ctx.fillText("Build mobile with confidence.", w * 0.27, h * 0.76);
};

export const daloopa = (ctx, w, h) => {
  ctx.fillStyle = "#33141c";
  ctx.fillRect(0, 0, w, h);
  // diagonal chevron, like the site's background
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath();
  ctx.moveTo(w * 0.55, 0);
  ctx.lineTo(w, h * 0.5);
  ctx.lineTo(w * 0.55, h);
  ctx.lineTo(w * 0.75, h);
  ctx.lineTo(w, h * 0.75);
  ctx.lineTo(w, h * 0.25);
  ctx.lineTo(w * 0.75, 0);
  ctx.fill();
  center(ctx);
  ctx.fillStyle = "#ffffff";
  ctx.font = `400 ${h * 0.34}px Georgia, serif`;
  ctx.letterSpacing = `${h * 0.03}px`;
  ctx.fillText("δ DALOOPA", w / 2, h * 0.44);
  ctx.letterSpacing = "0px";
  ctx.font = `400 ${h * 0.11}px Georgia, serif`;
  ctx.fillText("Trusted financial data for public equity", w / 2, h * 0.78);
};

/* -------------------------------- Dev Studio -------------------------------- */

export const kateeva = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  // orange split-circle K mark
  const cx = h * 0.5;
  const cy = h / 2;
  const r = h * 0.32;
  ctx.fillStyle = "#e8642c";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.15, cy);
  ctx.arc(cx, cy, r, Math.PI * 0.6, Math.PI * 1.4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.05, cy);
  ctx.arc(cx, cy, r, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#4b4b4b";
  ctx.font = `italic 700 ${h * 0.5}px Poppins, sans-serif`;
  ctx.fillText("kateeva", h * 0.95, h * 0.5);
};

export const codingTemple = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  const teal = "#12c4a0";
  // meditating coder: head, bun, body, laptop
  const cx = h * 0.5;
  ctx.fillStyle = teal;
  ctx.beginPath();
  ctx.arc(cx, h * 0.12, h * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, h * 0.3, h * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.72, h * 0.4, h * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - h * 0.15, h * 0.58, h * 0.3, h * 0.2);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = teal;
  ctx.font = `700 ${h * 0.36}px Poppins, sans-serif`;
  ctx.fillText("coding", h * 1.05, h * 0.32);
  ctx.font = `400 ${h * 0.36}px Poppins, sans-serif`;
  ctx.fillText("temple", h * 1.05, h * 0.72);
};

export const coLab = (ctx, w, h) => {
  ctx.fillStyle = "#eef2fb";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#f6c94b";
  ctx.beginPath();
  ctx.arc(h * 0.55, h * 0.4, h * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6bb3f5";
  ctx.beginPath();
  ctx.arc(h * 0.4, h * 0.6, h * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4f5ae8";
  ctx.fillRect(h * 0.4, h * 0.4, h * 0.15, h * 0.2);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#111827";
  ctx.font = `700 ${h * 0.4}px Poppins, sans-serif`;
  ctx.fillText("Co.Lab", h * 0.95, h * 0.5);
};

export const gainSpan = (ctx, w, h) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  // orange dots arcing over the name
  ctx.fillStyle = "#f2a51a";
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    ctx.beginPath();
    ctx.arc(w * (0.32 + t * 0.4), h * (0.3 - Math.sin(t * Math.PI) * 0.12), h * (0.06 - t * 0.03), 0, Math.PI * 2);
    ctx.fill();
  }
  const grad = ctx.createLinearGradient(0, h * 0.4, 0, h * 0.8);
  grad.addColorStop(0, "#1f8fa6");
  grad.addColorStop(1, "#0d4f6b");
  center(ctx);
  ctx.fillStyle = grad;
  ctx.font = `italic 800 ${h * 0.36}px Poppins, sans-serif`;
  ctx.fillText("GainSpan", w / 2, h * 0.58);
  ctx.fillStyle = "#1f2937";
  ctx.font = `italic 500 ${h * 0.11}px Poppins, sans-serif`;
  ctx.fillText("Getting Connected with Wi-Fi", w / 2, h * 0.86);
};

/* ------------------------------- OFFTHEWEIGHTS ------------------------------ */

export const offTheWeights = (ctx, w, h) => {
  ctx.fillStyle = "#1c1c1e";
  ctx.fillRect(0, 0, w, h);
  const gold = "#fbb917";
  // emblem ring with a flexing-arm hint
  const cx = w / 2;
  const cy = h * 0.3;
  const r = h * 0.2;
  ctx.strokeStyle = gold;
  ctx.lineWidth = h * 0.025;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.35, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.25, r * 0.55, r * 0.4, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.95, cy - r * 0.2, r * 0.22, r * 0.45, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // wordmark between two curved bars
  center(ctx);
  ctx.font = `800 ${h * 0.24}px Poppins, sans-serif`;
  ctx.fillText("OFFTHEWEIGHTS", w / 2, h * 0.7);
  ctx.lineWidth = h * 0.025;
  [0.53, 0.87].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(w * 0.06, h * y);
    ctx.quadraticCurveTo(w / 2, h * (y - 0.06), w * 0.94, h * y);
    ctx.stroke();
  });
  ctx.font = `600 ${h * 0.07}px Poppins, sans-serif`;
  ctx.fillText("MIND · BODY · SPIRIT", w / 2, h * 0.95);
};
