import * as THREE from "three";
import { useEffect, useMemo } from "react";

const WIDTH = 512;
const HEIGHT = 128;

const draw = (ctx, text, accent) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const r = HEIGHT / 2 - 8;
  ctx.beginPath();
  ctx.roundRect(8, 8, WIDTH - 16, HEIGHT - 16, r);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = accent;
  ctx.stroke();
  ctx.fillStyle = "#1e293b";
  ctx.font = "600 52px Poppins, 'Work Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 4);
};

// Camera-facing name sign drawn to a canvas texture. Lives in the 3D scene,
// so buildings can hide it and it never overlaps the page UI.
const Sign = ({ text, accent, position, width = 5.5 }) => {
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, texture };
  }, []);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    draw(ctx, text, accent);
    texture.needsUpdate = true;
    // Redraw once the web font has loaded
    document.fonts?.ready.then(() => {
      draw(ctx, text, accent);
      texture.needsUpdate = true;
    });
    return () => texture.dispose();
  }, [canvas, texture, text, accent]);

  return (
    <sprite position={position} scale={[width, (width * HEIGHT) / WIDTH, 1]}>
      <spriteMaterial map={texture} transparent toneMapped={false} />
    </sprite>
  );
};

export default Sign;
