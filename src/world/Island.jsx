import { useMemo } from "react";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { BUILDING_RING, ISLAND_RADIUS, buildings } from "../constants/world";

// Deterministic pseudo-random so the scenery layout is stable between reloads
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const Tree = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.6, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
      <meshStandardMaterial color='#7c4a2d' flatShading />
    </mesh>
    <mesh position={[0, 1.9, 0]} castShadow>
      <coneGeometry args={[0.9, 1.8, 7]} />
      <meshStandardMaterial color='#2f9e44' flatShading />
    </mesh>
    <mesh position={[0, 2.7, 0]} castShadow>
      <coneGeometry args={[0.65, 1.3, 7]} />
      <meshStandardMaterial color='#40c057' flatShading />
    </mesh>
  </group>
);

const Rock = ({ position, scale = 1 }) => (
  <mesh position={position} scale={scale} castShadow>
    <dodecahedronGeometry args={[0.5, 0]} />
    <meshStandardMaterial color='#adb5bd' flatShading />
  </mesh>
);

const Fountain = () => (
  <RigidBody type='fixed' colliders='hull'>
    <group>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.6, 16]} />
        <meshStandardMaterial color='#ced4da' flatShading />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.05, 16]} />
        <meshStandardMaterial color='#4dabf7' transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.4, 8]} />
        <meshStandardMaterial color='#dee2e6' flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.35, 10, 8]} />
        <meshStandardMaterial color='#74c0fc' transparent opacity={0.8} />
      </mesh>
    </group>
  </RigidBody>
);

// A flat path from the plaza to each building door
const Path = ({ angle }) => {
  const length = BUILDING_RING - 6;
  const mid = 3.5 + length / 2;
  return (
    <mesh
      position={[Math.sin(angle) * mid, 0.02, Math.cos(angle) * mid]}
      rotation={[-Math.PI / 2, 0, angle]}
      receiveShadow
    >
      <planeGeometry args={[2.2, length]} />
      <meshStandardMaterial color='#e9d8a6' />
    </mesh>
  );
};

const Island = () => {
  const scenery = useMemo(() => {
    const rand = seeded(42);
    const trees = [];
    const rocks = [];
    const keepClear = (x, z) => {
      const r = Math.hypot(x, z);
      if (r < 6.5 || r > ISLAND_RADIUS - 1.5) return false;
      // keep the south side open so trees don't block the follow camera
      if (z > 4 && Math.abs(x) < 9) return false;
      // stay off the running track
      if (r > BUILDING_RING - 8 && r < BUILDING_RING - 4.8) return false;
      // stay away from buildings and their paths
      return buildings.every((b) => {
        const [bx, , bz] = b.position;
        if (Math.hypot(x - bx, z - bz) < 7) return false;
        const along = (x * bx + z * bz) / BUILDING_RING;
        const across = Math.abs(x * bz - z * bx) / BUILDING_RING;
        return !(along > 0 && along < BUILDING_RING && across < 2.5);
      });
    };
    while (trees.length < 38) {
      const a = rand() * Math.PI * 2;
      const r = 6 + rand() * (ISLAND_RADIUS - 6);
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      if (keepClear(x, z)) trees.push({ position: [x, 0, z], scale: 0.7 + rand() * 0.6 });
    }
    while (rocks.length < 18) {
      const a = rand() * Math.PI * 2;
      const r = 6 + rand() * (ISLAND_RADIUS - 6);
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      if (keepClear(x, z)) rocks.push({ position: [x, 0.15, z], scale: 0.5 + rand() * 0.8 });
    }
    return { trees, rocks };
  }, []);

  return (
    <group>
      {/* Walkable top */}
      <RigidBody type='fixed' colliders={false}>
        <CylinderCollider args={[0.5, ISLAND_RADIUS]} position={[0, -0.5, 0]} />
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS - 0.6, 1, 48]} />
          <meshStandardMaterial color='#69db7c' flatShading />
        </mesh>
      </RigidBody>

      {/* Floating rock underside */}
      <mesh position={[0, -5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[ISLAND_RADIUS - 0.6, 8, 24, 3]} />
        <meshStandardMaterial color='#a0704a' flatShading />
      </mesh>
      <mesh position={[0, -11, 0]} rotation={[Math.PI, 0.4, 0]}>
        <coneGeometry args={[7, 6, 9]} />
        <meshStandardMaterial color='#8b5e3c' flatShading />
      </mesh>

      {/* Plaza + running track */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.5, 40]} />
        <meshStandardMaterial color='#f1e3c5' />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[BUILDING_RING - 7.2, BUILDING_RING - 5.6, 64]} />
        <meshStandardMaterial color='#e8590c' />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BUILDING_RING - 6.45, BUILDING_RING - 6.35, 64]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>

      {buildings.map((b) => (
        <Path key={b.id} angle={b.angle} />
      ))}

      <Fountain />

      {scenery.trees.map((t, i) => (
        <RigidBody key={`tree-${i}`} type='fixed' colliders={false} position={t.position}>
          <CylinderCollider args={[1, 0.3 * t.scale]} position={[0, 1, 0]} />
          <Tree position={[0, 0, 0]} scale={t.scale} />
        </RigidBody>
      ))}
      {scenery.rocks.map((r, i) => (
        <Rock key={`rock-${i}`} {...r} />
      ))}
    </group>
  );
};

export default Island;
