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

// A spot in the room tied to one job. Either a glowing floor ring, or (with
// `area`) a walk-on zone like a court or mat that lights up when you step on
// it. The label rises in as you get close so it doesn't cover the props.
export const Station = ({ id, label, position, accent, active, onZone, offZone, area, radius = 1.1 }) => {
  const target = { kind: "station", id };
  const isActive = active === id;
  const handlers = {
    onIntersectionEnter: (e) => isPlayer(e) && onZone(target),
    onIntersectionExit: (e) => isPlayer(e) && offZone(target),
  };
  return (
    <group position={[position[0], 0, position[1]]} userData={{ walkTo: [position[0], position[1]] }}>
      <RigidBody type='fixed' colliders={false}>
        {area ? (
          <CuboidCollider sensor args={[area[0] / 2, 1, area[1] / 2]} position={[0, 1, 0]} {...handlers} />
        ) : (
          <CylinderCollider sensor args={[1, radius]} position={[0, 1, 0]} {...handlers} />
        )}
      </RigidBody>
      {area ? (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={area} />
          <meshBasicMaterial color='#fde047' transparent opacity={isActive ? 0.28 : 0} depthWrite={false} />
        </mesh>
      ) : (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.35, radius - 0.15, 48]} />
          <meshStandardMaterial
            color={isActive ? "#facc15" : accent}
            emissive={isActive ? "#facc15" : accent}
            emissiveIntensity={isActive ? 0.8 : 0.25}
            transparent
            opacity={isActive ? 1 : 0.6}
          />
        </mesh>
      )}
      {/* Area labels sit at the back edge so they don't cover you; the active
          station hides its label because the Enter prompt already names it */}
      {!isActive && (
        <Sign
          text={label}
          accent={accent}
          position={area ? [0, 2.2, -area[1] / 2 + 0.2] : [0, 2.3, 0]}
          width={Math.max(2.8, label.length * 0.17)}
          reveal={area ? Math.max(...area) * 0.7 + 1.5 : 3.4}
        />
      )}
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
