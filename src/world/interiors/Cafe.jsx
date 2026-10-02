import Prop from "../Prop";
import { PROPS } from "../props";
import { wrapText } from "../textTexture";
import { rooms } from "../../constants/world";
import { Plant, Puffs, Soft, TextPanel } from "./shared";

const Glass = ({ position, liquid, height = 0.22, stem = true }) => (
  <group position={position}>
    {stem && (
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.012, 0.03, 0.12, 8]} />
        <meshStandardMaterial color='#e0f2fe' transparent opacity={0.6} />
      </mesh>
    )}
    <mesh position={[0, (stem ? 0.12 : 0) + height / 2, 0]}>
      <cylinderGeometry args={[0.04, 0.03, height, 16]} />
      <meshStandardMaterial color='#e0f2fe' transparent opacity={0.35} roughness={0.05} />
    </mesh>
    <mesh position={[0, (stem ? 0.12 : 0) + height * 0.35, 0]}>
      <cylinderGeometry args={[0.035, 0.028, height * 0.65, 16]} />
      <meshStandardMaterial color={liquid} roughness={0.2} />
    </mesh>
  </group>
);

const Bottle = ({ position, color }) => (
  <group position={position}>
    <mesh position={[0, 0.16, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.07, 0.32, 20]} />
      <meshStandardMaterial color={color} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.38, 0]}>
      <cylinderGeometry args={[0.025, 0.06, 0.14, 16]} />
      <meshStandardMaterial color={color} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.47, 0]}>
      <cylinderGeometry args={[0.027, 0.027, 0.05, 12]} />
      <meshStandardMaterial color='#fbbf24' metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

