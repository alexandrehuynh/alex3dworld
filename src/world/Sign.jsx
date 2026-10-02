import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { playerState } from "./playerState";

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
  // Shrink long names so they fit inside the pill
  let size = 52;
  ctx.font = `600 ${size}px Poppins, 'Work Sans', sans-serif`;
  const maxWidth = WIDTH - 70;
  const measured = ctx.measureText(text).width;
  if (measured > maxWidth) {
    size = Math.floor((size * maxWidth) / measured);
    ctx.font = `600 ${size}px Poppins, 'Work Sans', sans-serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 4);
};

const worldPos = new THREE.Vector3();

// Camera-facing name sign drawn to a canvas texture. Lives in the 3D scene,
// so buildings can hide it and it never overlaps the page UI. With `reveal`,
// it stays hidden until the player is within that distance, then rises in.
const Sign = ({ text, accent, position, width = 5.5, reveal }) => {
  const sprite = useRef();
  const shown = useRef(reveal ? 0 : 1);
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

  const height = (width * HEIGHT) / WIDTH;

  useFrame((_, delta) => {
    if (!reveal || !sprite.current) return;
    sprite.current.getWorldPosition(worldPos);
    const dx = worldPos.x - playerState.position.x;
    const dz = worldPos.z - playerState.position.z;
    const target = dx * dx + dz * dz < reveal * reveal ? 1 : 0;
    shown.current += (target - shown.current) * Math.min(1, delta * 6);
    const v = shown.current;
    sprite.current.visible = v > 0.02;
    sprite.current.material.opacity = v;
    sprite.current.scale.set(width * (0.6 + 0.4 * v), height * (0.6 + 0.4 * v), 1);
    sprite.current.position.y = position[1] - 0.5 * (1 - v);
  });

  return (
    <sprite ref={sprite} position={position} scale={[width, height, 1]} visible={!reveal}>
      <spriteMaterial map={texture} transparent toneMapped={false} />
    </sprite>
  );
};

export default Sign;
