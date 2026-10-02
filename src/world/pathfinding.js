// Grid A* over the walkable area, so click-to-walk routes around the fountain,
// trees, buildings, and furniture instead of walking straight into them.
//
// The current scene registers its layout in `navMap` (see Island / Interior):
//   bounds:    { type: "circle", r } | { type: "rect", hw, hd }
//   obstacles: { type: "circle", x, z, r } | { type: "rect", x, z, hw, hd, rot? }
//   (rot: the object's y-rotation, for buildings that face the plaza)

const CELL = 0.4;
const CLEARANCE = 0.45; // player radius plus a little margin

export const navMap = { bounds: null, obstacles: [] };

export const setNavMap = (bounds, obstacles) => {
  navMap.bounds = bounds;
  navMap.obstacles = obstacles;
};

const blocked = (x, z) => {
  const { bounds, obstacles } = navMap;
  if (bounds) {
    if (bounds.type === "circle" && Math.hypot(x, z) > bounds.r - CLEARANCE) return true;
    if (bounds.type === "rect" && (Math.abs(x) > bounds.hw - CLEARANCE || Math.abs(z) > bounds.hd - CLEARANCE)) return true;
  }
  for (const o of obstacles) {
    if (o.type === "circle") {
      if (Math.hypot(x - o.x, z - o.z) < o.r + CLEARANCE) return true;
    } else {
      let dx = x - o.x;
      let dz = z - o.z;
      if (o.rot) {
        // into the object's local frame (inverse y-rotation)
        const c = Math.cos(o.rot);
        const s = Math.sin(o.rot);
        [dx, dz] = [dx * c - dz * s, dx * s + dz * c];
      }
      if (Math.abs(dx) < o.hw + CLEARANCE && Math.abs(dz) < o.hd + CLEARANCE) return true;
    }
  }
  return false;
};

// Is the straight segment a -> b clear? (sampled every quarter cell)
const lineClear = (ax, az, bx, bz) => {
  const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / (CELL * 0.25));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (blocked(ax + (bx - ax) * t, az + (bz - az) * t)) return false;
  }
  return true;
};

const extent = () => {
  const b = navMap.bounds;
  if (!b) return { hw: 30, hd: 30 };
  return b.type === "circle" ? { hw: b.r, hd: b.r } : { hw: b.hw, hd: b.hd };
};

// Returns waypoints [{x, z}, ...] ending at (or near) the goal, or null.
export const findPath = (sx, sz, gx, gz) => {
  if (lineClear(sx, sz, gx, gz) && !blocked(gx, gz)) return [{ x: gx, z: gz }];

  const { hw, hd } = extent();
  const cols = Math.ceil((hw * 2) / CELL);
  const rows = Math.ceil((hd * 2) / CELL);
  const toCell = (x, z) => [
    Math.max(0, Math.min(cols - 1, Math.round((x + hw) / CELL))),
    Math.max(0, Math.min(rows - 1, Math.round((z + hd) / CELL))),
  ];
  const toWorld = (c, r) => ({ x: c * CELL - hw, z: r * CELL - hd });
  const free = (c, r) => {
    const p = toWorld(c, r);
    return !blocked(p.x, p.z);
  };

  // If the goal is inside an obstacle (e.g. a click on a building), aim for
  // the nearest free cell instead.
  let [gc, gr] = toCell(gx, gz);
  if (!free(gc, gr)) {
    let best = null;
    for (let rad = 1; rad < 20 && !best; rad++) {
      for (let dc = -rad; dc <= rad; dc++)
        for (let dr = -rad; dr <= rad; dr++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== rad) continue;
          const c = gc + dc;
          const r = gr + dr;
          if (c < 0 || r < 0 || c >= cols || r >= rows || !free(c, r)) continue;
          const d = dc * dc + dr * dr;
          if (!best || d < best.d) best = { c, r, d };
        }
    }
    if (!best) return null;
    gc = best.c;
    gr = best.r;
  }
  const [sc, sr] = toCell(sx, sz);

  // A* with 8-way moves
  const idx = (c, r) => r * cols + c;
  const g = new Float32Array(cols * rows).fill(Infinity);
  const came = new Int32Array(cols * rows).fill(-1);
  const closed = new Uint8Array(cols * rows);
  const open = [[0, sc, sr]];
  g[idx(sc, sr)] = 0;
  const h = (c, r) => Math.hypot(c - gc, r - gr);
  let found = false;

  while (open.length) {
    // small grids: a linear scan for the best node is fast enough
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
    const [, c, r] = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    const ci = idx(c, r);
    if (closed[ci]) continue;
    closed[ci] = 1;
    if (c === gc && r === gr) {
      found = true;
      break;
    }
    for (let dc = -1; dc <= 1; dc++)
      for (let dr = -1; dr <= 1; dr++) {
        if (!dc && !dr) continue;
        const nc = c + dc;
        const nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
        const ni = idx(nc, nr);
        if (closed[ni] || !free(nc, nr)) continue;
        // no corner cutting
        if (dc && dr && (!free(c + dc, r) || !free(c, r + dr))) continue;
        const ng = g[ci] + (dc && dr ? Math.SQRT2 : 1);
        if (ng < g[ni]) {
          g[ni] = ng;
          came[ni] = ci;
          open.push([ng + h(nc, nr), nc, nr]);
        }
      }
  }
  if (!found) return null;

  // walk back, then string-pull so the route is a few straight legs
  const cells = [];
  for (let i = idx(gc, gr); i !== -1; i = came[i]) cells.push(toWorld(i % cols, Math.floor(i / cols)));
  cells.reverse();
  const path = [];
  let from = { x: sx, z: sz };
  let k = 0;
  while (k < cells.length - 1) {
    let far = k + 1;
    for (let j = cells.length - 1; j > k; j--) {
      if (lineClear(from.x, from.z, cells[j].x, cells[j].z)) {
        far = j;
        break;
      }
    }
    path.push(cells[far]);
    from = cells[far];
    k = far;
  }
  if (!path.length) path.push(cells[cells.length - 1]);
  return path;
};