/* Presidio Social Club: American diner counter */
const DinerCounter = ({ position }) => (
  <group position={position}>
    <Soft args={[5.6, 1.1, 0.9]} position={[0, 0.55, 0]} color='#dc2626' radius={0.15} />
    <Soft args={[5.8, 0.1, 1]} position={[0, 1.13, 0]} color='#f1f5f9' radius={0.04} />
    <Soft args={[5.6, 0.12, 0.92]} position={[0, 0.85, 0.01]} color='#e2e8f0' metalness={0.7} roughness={0.25} radius={0.05} />
    {/* stools */}
    {[-1.8, -0.6, 0.6, 1.8].map((x) => (
      <group key={x} position={[x, 0, 0.95]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
          <meshStandardMaterial color='#e2e8f0' metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.74, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.22, 0.12, 24]} />
          <meshStandardMaterial color='#ef4444' roughness={0.4} />
        </mesh>
      </group>
    ))}
    {/* milkshake */}
    <group position={[-1.6, 1.18, 0.1]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.09, 0.06, 0.28, 16]} />
        <meshStandardMaterial color='#f9a8d4' roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color='#ffffff' roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.03, 12, 8]} />
        <meshStandardMaterial color='#dc2626' />
      </mesh>
      <mesh position={[0.04, 0.42, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        <meshStandardMaterial color='#ef4444' />
      </mesh>
    </group>
    {/* burger */}
    <group position={[-0.7, 1.18, 0.15]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
      {[
        [0.05, 0.12, 0.04, "#d97706"],
        [0.09, 0.13, 0.035, "#78350f"],
        [0.115, 0.135, 0.015, "#facc15"],
        [0.13, 0.13, 0.015, "#22c55e"],
      ].map(([y, r, h, c]) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[r, r, h, 24]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.12, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color='#f59e0b' />
      </mesh>
    </group>
    <Prop url={PROPS.cafeCake} size={0.4} position={[1.1, 1.18, 0]} />
    <Prop url={PROPS.cafeMug} size={0.18} position={[1.8, 1.18, 0.2]} />
    {/* neon sign for the whole cafe */}
    <TextPanel
      width={3.6}
      height={0.7}
      position={[0, 2.35, -0.85]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, h * 0.25);
        ctx.fill();
        ctx.shadowColor = "#f472b6";
        ctx.shadowBlur = h * 0.15;
        ctx.fillStyle = "#fbcfe8";
        ctx.font = `700 ${h * 0.4}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("THE CAFÉ", w / 2, h * 0.42);
        ctx.shadowColor = "#38bdf8";
        ctx.fillStyle = "#bae6fd";
        ctx.font = `500 ${h * 0.17}px Poppins, sans-serif`;
        ctx.fillText("OPEN · EVERY SHIFT COUNTS", w / 2, h * 0.78);
      }}
    />
    {/* checkerboard floor in front */}
    {Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 3 }, (_, j) => (
        <mesh key={`${i}-${j}`} position={[-2.7 + i * 0.6, 0.012, 0.75 + j * 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial color={(i + j) % 2 ? "#111827" : "#f8fafc"} roughness={0.5} />
        </mesh>
      ))
    )}
  </group>
);

/* Magic Flute Ristorante: brunch table with mimosas, champagne, and wine */
const BrunchTable = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.2, 0.76, 16]} />
      <meshStandardMaterial color='#78350f' />
    </mesh>
    <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.95, 0.9, 0.2, 40]} />
      <meshStandardMaterial color='#ffffff' roughness={0.9} />
    </mesh>
    {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
      <mesh key={a} position={[Math.sin(a) * 0.6, 0.77, Math.cos(a) * 0.6]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 24]} />
        <meshStandardMaterial color='#f1f5f9' />
      </mesh>
    ))}
    <Glass position={[0.3, 0.76, 0.35]} liquid='#fb923c' />
    <Glass position={[-0.35, 0.76, 0.3]} liquid='#fb923c' />
    <Glass position={[0.4, 0.76, -0.3]} liquid='#fde68a' />
    <Glass position={[-0.3, 0.76, -0.38]} liquid='#7f1d1d' height={0.16} />
    <Bottle position={[0.05, 0.76, -0.05]} color='#14532d' />
    <Bottle position={[-0.15, 0.76, 0.12]} color='#a16207' />
    <Prop url={PROPS.cafeCroissant} size={0.22} position={[0.6, 0.78, 0]} />
    <Prop url={PROPS.cafeMuffin} size={0.18} position={[-0.6, 0.78, 0]} />
    {[0, Math.PI].map((a) => (
      <Prop key={a} url={PROPS.chairWood} height={1} position={[Math.sin(a + Math.PI / 2) * 1.3, 0, 0]} rotation={[0, a - Math.PI / 2, 0]} />
    ))}
  </group>
);

/* K-Elements BBQ: table grill with banchan */
const KbbqTable = ({ position }) => (
  <group position={position}>
    <Soft args={[2, 0.12, 1.3]} position={[0, 0.76, 0]} color='#44403c' radius={0.05} />
    <Soft args={[1.8, 0.7, 1.1]} position={[0, 0.35, 0]} color='#292524' radius={0.08} />
    <mesh position={[0, 0.83, 0]}>
      <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
      <meshStandardMaterial color='#f97316' emissive='#ea580c' emissiveIntensity={1.2} />
    </mesh>
    <mesh position={[0, 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.05, 0.4, 24, 4]} />
      <meshStandardMaterial color='#1f2937' wireframe />
    </mesh>
    {[-0.12, 0.05, 0.18].map((x, i) => (
      <Soft key={x} args={[0.18, 0.02, 0.09]} position={[x, 0.875, -0.05 + i * 0.08]} color='#f87171' radius={0.008} />
    ))}
    {["#86efac", "#fca5a5", "#fde047", "#fdba74", "#f9a8d4"].map((c, i) => (
      <group key={c} position={[-0.75 + i * 0.37, 0.83, 0.48]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.06, 0.05, 16]} />
          <meshStandardMaterial color='#f8fafc' />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshStandardMaterial color={c} />
        </mesh>
      </group>
    ))}
    <pointLight position={[0, 1.1, 0]} color='#fb923c' intensity={3} distance={2.5} />
    <Puffs position={[0, 0.9, 0]} color='#e5e7eb' count={5} height={1.2} spread={0.3} size={0.12} />
    {[-0.6, 0.6].map((x) => (
      <Prop key={x} url={PROPS.stool} height={0.6} position={[x, 0, -1]} />
    ))}
  </group>
);

/* Flyer board on the left wall: one flyer per side gig */
const FLYER_W = 0.8;
const FLYER_H = 1;

const Flyer = ({ flyer, position, tilt }) => (
  <group position={position} rotation={[0, 0, tilt]}>
    <TextPanel
      width={FLYER_W}
      height={FLYER_H}
      deps={[flyer.title]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = flyer.color;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.font = `700 ${w * 0.12}px Poppins, sans-serif`;
        let y = wrapText(ctx, flyer.title, w / 2, h * 0.2, w * 0.86, w * 0.14);
        ctx.font = `500 ${w * 0.075}px 'Work Sans', sans-serif`;
        ctx.fillStyle = "#334155";
        y = wrapText(ctx, flyer.role, w / 2, y + h * 0.04, w * 0.84, w * 0.095);
        ctx.font = `400 ${w * 0.065}px 'Work Sans', sans-serif`;
        wrapText(ctx, flyer.dates, w / 2, y + h * 0.04, w * 0.84, w * 0.085);
      }}
    />
    <mesh position={[0, FLYER_H / 2 - 0.08, 0.02]}>
      <sphereGeometry args={[0.035, 12, 8]} />
      <meshStandardMaterial color='#ef4444' />
    </mesh>
  </group>
);

const FlyerBoard = ({ position }) => {
  const flyers = rooms.cafe.sections.find((s) => s.id === "board").flyers;
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <Soft args={[3.2, 2, 0.12]} position={[0, 1.6, 0]} color='#78350f' radius={0.05} />
      <Soft args={[3, 1.8, 0.14]} position={[0, 1.6, 0.01]} color='#d6a76c' radius={0.04} roughness={1} />
      {flyers.map((flyer, i) => (
        <Flyer
          key={flyer.title}
          flyer={flyer}
          position={[(i - (flyers.length - 1) / 2) * 0.95, 1.6 + (i % 2 ? -0.08 : 0.06), 0.1]}
          tilt={(i - 1) * 0.05}
        />
      ))}
    </group>
  );
};

const CafeDecor = () => (
  <>
    <DinerCounter position={[0.5, 0, -4.2]} />
    <BrunchTable position={[-4.6, 0, 1]} />
    <KbbqTable position={[4.6, 0, 1]} />
    <FlyerBoard position={[-7.85, 0, -2.2]} />
    <Plant url={PROPS.plantPothos} position={[7.2, 0, -4.6]} />
    <Plant position={[-7.2, 0, 4.4]} />
  </>
);

export default {
  width: 16,
  depth: 11,
  floor: "#e7c9a0",
  wall: "#fff7ed",
  trim: "#92400e",
  stations: {
    presidio: [0.5, -2.1],
    magicflute: [-4.6, 2.8],
    kelements: [4.6, 2.8],
    board: [-6.3, -2.2],
  },
  blockers: [
    [0.5, -4.2, 2.9, 0.5],
    [-4.6, 1, 1.6, 0.9],
    [4.6, 1, 1, 0.7],
  ],
  Decor: CafeDecor,
};
