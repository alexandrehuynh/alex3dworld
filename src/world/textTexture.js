import * as THREE from "three";
import { useEffect, useMemo } from "react";

// Canvas-backed texture for in-world text (signs, flyers, banners). `draw`
// receives the 2D context and canvas size; it re-runs once web fonts load.
export const useCanvasTexture = (width, height, draw, deps) => {
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, texture };
  }, [width, height]);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height);
      texture.needsUpdate = true;
    };
    render();
    document.fonts?.ready.then(render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, texture, ...deps]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

// Wraps text to a max width; returns the y after the last line
export const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
};
