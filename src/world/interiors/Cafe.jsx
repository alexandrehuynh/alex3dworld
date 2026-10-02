import Prop from "../Prop";
import { PROPS } from "../props";
import { wrapText } from "../textTexture";
import { rooms } from "../../constants/world";
import { LogoDecal, Plant, Puffs, Soft, TextPanel } from "./shared";
import { flyerArt, magicFlute, presidio } from "./brands";
import kElementsSign from "../../assets/logos/kelements.webp";

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

/* Presidio Social Club: long white marble bar with a dark navy front, black
   leather stools, and steel cabinets behind (from photos) */
const DinerCounter = ({ position }) => (
  <group position={position}>
    <Soft args={[5.6, 1.1, 0.9]} position={[0, 0.55, 0]} color='#1e2a44' radius={0.3} roughness={0.35} metalness={0.3} />
    <Soft args={[5.9, 0.1, 1.1]} position={[0, 1.13, 0.02]} color='#f4f4f5' radius={0.05} roughness={0.2} />
    {/* steel back-bar cabinets with bottles */}
    {[-2, -0.7, 0.6, 1.9].map((x) => (
      <group key={x} position={[x, 0, -1.05]}>
        <Soft args={[1.1, 0.7, 0.4]} position={[0, 1.75, 0]} color='#b8c0c8' metalness={0.7} roughness={0.3} radius={0.04} />
        <mesh position={[0, 1.75, 0.21]}>
          <planeGeometry args={[0.95, 0.55]} />
          <meshStandardMaterial color='#e0f2fe' transparent opacity={0.45} roughness={0.05} />
        </mesh>
        {[-0.3, -0.1, 0.1, 0.3].map((bx, i) => (
          <mesh key={bx} position={[bx, 1.66, 0.05]}>
            <cylinderGeometry args={[0.04, 0.04, 0.26, 10]} />
            <meshStandardMaterial color={["#14532d", "#d6d3d1", "#7c2d12", "#e0f2fe"][i]} roughness={0.2} />
          </mesh>
        ))}
      </group>
    ))}
    {/* stools */}
    {[-1.8, -0.6, 0.6, 1.8].map((x) => (
      <group key={x} position={[x, 0, 0.95]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} />
          <meshStandardMaterial color='#111111' metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.74, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.23, 0.18, 24]} />
          <meshStandardMaterial color='#111111' roughness={0.35} />
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
    {/* Presidio's sign up on the back wall, clear of the stools */}
    <TextPanel width={5.4} height={0.82} position={[0, 2.68, -1.24]} draw={presidio} />
    {/* wood floor in front of the bar */}
    <mesh position={[0, 0.012, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[6.2, 1.8]} />
      <meshStandardMaterial color='#8a5a35' roughness={0.6} />
    </mesh>
  </group>
);

/* Magic Flute Ristorante: garden patio brunch. Marble table, black-and-gold
   bistro chairs, wood fence with ivy and string lights, hanging wood sign */
const BistroChair = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.46, 0]} castShadow>
      <cylinderGeometry args={[0.24, 0.22, 0.06, 24]} />
      <meshStandardMaterial color='#111111' roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.72, -0.17]} rotation={[0.15, 0, 0]}>
      <torusGeometry args={[0.22, 0.04, 8, 24, Math.PI]} />
      <meshStandardMaterial color='#111111' roughness={0.6} />
    </mesh>
    {[
      [-0.16, -0.16],
      [0.16, -0.16],
      [-0.16, 0.16],
      [0.16, 0.16],
    ].map(([x, z]) => (
      <mesh key={`${x}${z}`} position={[x, 0.22, z]}>
        <cylinderGeometry args={[0.018, 0.018, 0.46, 8]} />
        <meshStandardMaterial color='#c9a227' metalness={0.6} roughness={0.35} />
      </mesh>
    ))}
  </group>
);

