import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import Sign from "./Sign";
import { Puffs, TextPanel } from "./interiors/shared";
import { BUILDING_RING } from "../constants/world";

// Spot on the path just outside the door (click-to-walk destination)
const doorPoint = (b) => {
  const k = (BUILDING_RING - 4.2) / BUILDING_RING;
  return [b.position[0] * k, b.position[2] * k];
};

// Soft, rounded box: radius scales with the smallest side so thin parts stay valid
const Box = ({ args, color, radius, ...props }) => (
  <RoundedBox
    args={args}
    radius={radius ?? Math.min(0.35, Math.min(...args) * 0.45)}
    smoothness={4}
    castShadow
    receiveShadow
    {...props}
  >
    <meshStandardMaterial color={color} roughness={0.75} />
  </RoundedBox>
);

const Windows = ({ width, height, y, z, color, cols = 2 }) => (
  <>
    {Array.from({ length: cols }, (_, i) => {
      const x = -width / 2 + (width / (cols + 1)) * (i + 1);
      return (
        <RoundedBox key={i} args={[0.9, height, 0.12]} radius={0.05} position={[x, y, z]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.2} />
        </RoundedBox>
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
          {/* giant laptop on the roof */}
          <group position={[0, h + 0.3, 0.2]}>
            <Box args={[3.2, 0.18, 2.1]} position={[0, 0.09, 0]} color='#cbd5e1' />
            <group position={[0, 0.18, -1.02]} rotation={[-0.32, 0, 0]}>
              <Box args={[3.2, 2, 0.14]} position={[0, 1, 0]} color='#cbd5e1' />
              <mesh position={[0, 1, 0.08]}>
                <planeGeometry args={[2.8, 1.65]} />
                <meshStandardMaterial color='#0f172a' emissive='#0c4a6e' emissiveIntensity={0.5} />
              </mesh>
              {[0.45, 0.2, -0.05, -0.3].map((y, i) => (
                <mesh key={y} position={[-0.5 + (i % 2) * 0.25, 1 + y, 0.09]}>
                  <planeGeometry args={[1.4 - i * 0.2, 0.1]} />
                  <meshBasicMaterial color={["#38bdf8", "#e2e8f0", "#fbbf24", "#a78bfa"][i]} toneMapped={false} />
                </mesh>
              ))}
            </group>
          </group>
          <Windows width={w} height={1.2} y={h * 0.62} z={front} color='#38bdf8' cols={3} />
        </>
      );
    case "gym":
      return (
        <>
          {/* Giant dumbbell on the roof */}
          <group position={[0, h + 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 4.2, 24]} />
              <meshStandardMaterial color='#475569' />
            </mesh>
            {[-1.7, 1.7].map((y) => (
              <mesh key={y} position={[0, y, 0]} castShadow>
                <cylinderGeometry args={[0.85, 0.85, 0.7, 40]} />
                <meshStandardMaterial color='#1f2937' roughness={0.4} />
              </mesh>
            ))}
          </group>
          <Windows width={w} height={1.4} y={h * 0.55} z={front} color='#fca5a5' cols={3} />
        </>
      );
    case "tower":
      return (
        <>
          {/* AI money: green rising bars, a spinning gold $ coin, AI sparkle */}
          {[0.8, 1.4, 2.1].map((bh, i) => (
            <Box key={i} args={[0.6, bh, 0.6]} position={[-1.5 + i * 0.75, h + 0.3 + bh / 2, -0.6]} color='#22c55e' />
          ))}
          <SpinningCoin position={[1, h + 1.9, 0.3]} />
          <mesh position={[2, h + 3.3, 0.3]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
            <octahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color='#a78bfa' emissive='#8b5cf6' emissiveIntensity={0.9} />
          </mesh>
          {[1.4, 2.9].map((y) => (
            <Windows key={y} width={w} height={0.9} y={y + 0.6} z={front} color='#c4b5fd' cols={3} />
          ))}
        </>
      );
    case "cafe":
      return (
        <>
          {/* giant steaming coffee cup on the roof */}
          <group position={[0, h + 0.3, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[1.5, 1.3, 0.16, 48]} />
              <meshStandardMaterial color='#ffffff' roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[1, 0.8, 1.5, 48]} />
              <meshStandardMaterial color='#ffffff' roughness={0.35} />
            </mesh>
            <mesh position={[0, 1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.92, 48]} />
              <meshStandardMaterial color='#78350f' />
            </mesh>
            {/* handle: right half of a ring, ends tucked into the cup wall */}
            <mesh position={[0.86, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <torusGeometry args={[0.36, 0.1, 16, 32, Math.PI]} />
              <meshStandardMaterial color='#ffffff' roughness={0.35} />
            </mesh>
            <Puffs position={[0, 1.7, 0]} count={6} height={1.8} spread={0.9} size={0.35} />
          </group>
          {/* striped awning */}
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              args={[w / 6, 0.1, 1.2]}
              radius={0.04}
              position={[-w / 2 + w / 12 + (w / 6) * i, h * 0.72, front + 0.55]}
              rotation={[0.35, 0, 0]}
              color={i % 2 ? "#ffffff" : b.accent}
            />
          ))}
          <Windows width={w} height={1.1} y={h * 0.42} z={front} color='#fde68a' cols={2} />
          {/* outdoor tables + OPEN chalkboard */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * (w / 2 + 0.8), 0, front + 1.2]}>
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.05, 0.12, 0.76, 12]} />
                <meshStandardMaterial color='#334155' />
              </mesh>
              <mesh position={[0, 0.77, 0]} castShadow>
                <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
                <meshStandardMaterial color='#ffffff' />
              </mesh>
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
                <meshStandardMaterial color='#e5e7eb' />
              </mesh>
              <mesh position={[0, 2.05, 0]} castShadow>
                <coneGeometry args={[0.8, 0.35, 24, 1, true]} />
                <meshStandardMaterial color={b.accent} side={2} />
              </mesh>
            </group>
          ))}
          <group position={[1.6, 0, front + 1.9]} rotation={[0, -0.3, 0]}>
            <Box args={[0.6, 0.85, 0.05]} position={[0, 0.5, 0]} rotation={[-0.15, 0, 0]} color='#1f2937' radius={0.02} />
            <TextPanel
              width={0.48}
              height={0.3}
              position={[0, 0.62, 0.05]}
              rotation={[-0.15, 0, 0]}
              draw={(ctx, cw, ch) => {
                ctx.fillStyle = "#1f2937";
                ctx.fillRect(0, 0, cw, ch);
                ctx.fillStyle = "#f8fafc";
                ctx.font = `700 ${ch * 0.5}px Poppins, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("OPEN", cw / 2, ch / 2);
              }}
            />
          </group>
        </>
      );
    default:
      return null;
  }
};

const SpinningCoin = ({ position }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 1.2;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.22, 48]} />
        <meshStandardMaterial color='#facc15' metalness={0.6} roughness={0.3} />
      </mesh>
      {[1, -1].map((side) => (
        <TextPanel
          key={side}
          width={1.5}
          height={1.5}
          position={[0, 0, side * 0.115]}
          rotation={[0, side > 0 ? 0 : Math.PI, 0]}
          draw={(ctx, w, hh) => {
            ctx.clearRect(0, 0, w, hh);
            ctx.fillStyle = "#a16207";
            ctx.font = `800 ${hh * 0.7}px Poppins, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("$", w / 2, hh * 0.54);
          }}
          transparent
        />
      ))}
    </group>
  );
};

