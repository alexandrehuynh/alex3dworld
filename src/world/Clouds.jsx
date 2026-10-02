import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Puffy low-poly clouds built from spheres, drifting slowly around the island
const Cloud = ({ position, scale }) => (
  <group position={position} scale={scale}>
    {[
      [0, 0, 0, 1.6],
      [1.6, -0.2, 0.3, 1.2],
      [-1.5, -0.3, -0.2, 1.1],
      [0.5, 0.7, -0.3, 1.1],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color='#ffffff' flatShading />
      </mesh>
    ))}
  </group>
);

const Clouds = () => {
  const group = useRef();
  const clouds = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 40 + (i % 3) * 12;
        return {
          position: [Math.sin(a) * r, -6 + ((i * 7) % 18), Math.cos(a) * r],
          scale: 1.4 + (i % 4) * 0.5,
        };
      }),
    []
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
    </group>
  );
};

export default Clouds;
