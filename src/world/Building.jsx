import { CuboidCollider, RigidBody } from "@react-three/rapier";

import Sign from "./Sign";

const Box = ({ args, color, ...props }) => (
  <mesh castShadow receiveShadow {...props}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} flatShading />
  </mesh>
);

const Windows = ({ width, height, y, z, color, cols = 2 }) => (
  <>
    {Array.from({ length: cols }, (_, i) => {
      const x = -width / 2 + (width / (cols + 1)) * (i + 1);
      return (
        <mesh key={i} position={[x, y, z]}>
          <planeGeometry args={[0.9, height]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
        </mesh>
      );
    })}
  </>
);

// Style-specific rooftop and facade details. Each style is a stand-in until
// real CC0 models replace them.
const Details = ({ style, w, h, d, b }) => {
  const front = d / 2 + 0.01;
  switch (style) {
    case "lab":
      return (
        <>
          <mesh position={[0, h, 0]} castShadow>
            <sphereGeometry args={[1.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color='#7dd3fc' transparent opacity={0.75} />
          </mesh>
          <Box args={[0.1, 2, 0.1]} position={[1.8, h + 1, -1]} color='#64748b' />
          <mesh position={[1.8, h + 2.1, -1]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color='#ef4444' emissive='#ef4444' emissiveIntensity={1} />
          </mesh>
          <Windows width={w} height={1.2} y={h * 0.62} z={front} color='#38bdf8' cols={3} />
        </>
      );
    case "gym":
      return (
        <>
          {/* Giant dumbbell on the roof */}
          <group position={[0, h + 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 4.2, 10]} />
              <meshStandardMaterial color='#475569' />
            </mesh>
            {[-1.7, 1.7].map((y) => (
              <mesh key={y} position={[0, y, 0]} castShadow>
                <cylinderGeometry args={[0.85, 0.85, 0.7, 12]} />
                <meshStandardMaterial color='#1f2937' flatShading />
              </mesh>
            ))}
          </group>
          <Windows width={w} height={1.4} y={h * 0.55} z={front} color='#fca5a5' cols={3} />
        </>
      );
    case "tower":
      return (
        <>
          <Box args={[w * 0.7, 2.5, d * 0.7]} position={[0, h + 1.25, 0]} color={b.color} />
          {/* Rising bar chart sign */}
          {[0.8, 1.4, 2.1].map((bh, i) => (
            <Box
              key={i}
              args={[0.45, bh, 0.2]}
              position={[-0.7 + i * 0.7, h + 2.5 + bh / 2, d * 0.35 + 0.1]}
              color={b.accent}
            />
          ))}
          {[1.4, 2.8, 4.2, 5.6].map((y) => (
            <Windows key={y} width={w} height={0.8} y={y + 0.6} z={front} color='#c4b5fd' cols={3} />
          ))}
        </>
      );
    case "cafe":
      return (
        <>
          {/* Pitched roof */}
          <mesh position={[0, h + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.78, 1.8, 4]} />
            <meshStandardMaterial color={b.roof} flatShading />
          </mesh>
          {/* Striped awning */}
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              args={[w / 6, 0.08, 1.2]}
              position={[-w / 2 + w / 12 + (w / 6) * i, h * 0.72, front + 0.55]}
              rotation={[0.35, 0, 0]}
              color={i % 2 ? "#ffffff" : b.accent}
            />
          ))}
          <Windows width={w} height={1.1} y={h * 0.42} z={front} color='#fde68a' cols={2} />
          {/* Job board out front */}
          <group position={[w / 2 + 0.9, 0, front + 0.8]} rotation={[0, -0.4, 0]}>
            <Box args={[0.12, 1.6, 0.12]} position={[-0.6, 0.8, 0]} color='#78350f' />
            <Box args={[0.12, 1.6, 0.12]} position={[0.6, 0.8, 0]} color='#78350f' />
            <Box args={[1.5, 1, 0.1]} position={[0, 1.4, 0]} color='#b45309' />
            {[
              [-0.4, 1.55, "#fef08a"],
              [0.1, 1.3, "#bbf7d0"],
              [0.45, 1.6, "#fbcfe8"],
            ].map(([x, y, c]) => (
              <mesh key={x} position={[x, y, 0.06]}>
                <planeGeometry args={[0.35, 0.35]} />
                <meshStandardMaterial color={c} />
              </mesh>
            ))}
          </group>
        </>
      );
    default:
      return null;
  }
};

const SIZES = {
  lab: [6, 4, 5],
  gym: [7.5, 3.6, 5.5],
  tower: [5, 7.5, 5],
  cafe: [6, 3.2, 5],
};

const Building = ({ building, isNearby, onEnterZone, onExitZone }) => {
  const [w, h, d] = SIZES[building.style];
  const isPlayer = ({ other }) => other.rigidBodyObject?.name === "player";

  return (
    <group position={building.position} rotation={[0, building.angle + Math.PI, 0]}>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[w / 2, h / 2 + 2, d / 2]} position={[0, h / 2, 0]} />
        <Box args={[w, h, d]} position={[0, h / 2, 0]} color={building.color} />
        <Box args={[w + 0.3, 0.3, d + 0.3]} position={[0, h + 0.15, 0]} color={building.roof} />
        {/* Door */}
        <Box args={[1.4, 2.2, 0.1]} position={[0, 1.1, d / 2 + 0.05]} color={building.accent} />
        <Details style={building.style} w={w} h={h} d={d} b={building} />

        {/* Invisible trigger zone in front of the door */}
        <CuboidCollider
          sensor
          args={[1.8, 1.5, 1.6]}
          position={[0, 1.5, d / 2 + 1.6]}
          onIntersectionEnter={(e) => isPlayer(e) && onEnterZone(building.id)}
          onIntersectionExit={(e) => isPlayer(e) && onExitZone(building.id)}
        />
      </RigidBody>

      {/* Doormat glows when the player is close */}
      <mesh position={[0, 0.03, d / 2 + 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshStandardMaterial
          color={isNearby ? "#facc15" : building.accent}
          emissive={isNearby ? "#facc15" : "#000000"}
          emissiveIntensity={isNearby ? 0.6 : 0}
        />
      </mesh>

      <Sign
        text={`${building.emoji} ${building.name}`}
        accent={building.accent}
        position={[0, building.style === "tower" ? h + 4.5 : h + 2.2, 0]}
      />
    </group>
  );
};

export default Building;
