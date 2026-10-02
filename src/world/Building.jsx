import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

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

// Storefront: centered door with a frame, matching windows either side with
// tops level with the door, and a nameplate above the door.
const DOOR_W = 1.3;
const DOOR_H = 2.2;
const WINDOW = { lab: "#38bdf8", gym: "#fca5a5", tower: "#c4b5fd", cafe: "#fde68a" };

const Window = ({ x, y, w, h, z, color }) => (
  <group position={[x, y, z]}>
    <RoundedBox args={[w + 0.16, h + 0.16, 0.1]} radius={0.05}>
      <meshStandardMaterial color='#ffffff' roughness={0.6} />
    </RoundedBox>
    <RoundedBox args={[w, h, 0.14]} radius={0.04}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.2} />
    </RoundedBox>
    {/* mullion */}
    <mesh position={[0, 0, 0.075]}>
      <boxGeometry args={[0.05, h, 0.01]} />
      <meshStandardMaterial color='#ffffff' />
    </mesh>
  </group>
);

const Facade = ({ b, w, h, d }) => {
  const z = d / 2;
  const color = WINDOW[b.style];
  const winW = b.style === "gym" ? 1.5 : 1.05;
  const winH = 1.15;
  const winY = DOOR_H - winH / 2;
  const winX = DOOR_W / 2 + 0.55 + winW / 2;
  return (
    <>
      {/* door with frame, handle, and step */}
      <RoundedBox args={[DOOR_W + 0.2, DOOR_H + 0.12, 0.2]} radius={0.05} position={[0, DOOR_H / 2 + 0.03, z]}>
        <meshStandardMaterial color='#ffffff' roughness={0.6} />
      </RoundedBox>
      <Box args={[DOOR_W, DOOR_H, 0.28]} position={[0, DOOR_H / 2, z]} color={b.accent} />
      <mesh position={[DOOR_W / 2 - 0.2, 1.05, z + 0.16]}>
        <sphereGeometry args={[0.06, 16, 12]} />
        <meshStandardMaterial color='#fbbf24' metalness={0.7} roughness={0.3} />
      </mesh>
      <Box args={[DOOR_W + 0.6, 0.08, 0.5]} position={[0, 0.04, z + 0.25]} color='#e5e7eb' />
      {[-1, 1].map((side) => (
        <Window key={side} x={side * winX} y={winY} w={winW} h={winH} z={z} color={color} />
      ))}
      {/* the AI Sales tower is taller: a centered upper row */}
      {b.style === "tower" &&
        [-1.4, 0, 1.4].map((x) => <Window key={x} x={x} y={3.45} w={0.85} h={0.7} z={z} color={color} />)}
      {/* nameplate above the door */}
      <group
        position={[
          0,
          // cafe: above the awning; tower: under its upper windows; others: centered
          // between the door and the roof slab (bottom at h - 0.075)
          b.style === "cafe" ? h - 0.4 : b.style === "tower" ? DOOR_H + 0.48 : (DOOR_H + h - 0.075) / 2,
          z + 0.06,
        ]}
      >
        <RoundedBox args={[3.3, 0.62, 0.08]} radius={0.07}>
          <meshStandardMaterial color={b.accent} roughness={0.5} />
        </RoundedBox>
        <TextPanel
          width={3.15}
          height={0.5}
          position={[0, 0, 0.045]}
          deps={[b.name]}
          draw={(ctx, cw, ch) => {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.roundRect(0, 0, cw, ch, ch * 0.18);
            ctx.fill();
            ctx.fillStyle = "#1e293b";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `700 ${ch * 0.48}px Poppins, sans-serif`;
            ctx.fillText(b.name.toUpperCase(), cw / 2, ch * 0.54, cw * 0.92);
          }}
        />
      </group>
    </>
  );
};