// Low ivy-topped garden fence with string lights between two posts, so it
// frames the table without blocking the flyer board behind it
const PatioBackdrop = () => (
  <group position={[0, 0, -1.4]}>
    <Soft args={[3.2, 0.8, 0.12]} position={[0, 0.4, 0]} color='#8b6b4e' radius={0.04} roughness={1} />
    {Array.from({ length: 9 }, (_, i) => (
      <Soft key={i} args={[0.03, 0.76, 0.13]} position={[-1.4 + i * 0.35, 0.4, 0.005]} color='#6f553e' radius={0.01} />
    ))}
    {Array.from({ length: 10 }, (_, i) => (
      <mesh key={i} position={[-1.45 + i * 0.32, 0.86 + (i % 3) * 0.04, 0.03]}>
        <sphereGeometry args={[0.17 + (i % 2) * 0.04, 16, 12]} />
        <meshStandardMaterial color={i % 2 ? "#3f7d3a" : "#4d8f45"} roughness={0.9} />
      </mesh>
    ))}
    {[-1.7, 1.7].map((x) => (
      <Soft key={x} args={[0.06, 2.7, 0.06]} position={[x, 1.35, 0]} color='#3b2416' />
    ))}
    {Array.from({ length: 11 }, (_, i) => (
      <mesh key={i} position={[-1.6 + i * 0.32, 2.6 - Math.sin((i / 10) * Math.PI) * 0.25, 0]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color='#fde68a' emissive='#fbbf24' emissiveIntensity={2} />
      </mesh>
    ))}
    <pointLight position={[0, 1.6, 0.8]} color='#fcd34d' intensity={2.5} distance={3} />
  </group>
);

// Powdered-sugar beignets on a plate
const Beignets = ({ position }) => (
  <group position={position}>
    <mesh>
      <cylinderGeometry args={[0.17, 0.17, 0.02, 24]} />
      <meshStandardMaterial color='#ffffff' />
    </mesh>
    {[
      [-0.05, -0.04, 0.3],
      [0.06, -0.03, -0.4],
      [0, 0.06, 0.9],
    ].map(([x, z, r], i) => (
      <Soft key={i} args={[0.11, 0.06, 0.11]} position={[x, 0.04 + (i === 2 ? 0.04 : 0), z]} rotation={[0, r, 0]} color='#fdf6e3' radius={0.03} roughness={1} />
    ))}
  </group>
);

// Fried calamari rings with a lemon wedge
const Calamari = ({ position }) => (
  <group position={position}>
    <mesh>
      <cylinderGeometry args={[0.17, 0.17, 0.02, 24]} />
      <meshStandardMaterial color='#ffffff' />
    </mesh>
    {[
      [-0.06, -0.04],
      [0.05, -0.05],
      [0, 0.05],
      [0.08, 0.06],
      [-0.08, 0.05],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.03 + (i % 2) * 0.015, z]} rotation={[Math.PI / 2 - 0.3 * (i % 3), 0, i]}>
        <torusGeometry args={[0.035, 0.014, 8, 16]} />
        <meshStandardMaterial color='#e0a85a' roughness={0.9} />
      </mesh>
    ))}
    <mesh position={[0.11, 0.03, -0.08]} rotation={[0, 0, Math.PI / 2]}>
      <sphereGeometry args={[0.035, 12, 8, 0, Math.PI]} />
      <meshStandardMaterial color='#fde047' />
    </mesh>
  </group>
);