const SIZES = {
  lab: [6, 4, 5],
  gym: [7.5, 3.6, 5.5],
  tower: [5.5, 4.4, 5],
  cafe: [6, 3.2, 5],
};

const Building = ({ building, isNearby, onEnterZone, onExitZone }) => {
  const [w, h, d] = SIZES[building.style];
  const isPlayer = ({ other }) => other.rigidBodyObject?.name === "player";

  return (
    <group
      position={building.position}
      rotation={[0, building.angle + Math.PI, 0]}
      userData={{ walkTo: doorPoint(building) }}
    >
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[w / 2, h / 2 + 2, d / 2]} position={[0, h / 2, 0]} />
        <Box args={[w, h, d]} position={[0, h / 2, 0]} color={building.color} />
        <Box args={[w + 0.4, 0.45, d + 0.4]} position={[0, h + 0.15, 0]} color={building.roof} />
        {/* Door */}
        <Box args={[1.5, 2.3, 0.25]} position={[0, 1.15, d / 2]} color={building.accent} />
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
      <mesh position={[0, 0.03, d / 2 + 1.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.6, 0.9, 1]}>
        <circleGeometry args={[0.75, 40]} />
        <meshStandardMaterial
          color={isNearby ? "#facc15" : building.accent}
          emissive={isNearby ? "#facc15" : "#000000"}
          emissiveIntensity={isNearby ? 0.6 : 0}
        />
      </mesh>

      <Sign
        text={`${building.emoji} ${building.name}`}
        accent={building.accent}
        position={[0, h + 0.9, d / 2 + 1.4]}
        width={5}
        reveal={10}
      />
    </group>
  );
};

export default Building;
