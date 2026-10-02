import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { useCanvasTexture } from "../textTexture";
import { Soft } from "./Room";

export const Plant = ({ url = PROPS.plantMonstera, ...props }) => <Prop url={url} height={1.3} {...props} />;

export const DeskSetup = ({ position, rotation = 0, children }) => (
  <group position={[position[0], 0, position[1]]} rotation={[0, rotation, 0]}>
    <Prop url={PROPS.officeDesk} size={1.9} />
    <Prop url={PROPS.officeMonitor} height={0.45} position={[0.1, 0.78, -0.15]} />
    <Prop url={PROPS.officeComputer} height={0.45} position={[0.75, 0.78, -0.1]} />
    <Prop url={PROPS.officeChair} height={1.05} position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]} />
    {children}
  </group>
);

// Flat text panel (banners, posters, screens)
export const TextPanel = ({ width, height, draw, deps = [], emissive = false, transparent = false, ...props }) => {
  const px = 256;
  const texture = useCanvasTexture(Math.round(width * px), Math.round(height * px), draw, deps);
  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      {emissive ? (
        <meshBasicMaterial map={texture} toneMapped={false} transparent={transparent} />
      ) : (
        <meshStandardMaterial map={texture} roughness={0.8} transparent={transparent} />
      )}
    </mesh>
  );
};

// Soft puffs rising and fading in a loop (sauna steam, grill smoke)
export const Puffs = ({ position, color = "#ffffff", count = 5, height = 1.6, spread = 0.5, size = 0.22 }) => {
  const group = useRef();
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((puff, i) => {
      const t = (clock.elapsedTime * 0.35 + i / count) % 1;
      puff.position.set(Math.sin(i * 2.1 + t * 3) * spread * 0.5, t * height, Math.cos(i * 1.7) * spread * 0.3);
      puff.scale.setScalar(size * (0.6 + t));
      puff.material.opacity = 0.45 * (1 - t);
    });
  });
  return (
    <group ref={group} position={position}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

export { Soft };