const BrunchTable = ({ position }) => (
  <group position={position}>
    <PatioBackdrop />
    <mesh position={[0, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.22, 0.76, 16]} />
      <meshStandardMaterial color='#111111' />
    </mesh>
    <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.85, 0.85, 0.08, 40]} />
      <meshStandardMaterial color='#f4f4f5' roughness={0.25} />
    </mesh>
    {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
      <mesh key={a} position={[Math.sin(a) * 0.55, 0.77, Math.cos(a) * 0.55]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 24]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
    ))}
    <Glass position={[0.3, 0.76, 0.32]} liquid='#fb923c' />
    <Glass position={[-0.33, 0.76, 0.28]} liquid='#fb923c' />
    <Glass position={[0.38, 0.76, -0.28]} liquid='#fde68a' />
    <Glass position={[-0.28, 0.76, -0.35]} liquid='#7f1d1d' height={0.16} />
    <Bottle position={[0.05, 0.76, -0.05]} color='#14532d' />
    <Bottle position={[-0.15, 0.76, 0.12]} color='#a16207' />
    <Beignets position={[0.55, 0.77, 0.05]} />
    <Calamari position={[-0.55, 0.77, 0]} />
    {[-1, 1].map((side) => (
      <BistroChair key={side} position={[side * 1.15, 0, 0]} rotation={[0, (side * -Math.PI) / 2, 0]} />
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
    {/* storefront fascia + purple accent light like the real place */}
    <Soft args={[2.95, 1.15, 0.1]} position={[0, 1.95, -1.45]} color='#2b2622' radius={0.04} />
    <LogoDecal url={kElementsSign} width={2.85} position={[0, 1.95, -1.39]} />
    <Soft args={[2.9, 0.04, 0.04]} position={[0, 1.4, -1.42]} color='#a855f7' radius={0.01} />
    <mesh position={[0, 1.4, -1.38]}>
      <boxGeometry args={[2.8, 0.03, 0.01]} />
      <meshBasicMaterial color='#c084fc' toneMapped={false} />
    </mesh>
    {[-0.75, 0.75].map((x) => (
      <Soft key={x} args={[0.32, 0.03, 0.22]} position={[x, 0.835, -0.4]} color='#fda4af' radius={0.01} />
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
    {flyer.logo ? (
      <>
        <mesh>
          <planeGeometry args={[FLYER_W, FLYER_H]} />
          <meshStandardMaterial color='#ffffff' roughness={0.8} />
        </mesh>
        <LogoDecal url={flyer.logo} width={FLYER_W * 0.92} position={[0, -0.05, 0.005]} />
      </>
    ) : (
    <TextPanel
      width={FLYER_W}
      height={FLYER_H}
      deps={[flyer.title, flyer.art]}
      draw={
        flyerArt[flyer.art] ??
        ((ctx, w, h) => {
          ctx.fillStyle = flyer.color;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#0f172a";
          ctx.textAlign = "center";
          ctx.font = `700 ${w * 0.12}px Poppins, sans-serif`;
          const y = wrapText(ctx, flyer.title, w / 2, h * 0.2, w * 0.86, w * 0.14);
          ctx.font = `500 ${w * 0.075}px 'Work Sans', sans-serif`;
          ctx.fillStyle = "#334155";
          wrapText(ctx, flyer.role, w / 2, y + h * 0.04, w * 0.84, w * 0.095);
        })
      }
    />
    )}
    <mesh position={[0, FLYER_H / 2 - 0.08, 0.02]}>
      <sphereGeometry args={[0.035, 12, 8]} />
      <meshStandardMaterial color='#ef4444' />
    </mesh>
  </group>
);

const FlyerBoard = ({ position }) => {
  const flyers = rooms.cafe.sections.find((s) => s.id === "board").flyers;
  return (
    <group position={position}>
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

// Magic Flute blade sign: hangs from an arm off the left wall, perpendicular to
// it, so it faces the entrance like the real one on the street (two-sided)
const BladeSign = ({ position }) => (
  <group position={position}>
    <Soft args={[1.5, 0.06, 0.06]} position={[0.75, 3, 0]} color='#c9a227' radius={0.02} />
    <Soft args={[0.08, 0.3, 0.08]} position={[0.04, 2.85, 0]} color='#c9a227' radius={0.02} />
    {[0.35, 1.15].map((x) => (
      <mesh key={x} position={[x, 2.88, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
        <meshStandardMaterial color='#1f2937' />
      </mesh>
    ))}
    <group position={[0.75, 2.2, 0]}>
      <Soft args={[1.04, 1.24, 0.06]} color='#1c1917' radius={0.05} />
      {[1, -1].map((side) => (
        <TextPanel
          key={side}
          width={0.96}
          height={1.16}
          position={[0, 0, side * 0.035]}
          rotation={[0, side > 0 ? 0 : Math.PI, 0]}
          draw={magicFlute}
        />
      ))}
    </group>
    {/* PATIO SEATING plaque underneath */}
    <group position={[0.75, 1.43, 0]}>
      {[0.5, 1].map((x) => (
        <mesh key={x} position={[x - 0.75, 0.15, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.12, 6]} />
          <meshStandardMaterial color='#1f2937' />
        </mesh>
      ))}
      {[1, -1].map((side) => (
        <TextPanel
          key={side}
          width={0.9}
          height={0.18}
          position={[0, 0, side * 0.012]}
          rotation={[0, side > 0 ? 0 : Math.PI, 0]}
          draw={(ctx, w, h) => {
            ctx.fillStyle = "#14271f";
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#f8fafc";
            ctx.font = `700 ${h * 0.6}px Poppins, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("PATIO SEATING", w / 2, h / 2);
          }}
        />
      ))}
    </group>
  </group>
);

// Brass menu stand at the patio entrance: the Magic Flute station marker
const MenuStand = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.18, 0.2, 0.04, 24]} />
      <meshStandardMaterial color='#c9a227' metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 1.05, 10]} />
      <meshStandardMaterial color='#c9a227' metalness={0.7} roughness={0.3} />
    </mesh>
    <group position={[0, 1.12, 0]} rotation={[-0.6, 0, 0]}>
      <Soft args={[0.44, 0.34, 0.03]} color='#1f2937' radius={0.01} />
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[0.36, 0.26]} />
        <meshStandardMaterial color='#fdf6e3' />
      </mesh>
    </group>
  </group>
);

// Host stand by the entrance: the "front of house" itself
const HostStand = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[0.8, 1.05, 0.5]} position={[0, 0.53, 0]} color='#6b4226' radius={0.06} roughness={0.6} />
    <Soft args={[0.9, 0.06, 0.6]} position={[0, 1.08, -0.02]} rotation={[-0.15, 0, 0]} color='#3b2416' radius={0.02} />
    {/* stack of menus + small lamp */}
    <Soft args={[0.28, 0.06, 0.38]} position={[-0.18, 1.14, 0]} rotation={[-0.15, 0.1, 0]} color='#7f1d1d' radius={0.01} />
    <mesh position={[0.25, 1.25, -0.12]}>
      <cylinderGeometry args={[0.015, 0.03, 0.26, 8]} />
      <meshStandardMaterial color='#c9a227' metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0.25, 1.42, -0.12]}>
      <coneGeometry args={[0.1, 0.12, 20, 1, true]} />
      <meshStandardMaterial color='#14532d' side={2} />
    </mesh>
    <pointLight position={[0.25, 1.35, -0.12]} color='#fde68a' intensity={1.2} distance={1.5} />
    <TextPanel
      width={0.62}
      height={0.42}
      position={[0, 0.7, 0.26]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fef3c7";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `italic 400 ${h * 0.2}px Georgia, serif`;
        ctx.fillText("Please wait", w / 2, h * 0.36);
        ctx.fillText("to be seated", w / 2, h * 0.64);
      }}
    />
  </group>
);

const CafeDecor = () => (
  <>
    <DinerCounter position={[-1.2, 0, -4.2]} />
    {/* patio turned so its fence and lights run along the left wall */}
    <group position={[-5.9, 0, -0.6]} rotation={[0, Math.PI / 2, 0]}>
      <BrunchTable position={[0, 0, 0]} />
    </group>
    <BladeSign position={[-8, 0, 1.75]} />
    <MenuStand position={[-4.4, 0, 1.7]} />
    <group position={[4.6, 0, -5.38]}>
      <FlyerBoard position={[0, 0, 0]} />
    </group>
    <group position={[6.2, 0, 1]} rotation={[0, -Math.PI / 2, 0]}>
      <KbbqTable position={[0, 0, 0]} />
    </group>
    <HostStand position={[-2, 0, 3.7]} rotation={[0, 0.35, 0]} />
    <Plant url={PROPS.plantPothos} position={[7.3, 0, -4.8]} />
    <Plant position={[-7.2, 0, 4.4]} />
  </>
);

export default {
  labels: false,
  width: 16,
  depth: 11,
  floor: "#e7c9a0",
  wall: "#fff7ed",
  trim: "#92400e",
  stations: {
    presidio: [-1.2, -2.1],
    // the menu stand is the marker, so no floor ring
    magicflute: { at: [-4.4, 1.7], area: [1.6, 1.6] },
    kelements: [4.3, 1],
    board: [4.6, -3.8],
  },
  blockers: [
    [-1.2, -4.2, 3, 0.5],
    [-6.1, -0.6, 1.2, 1.6],
    [-4.4, 1.7, 0.15, 0.15],
    [6.5, 1, 1.2, 1],
    [-2, 3.7, 0.45, 0.35],
  ],
  Decor: CafeDecor,
};
