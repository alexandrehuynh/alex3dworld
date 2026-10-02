import Prop from "../Prop";
import { PROPS } from "../props";
import { Plant, Puffs, Soft, TextPanel } from "./shared";

/* Equinox: a luxury spa sauna with a glowing heater and steam */
const Sauna = ({ position }) => (
  <group position={position}>
    {/* cabin shell, open front with a glass pane */}
    <Soft args={[4, 2.7, 0.2]} position={[0, 1.35, -1.3]} color='#c08552' />
    {[-1, 1].map((s) => (
      <Soft key={s} args={[0.2, 2.7, 2.8]} position={[s * 1.9, 1.35, 0]} color='#c08552' />
    ))}
    <Soft args={[4.2, 0.25, 3]} position={[0, 2.8, 0]} color='#8b5a2b' />
    {[0.5, 1, 1.5, 2, 2.5].map((y) => (
      <Soft key={y} args={[3.6, 0.04, 0.05]} position={[0, y, -1.18]} color='#a86b3c' />
    ))}
    {/* tiered benches */}
    <Soft args={[3.4, 0.12, 0.7]} position={[0, 0.5, -0.6]} color='#deb887' />
    <Soft args={[3.4, 0.12, 0.6]} position={[0, 0.95, -0.95]} color='#deb887' />
    {/* heater with hot stones */}
    <Soft args={[0.6, 0.6, 0.5]} position={[1.3, 0.3, 0.6]} color='#374151' />
    {[-0.12, 0.1, 0].map((x, i) => (
      <mesh key={i} position={[1.3 + x, 0.66, 0.6 + (i - 1) * 0.1]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color='#f97316' emissive='#ea580c' emissiveIntensity={1.4} />
      </mesh>
    ))}
    <pointLight position={[0, 1.8, 0]} color='#fdba74' intensity={6} distance={4} />
    <Puffs position={[1.3, 0.8, 0.6]} count={6} height={1.8} />
    {/* glass front */}
    <mesh position={[0, 1.35, 1.38]}>
      <planeGeometry args={[3.6, 2.6]} />
      <meshStandardMaterial color='#fde68a' transparent opacity={0.18} roughness={0.05} />
    </mesh>
    {/* towels + robe hooks outside */}
    {[0, 0.16, 0.32].map((y, i) => (
      <Soft key={y} args={[0.6, 0.14, 0.4]} position={[2.6, 0.08 + y, 0.6]} color={["#f8fafc", "#e2e8f0", "#f8fafc"][i]} radius={0.06} />
    ))}
    <TextPanel
      width={1.6}
      height={0.4}
      position={[0, 2.45, 1.42]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fde68a";
        ctx.font = `600 ${h * 0.5}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SAUNA · SPA", w / 2, h / 2);
      }}
    />
  </group>
);

/* Murray Athletic Development: half basketball court */
const HalfCourt = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[9, 6.4]} />
      <meshStandardMaterial color='#e2b07a' roughness={0.55} />
    </mesh>
    {/* paint (key) */}
    <mesh position={[0, 0.016, -3.2 + 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.4, 3]} />
      <meshStandardMaterial color='#c2410c' roughness={0.6} />
    </mesh>
    {/* free-throw circle + three-point arc */}
    <mesh position={[0, 0.02, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.12, 1.2, 48]} />
      <meshStandardMaterial color='#ffffff' />
    </mesh>
    <mesh position={[0, 0.02, -2.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3.9, 4, 64, 1, Math.PI, Math.PI]} />
      <meshStandardMaterial color='#ffffff' />
    </mesh>
    {/* backboard + rim + net, mounted on the back wall */}
    <Soft args={[0.12, 1.2, 0.12]} position={[0, 2.2, -3.1]} color='#475569' />
    <Soft args={[1.6, 1, 0.08]} position={[0, 2.8, -2.95]} color='#ffffff' radius={0.04} />
    <mesh position={[0, 2.65, -2.9]}>
      <ringGeometry args={[0.28, 0.33, 4, 1, Math.PI / 4]} />
      <meshStandardMaterial color='#ef4444' />
    </mesh>
    <mesh position={[0, 2.4, -2.62]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.24, 0.025, 12, 32]} />
      <meshStandardMaterial color='#f97316' metalness={0.4} roughness={0.4} />
    </mesh>
    <mesh position={[0, 2.18, -2.62]}>
      <cylinderGeometry args={[0.24, 0.16, 0.42, 12, 3, true]} />
      <meshStandardMaterial color='#ffffff' wireframe />
    </mesh>
    {/* basketballs */}
    {[
      [1.6, 0.6],
      [-2.8, 1.8],
    ].map(([x, z]) => (
      <group key={x} position={[x, 0.18, z]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 24, 16]} />
          <meshStandardMaterial color='#ea580c' roughness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.181, 0.006, 6, 32]} />
          <meshStandardMaterial color='#1f2937' />
        </mesh>
      </group>
    ))}
  </group>
);

/* LuxFit: outdoor lifting platform with a squat rack, on grass */
const SquatRack = ({ position }) => (
  <group position={position}>
    {[
      [-0.75, -0.5],
      [0.75, -0.5],
      [-0.75, 0.5],
      [0.75, 0.5],
    ].map(([x, z]) => (
      <Soft key={`${x}${z}`} args={[0.14, 2.4, 0.14]} position={[x, 1.2, z]} color='#334155' metalness={0.4} roughness={0.4} />
    ))}
    {[-0.5, 0.5].map((z) => (
      <Soft key={z} args={[1.64, 0.12, 0.12]} position={[0, 2.35, z]} color='#334155' metalness={0.4} roughness={0.4} />
    ))}
    <Barbell position={[0, 1.45, 0.5]} />
  </group>
);

const Barbell = ({ position }) => (
  <group position={position}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 2.5, 16]} />
      <meshStandardMaterial color='#cbd5e1' metalness={0.9} roughness={0.25} />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.1, 40]} />
          <meshStandardMaterial color='#ef4444' roughness={0.5} />
        </mesh>
        <mesh position={[0, side * 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 40]} />
          <meshStandardMaterial color='#1e293b' roughness={0.5} />
        </mesh>
      </group>
    ))}
  </group>
);

const OutdoorPlatform = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.012, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3.6, 7]} />
      <meshStandardMaterial color='#4ade80' roughness={1} />
    </mesh>
    <Soft args={[2.6, 0.08, 2.4]} position={[0, 0.04, 1.4]} color='#1f2937' radius={0.03} />
    <Soft args={[1.2, 0.09, 2.4]} position={[0, 0.045, 1.4]} color='#c49a6c' radius={0.03} />
    <SquatRack position={[0, 0, -0.4]} />
    <Barbell position={[0, 0.42, 1.6]} />
    {/* sun umbrella + plant: this one's outside */}
    <group position={[1.3, 0, 3.6]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
        <meshStandardMaterial color='#e5e7eb' />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <coneGeometry args={[1, 0.45, 24, 1, true]} />
        <meshStandardMaterial color='#fbbf24' side={2} />
      </mesh>
    </group>
    <Plant position={[-1.3, 0, 4]} />
  </group>
);

/* Bay Club: turf lane with a sled, plus a dumbbell rack */
const TurfLane = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3.4, 6]} />
      <meshStandardMaterial color='#16a34a' roughness={1} />
    </mesh>
    {[-1.5, 1.5].map((x) => (
      <mesh key={x} position={[x, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.07, 6]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
    ))}
    {[-2, 0, 2].map((z) => (
      <mesh key={z} position={[0, 0.017, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 0.05]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
    ))}
    {/* push sled */}
    <group position={[0, 0, -1.8]}>
      <Soft args={[0.9, 0.1, 1.1]} position={[0, 0.06, 0]} color='#1f2937' />
      {[-0.3, 0.3].map((x) => (
        <Soft key={x} args={[0.07, 1.1, 0.07]} position={[x, 0.6, 0.45]} rotation={[0.25, 0, 0]} color='#94a3b8' metalness={0.5} />
      ))}
      <mesh position={[0, 0.25, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.12, 32]} />
        <meshStandardMaterial color='#3b82f6' />
      </mesh>
    </group>
  </group>
);

const DumbbellRack = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[2.6, 0.08, 0.6]} position={[0, 0.55, 0]} color='#1f2937' />
    <Soft args={[2.6, 0.08, 0.6]} position={[0, 0.95, -0.05]} color='#1f2937' />
    {[-1.2, 1.2].map((x) => (
      <Soft key={x} args={[0.1, 1, 0.5]} position={[x, 0.5, 0]} color='#475569' />
    ))}
    {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
      <Prop key={x} url={PROPS.gymDumbbell} size={0.42} position={[x, i % 2 ? 1 : 0.6, 0]} rotation={[0, Math.PI / 2, 0]} />
    ))}
  </group>
);

/* Skrap Pack Marina: jiu-jitsu tatami */
const Tatami = ({ position }) => (
  <group position={position}>
    {Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) => (
        <Soft
          key={`${i}-${j}`}
          args={[1.08, 0.08, 1.08]}
          position={[(i - 2) * 1.1, 0.04, (j - 2) * 1.1]}
          color={(i + j) % 2 ? "#1e3a8a" : "#1d4ed8"}
          radius={0.03}
          roughness={0.7}
        />
      ))
    )}
    {/* folded belts by the edge */}
    {["#ffffff", "#2563eb", "#7c3aed", "#78350f", "#111827"].map((c, i) => (
      <Soft key={c} args={[0.5, 0.05, 0.12]} position={[-2.6 + i * 0.05, 0.11 + i * 0.05, 3.1]} color={c} radius={0.02} />
    ))}
  </group>
);

/* OFFTHEWEIGHTS: brand banner + heavy bag */
const BrandCorner = ({ position }) => (
  <group position={position}>
    <TextPanel
      width={3}
      height={1}
      position={[-1.15, 1.9, 0]}
      rotation={[0, Math.PI / 2, 0]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#111827";
        ctx.font = `800 ${h * 0.34}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("OFFTHEWEIGHTS", w / 2, h / 2);
      }}
    />
    <Soft args={[0.12, 2.6, 0.12]} position={[0.1, 1.3, -0.7]} color='#334155' />
    <Soft args={[0.12, 0.12, 1.4]} position={[0.1, 2.6, 0]} color='#334155' />
    <mesh position={[0.1, 2.35, 0.4]}>
      <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
      <meshStandardMaterial color='#64748b' />
    </mesh>
    <mesh position={[0.1, 1.5, 0.4]} castShadow>
      <capsuleGeometry args={[0.3, 0.75, 8, 24]} />
      <meshStandardMaterial color='#111827' roughness={0.45} />
    </mesh>
    <mesh position={[0.1, 1.5, 0.4]}>
      <cylinderGeometry args={[0.305, 0.305, 0.14, 32]} />
      <meshStandardMaterial color='#facc15' roughness={0.5} />
    </mesh>
  </group>
);

