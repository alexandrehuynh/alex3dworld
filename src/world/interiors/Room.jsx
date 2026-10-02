import { RoundedBox } from "@react-three/drei";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";

import Sign from "../Sign";

export const WALL_HEIGHT = 3.2;
const T = 0.4; // wall thickness

const isPlayer = ({ other }) => other.rigidBodyObject?.name === "player";

// Cutaway "dollhouse" room floating in the sky: floor, back and side walls,
// open toward the camera. An invisible wall closes the front; the exit mat sits
// just inside it.
export const Room = ({ width, depth, floor, wall, trim, onZone, offZone, active, children }) => {
  const exit = { kind: "exit", id: "exit" };
  return (
    <group>
      <RigidBody type='fixed' colliders={false}>
        {/* floor */}
        <CuboidCollider args={[width / 2, 0.25, depth / 2]} position={[0, -0.25, 0]} />
        <RoundedBox args={[width + 0.8, 0.6, depth + 0.8]} radius={0.28} smoothness={4} position={[0, -0.3, 0]} receiveShadow>
          <meshStandardMaterial color={trim} roughness={0.8} />
        </RoundedBox>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={floor} roughness={0.85} />
        </mesh>

        {/* back + side walls */}
        <CuboidCollider args={[width / 2, WALL_HEIGHT, T / 2]} position={[0, WALL_HEIGHT / 2, -depth / 2 - T / 2]} />
        <CuboidCollider args={[T / 2, WALL_HEIGHT, depth / 2]} position={[-width / 2 - T / 2, WALL_HEIGHT / 2, 0]} />
        <CuboidCollider args={[T / 2, WALL_HEIGHT, depth / 2]} position={[width / 2 + T / 2, WALL_HEIGHT / 2, 0]} />
        <CuboidCollider args={[width / 2, WALL_HEIGHT, T / 2]} position={[0, WALL_HEIGHT / 2, depth / 2 + T / 2]} />
        <RoundedBox args={[width + T * 2, WALL_HEIGHT, T]} radius={0.15} smoothness={4} position={[0, WALL_HEIGHT / 2, -depth / 2 - T / 2]} castShadow receiveShadow>
          <meshStandardMaterial color={wall} roughness={0.9} />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <RoundedBox
            key={side}
            args={[T, WALL_HEIGHT * 0.55, depth]}
            radius={0.15}
            smoothness={4}
            position={[side * (width / 2 + T / 2), (WALL_HEIGHT * 0.55) / 2, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={wall} roughness={0.9} />
          </RoundedBox>
        ))}

        {/* exit mat */}
        <CuboidCollider
          sensor
          args={[1.2, 1, 0.8]}
          position={[0, 1, depth / 2 - 0.8]}
          onIntersectionEnter={(e) => isPlayer(e) && onZone(exit)}
          onIntersectionExit={(e) => isPlayer(e) && offZone(exit)}
        />
      </RigidBody>
      <mesh position={[0, 0.02, depth / 2 - 0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 0.7, 1]}>
        <circleGeometry args={[1, 40]} />
        <meshStandardMaterial
          color={active === "exit" ? "#facc15" : "#94a3b8"}
          emissive={active === "exit" ? "#facc15" : "#000000"}
          emissiveIntensity={active === "exit" ? 0.5 : 0}
        />
      </mesh>
      {children}
    </group>
  );
};

// A spot in the room tied to one job. Walking onto it lights the ring and
// offers to open its card.
export const Station = ({ index, label, position, accent, active, onZone, offZone, collider = 0 }) => {
  const target = { kind: "station", id: index };
  const isActive = active === index;
  return (
    <group position={[position[0], 0, position[1]]}>
      <RigidBody type='fixed' colliders={false}>
        {collider > 0 && <CylinderCollider args={[1, collider]} position={[0, 1, 0]} />}
        <CylinderCollider
          sensor
          args={[1, collider + 1.1]}
          position={[0, 1, 0]}
          onIntersectionEnter={(e) => isPlayer(e) && onZone(target)}
          onIntersectionExit={(e) => isPlayer(e) && offZone(target)}
        />
      </RigidBody>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[collider + 0.75, collider + 0.95, 48]} />
        <meshStandardMaterial
          color={isActive ? "#facc15" : accent}
          emissive={isActive ? "#facc15" : accent}
          emissiveIntensity={isActive ? 0.8 : 0.25}
          transparent
          opacity={isActive ? 1 : 0.6}
        />
      </mesh>
      <Sign text={label} accent={accent} position={[0, 2.2, 0]} width={2.6} />
    </group>
  );
};

// Small rounded helper for code-built furniture
export const Soft = ({ args, color, radius, roughness = 0.6, metalness = 0, ...props }) => (
  <RoundedBox
    args={args}
    radius={radius ?? Math.min(0.12, Math.min(...args) * 0.45)}
    smoothness={4}
    castShadow
    receiveShadow
    {...props}
  >
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </RoundedBox>
);