// Style-specific rooftop and facade details. Each style is a stand-in until
// real CC0 models replace them.
const Details = ({ style, w, h, d, b }) => {
  const front = d / 2 + 0.01;
  switch (style) {
    case "lab":
      return (
        <>
          {/* giant laptop on the roof */}
          <group position={[0, h + 0.38, 0.2]}>
            <Box args={[3.2, 0.18, 2.1]} position={[0, 0.09, 0]} color='#cbd5e1' />
            <group position={[0, 0.18, -1.02]} rotation={[-0.32, 0, 0]}>
              <Box args={[3.2, 2, 0.14]} position={[0, 1, 0]} color='#cbd5e1' />
              <mesh position={[0, 1, 0.08]}>
                <planeGeometry args={[2.8, 1.65]} />
                <meshStandardMaterial color='#0f172a' emissive='#0c4a6e' emissiveIntensity={0.5} />
              </mesh>
              <TypingCode />
            </group>
          </group>
        </>
      );
    case "gym":
      return (
        <>
          {/* Giant dumbbell on the roof */}
          {/* plates rest on the roof slab (top at h + 0.375); it lifts in slow reps */}
          <Reps>
          <group position={[0, h + 1.24, 0]} rotation={[0, 0, Math.PI / 2]}>
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
          </Reps>
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
        </>
      );
    case "cafe":
      return (
        <>
          {/* giant steaming coffee cup on the roof */}
          <group position={[0, h + 0.38, 0]}>
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

// Roof laptop: code appears token by token in quick discrete steps (clicky,
// not a smooth bar), with a cursor that jumps along, then clears and restarts
const CODE = [
  { indent: 0, color: "#38bdf8", tokens: [0.28, 0.4, 0.18, 0.3] },
  { indent: 0.25, color: "#e2e8f0", tokens: [0.22, 0.34, 0.26] },
  { indent: 0.25, color: "#fbbf24", tokens: [0.3, 0.18, 0.4, 0.16] },
  { indent: 0.5, color: "#a78bfa", tokens: [0.26, 0.3] },
  { indent: 0.25, color: "#e2e8f0", tokens: [0.2, 0.36, 0.24] },
  { indent: 0, color: "#38bdf8", tokens: [0.14] },
];
const GAP = 0.06;
const LAYOUT = CODE.flatMap((line, row) => {
  let x = -1.2 + line.indent;
  return line.tokens.map((w) => {
    const tok = { row, x, w, color: line.color };
    x += w + GAP;
    return tok;
  });
});
const TOKENS_PER_SEC = 9;

const TypingCode = () => {
  const tokens = useRef();
  const cursor = useRef();
  useFrame(({ clock }) => {
    const cycle = LAYOUT.length + 12; // brief pause on the finished screen
    const n = Math.floor(clock.elapsedTime * TOKENS_PER_SEC) % cycle;
    tokens.current?.children.forEach((tok, i) => {
      tok.visible = i < n;
    });
    if (cursor.current) {
      const last = LAYOUT[Math.min(n, LAYOUT.length) - 1];
      const x = last ? last.x + last.w + 0.05 : -1.2;
      const y = 1.6 - (last ? last.row : 0) * 0.22;
      cursor.current.position.set(x, y, 0.09);
      cursor.current.visible = n >= LAYOUT.length ? Math.sin(clock.elapsedTime * 10) > 0 : true;
    }
  });
  return (
    <>
      <group ref={tokens}>
        {LAYOUT.map((t, i) => (
          <mesh key={i} position={[t.x + t.w / 2, 1.6 - t.row * 0.22, 0.09]}>
            <planeGeometry args={[t.w, 0.09]} />
            <meshBasicMaterial color={t.color} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={cursor}>
        <planeGeometry args={[0.05, 0.14]} />
        <meshBasicMaterial color='#ffffff' toneMapped={false} />
      </mesh>
    </>
  );
};

// Roof dumbbell: slow lift, hold, lower, rest
const Reps = ({ children }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.45) % 1;
    const lift = t < 0.35 ? Math.sin((t / 0.35) * (Math.PI / 2)) : t < 0.5 ? 1 : t < 0.85 ? Math.cos(((t - 0.5) / 0.35) * (Math.PI / 2)) : 0;
    if (ref.current) {
      ref.current.position.y = lift * 0.9;
      ref.current.rotation.x = lift * 0.15;
    }
  });
  return <group ref={ref}>{children}</group>;
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
  cafe: [6, 3.6, 5],
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
        <Facade b={building} w={w} h={h} d={d} />
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

    </group>
  );
};

export default Building;
