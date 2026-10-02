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

export const equinox = (ctx, w, h) => {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  center(ctx);
  ctx.fillStyle = "#ffffff";
  ctx.font = `500 ${h * 0.34}px Poppins, sans-serif`;
  ctx.letterSpacing = `${h * 0.08}px`;
  ctx.fillText("EQUINOX", w / 2, h * 0.42);
  ctx.letterSpacing = "0px";
  ctx.font = `500 ${h * 0.12}px Poppins, sans-serif`;
  ctx.fillText("IT'S NOT FITNESS. IT'S LIFE.", w / 2, h * 0.78);
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

export const bayClubBadge = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#1e3a5f";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.48, 0, Math.PI * 2);
  ctx.fill();
  center(ctx);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${h * 0.22}px Poppins, sans-serif`;
  ctx.fillText("Bay", w / 2, h * 0.4);
  ctx.fillText("Club", w / 2, h * 0.62);
};

// Painted on the turf itself
export const bayClubTurf = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  center(ctx);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `600 ${h * 0.55}px Poppins, sans-serif`;
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
  ctx.font = `italic 700 ${h * 0.15}px Georgia, serif`;
  ctx.fillText("The", w / 2, h * 0.28);
  ctx.fillText("Magic Flute", w / 2, h * 0.43);
  // the flute
  ctx.fillStyle = "#3b2416";
  roundRect(ctx, w * 0.2, h * 0.53, w * 0.6, h * 0.025, h * 0.01, "#3b2416");
  ctx.fillStyle = "#3f4a2a";
  ctx.font = `700 ${h * 0.09}px Georgia, serif`;
  ctx.fillText("GARDEN", w / 2, h * 0.65);
  ctx.fillText("RISTORANTE", w / 2, h * 0.76);
  ctx.font = `600 ${h * 0.07}px Georgia, serif`;
  ctx.fillText("Est. 1981", w / 2, h * 0.88);
};

export const kElements = (ctx, w, h) => {
  // dark reclaimed-wood fascia
  ctx.fillStyle = "#2b2622";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let y = h * 0.2; y < h; y += h * 0.2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // four-element circle
  const cx = h * 0.55;
  const cy = h / 2;
  const r = h * 0.36;
  ["#dc2626", "#f59e0b", "#2563eb", "#16a34a"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, (i * Math.PI) / 2 - Math.PI / 2, ((i + 1) * Math.PI) / 2 - Math.PI / 2);
    ctx.fill();
  });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - r * 0.25, cy - r * 0.25, r * 0.5, r * 0.5);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${h * 0.34}px Poppins, sans-serif`;
  ctx.fillText("K-ELEMENTS", h * 1.05, h * 0.36);
  ctx.font = `800 ${h * 0.3}px Poppins, sans-serif`;
  ctx.fillText("BBQ", h * 1.05, h * 0.72);
};

/* --------------------------------- Flyers --------------------------------- */

export const flyerArt = {
  sierra: (ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.36, w * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.36, w * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // mountains + red raft
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.moveTo(w * 0.24, h * 0.36);
    ctx.lineTo(w * 0.38, h * 0.22);
    ctx.lineTo(w * 0.5, h * 0.33);
    ctx.lineTo(w * 0.62, h * 0.2);
    ctx.lineTo(w * 0.76, h * 0.36);
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    roundRect(ctx, w * 0.32, h * 0.4, w * 0.36, h * 0.07, h * 0.035, "#dc2626");
    // rainbow wordmark
    const grad = ctx.createLinearGradient(w * 0.25, 0, w * 0.75, 0);
    ["#dc2626", "#f59e0b", "#16a34a", "#2563eb", "#7c3aed"].forEach((c, i) => grad.addColorStop(i / 4, c));
    center(ctx);
    ctx.fillStyle = "#dc2626";
    ctx.font = `800 ${w * 0.07}px Poppins, sans-serif`;
    ctx.fillText("SIERRA", w / 2, h * 0.62);
    ctx.fillStyle = grad;
    ctx.font = `800 ${w * 0.13}px Poppins, sans-serif`;
    ctx.fillText("Adventures", w / 2, h * 0.76);
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