const GymDecor = () => (
  <>
    <Sauna position={[-7, 0, -5.6]} />
    <HalfCourt position={[2, 0, -3.8]} />
    <OutdoorPlatform position={[8.3, 0, 0.6]} />
    <TurfLane position={[3.6, 0, 3.6]} />
    <DumbbellRack position={[9.3, 0, -4.8]} rotation={[0, -Math.PI / 2, 0]} />
    <Tatami position={[-6.8, 0, 3.4]} />
    <BrandCorner position={[-8.7, 0, -0.6]} />
  </>
);

export default {
  width: 20,
  depth: 14,
  floor: "#64748b",
  wall: "#f8fafc",
  trim: "#1f2937",
  stations: {
    equinox: [-7, -2.9],
    murray: [2, -2.4],
    luxfit: [8.3, 3.2],
    bayclub: [3.6, 4.4],
    skrappack: [-6.8, 3.4],
    offtheweights: [-6.8, -0.4],
  },
  // [x, z, halfWidth, halfDepth] boxes the player can't walk through
  blockers: [
    [-7, -5.8, 2.1, 1.5],
    [8.3, 0.2, 0.9, 0.6],
    [9.3, -4.8, 0.35, 1.3],
    [-8.6, -0.6, 0.4, 0.8],
    [3.6, 1.8, 0.5, 0.6],
  ],
  Decor: GymDecor,
};
