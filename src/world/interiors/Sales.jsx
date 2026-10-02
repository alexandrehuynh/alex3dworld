import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { DeskSetup, Plant, Soft, TextPanel } from "./shared";

const REVYL = "#7c3aed";

/* ------------------------------------------------------------------------ */
/* Numeral: sales tax compliance, for enterprises and mom-and-pop shops       */
/* ------------------------------------------------------------------------ */

const TAX_TILES = [
  "7.25", "6.5", "8.9", "6", "4", "6.25", "5.5", "7", "4.45",
  "6", "9.55", "5", "6.35", "8.25", "4.5", "6.9", "7.5", "5.3",
];

const TaxMapBoard = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    {[-0.9, 0.9].map((x) => (
      <Soft key={x} args={[0.08, 1.4, 0.08]} position={[x, 0.7, 0]} color='#475569' />
    ))}
    <Soft args={[2.3, 1.45, 0.08]} position={[0, 1.75, 0]} color='#e2e8f0' radius={0.04} />
    <TextPanel
      width={2.15}
      height={1.3}
      position={[0, 1.75, 0.045]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0f172a";
        ctx.font = `700 ${h * 0.1}px Poppins, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("Sales tax by state", w * 0.05, h * 0.14);
        const cols = 6;
        const cw = (w * 0.9) / cols;
        const ch = (h * 0.72) / 3;
        TAX_TILES.forEach((rate, i) => {
          const x = w * 0.05 + (i % cols) * cw;
          const y = h * 0.22 + Math.floor(i / cols) * ch;
          const t = (parseFloat(rate) - 4) / 6;
          ctx.fillStyle = `hsl(${150 - t * 120}, 70%, ${70 - t * 15}%)`;
          ctx.beginPath();
          ctx.roundRect(x + 4, y + 4, cw - 8, ch - 8, 10);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.font = `600 ${ch * 0.32}px 'Work Sans', sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(`${rate}%`, x + cw / 2, y + ch * 0.6);
        });
      }}
    />
  </group>
);

const Paperwork = () => (
  <>
    {[
      [-0.55, 0.12, 0.1],
      [-0.25, 0.2, -0.05],
      [0.45, 0.08, 0.25],
    ].map(([x, h, r]) => (
      <Soft key={x} args={[0.32, h, 0.42]} position={[x, 0.78 + h / 2, 0.15]} rotation={[0, r, 0]} color='#ffffff' radius={0.01} roughness={0.95} />
    ))}
  </>
);

// Tiny corner shop + office tower: Numeral serves both
const ShopAndTower = ({ position }) => (
  <group position={position}>
    <Prop url={PROPS.tableLow} size={1.4} />
    <group position={[-0.3, 0.42, 0]} scale={0.5}>
      <Soft args={[0.8, 0.6, 0.6]} position={[0, 0.3, 0]} color='#fef3c7' />
      {[0, 1, 2, 3].map((i) => (
        <Soft key={i} args={[0.2, 0.05, 0.3]} position={[-0.3 + i * 0.2, 0.55, 0.38]} rotation={[0.4, 0, 0]} color={i % 2 ? "#ffffff" : "#ef4444"} radius={0.02} />
      ))}
      <Soft args={[0.2, 0.32, 0.04]} position={[0, 0.16, 0.31]} color='#92400e' radius={0.02} />
    </group>
    <group position={[0.35, 0.42, -0.05]} scale={0.5}>
      <Soft args={[0.55, 1.5, 0.55]} position={[0, 0.75, 0]} color='#bfdbfe' />
      {[0.3, 0.6, 0.9, 1.2].map((y) => (
        <Soft key={y} args={[0.45, 0.08, 0.02]} position={[0, y, 0.28]} color='#1d4ed8' radius={0.01} />
      ))}
    </group>
  </group>
);

/* ------------------------------------------------------------------------ */
/* Revyl: mobile QA. Agents write tests -> conveyor -> cloud devices, with   */
/* results looping back to the developer                                     */
/* ------------------------------------------------------------------------ */

const AgentScreen = () => (
  <TextPanel
    width={0.62}
    height={0.38}
    position={[0.1, 1.12, -0.1]}
    emissive
    draw={(ctx, w, h) => {
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, 0, w, h);
      [0.2, 0.5, 0.8].forEach((x, i) => {
        ctx.fillStyle = ["#c4b5fd", "#a78bfa", "#ddd6fe"][i];
        ctx.beginPath();
        ctx.roundRect(w * x - w * 0.11, h * 0.25, w * 0.22, h * 0.3, 10);
        ctx.fill();
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(w * x - w * 0.06, h * 0.35, w * 0.03, h * 0.06);
        ctx.fillRect(w * x + w * 0.03, h * 0.35, w * 0.03, h * 0.06);
      });
      ctx.fillStyle = "#ede9fe";
      ctx.font = `600 ${h * 0.14}px Poppins, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("QA agents", w / 2, h * 0.82);
    }}
  />
);

const PHONES = 4;
const DOTS = 6;
const RevylLoop = ({ position }) => {
  const phones = useRef();
  const dots = useRef();
  useFrame(({ clock }) => {
    const t0 = clock.elapsedTime;
    // phones ride the belt from the agents' computer to the cloud
    phones.current?.children.forEach((phone, i) => {
      const t = (t0 * 0.15 + i / PHONES) % 1;
      phone.position.set(-1.3 + t * 2.6, 0.88 + Math.max(0, t - 0.85) * 4, 0);
      phone.scale.setScalar(t > 0.92 ? 1 - (t - 0.92) * 12 : 1);
    });
    // results flow back along the arc as green checks
    dots.current?.children.forEach((dot, i) => {
      const t = (t0 * 0.2 + i / DOTS) % 1;
      const a = Math.PI * t;
      dot.position.set(2.6 * Math.cos(a), 2.4 + Math.sin(a) * 0.9, -0.2);
    });
  });

  return (
    <group position={position}>
      {/* developer computer with agents */}
      <group position={[-2.6, 0, 0]}>
        <Prop url={PROPS.officeDesk} size={1.5} />
        <Soft args={[0.7, 0.45, 0.06]} position={[0.1, 1.12, -0.14]} color='#111827' radius={0.03} />
        <AgentScreen />
      </group>

      {/* conveyor */}
      <Soft args={[2.8, 0.16, 0.7]} position={[0, 0.75, 0]} color='#312e81' radius={0.07} />
      {[-1.2, 0, 1.2].map((x) => (
        <Soft key={x} args={[0.1, 0.68, 0.55]} position={[x, 0.34, 0]} color='#94a3b8' metalness={0.5} />
      ))}
      <group ref={phones}>
        {Array.from({ length: PHONES }, (_, i) => (
          <group key={i}>
            <Soft args={[0.28, 0.05, 0.5]} color='#111827' radius={0.02} />
            <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.23, 0.43]} />
              <meshBasicMaterial color={["#ddd6fe", "#c4b5fd", "#e9d5ff", "#a5b4fc"][i]} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* cloud devices: a cloud with phones testing inside it */}
      <group position={[2.6, 0, 0]}>
        {[
          [0, 2.1, 0, 0.75],
          [0.65, 1.95, 0.1, 0.55],
          [-0.65, 1.95, 0.05, 0.55],
          [0.25, 2.55, -0.1, 0.5],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 32, 24]} />
            <meshStandardMaterial color='#f5f3ff' emissive='#ddd6fe' emissiveIntensity={0.25} roughness={0.9} />
          </mesh>
        ))}
        {[-0.45, 0, 0.45].map((x, i) => (
          <group key={x} position={[x, 1.2, 0.55]} rotation={[0.15, 0, 0]}>
            <Soft args={[0.3, 0.55, 0.04]} color='#111827' radius={0.04} />
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.25, 0.47]} />
              <meshBasicMaterial color={["#bbf7d0", "#ddd6fe", "#bbf7d0"][i]} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <Soft args={[0.08, 1, 0.08]} position={[0, 0.5, 0]} color='#a78bfa' />
      </group>

      {/* feedback loop arc + results flowing back */}
      <mesh position={[0, 2.4, -0.2]}>
        <torusGeometry args={[2.6, 0.03, 8, 64, Math.PI]} />
        <meshStandardMaterial color={REVYL} emissive={REVYL} emissiveIntensity={0.6} />
      </mesh>
      <group ref={dots}>
        {Array.from({ length: DOTS }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.07, 12, 8]} />
            <meshStandardMaterial color='#22c55e' emissive='#22c55e' emissiveIntensity={1.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------------ */
/* Daloopa: the data layer for financial models                             */
/* ------------------------------------------------------------------------ */

// Filings flow into the data layer, which feeds a spreadsheet model; thin
// threads tie model cells back to their source documents.
const PAGES = 3;
const FilingStack = ({ position }) => {
  const pages = useRef();
  useFrame(({ clock }) => {
    pages.current?.children.forEach((page, i) => {
      const t = (clock.elapsedTime * 0.3 + i / PAGES) % 1;
      page.position.set(t * 1.1, 0.75 + Math.sin(t * Math.PI) * 0.7, -t * 0.25);
      page.rotation.set(-Math.PI / 2 + t * 0.6, 0, t * 0.8);
      page.material.opacity = t < 0.85 ? 1 : (1 - t) / 0.15;
    });
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Soft key={i} args={[0.5, 0.05, 0.66]} position={[0, 0.08 + i * 0.06, 0]} rotation={[0, i * 0.08, 0]} color='#ffffff' radius={0.01} roughness={0.95} />
      ))}
      <TextPanel
        width={0.46}
        height={0.6}
        position={[0, 0.39, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#0f172a";
          ctx.font = `700 ${w * 0.2}px Poppins, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("10-K", w / 2, h * 0.28);
          ctx.fillStyle = "#cbd5e1";
          for (let i = 0; i < 5; i++) ctx.fillRect(w * 0.12, h * (0.42 + i * 0.1), w * (0.76 - (i % 2) * 0.2), h * 0.035);
        }}
      />
      <group ref={pages}>
        {Array.from({ length: PAGES }, (_, i) => (
          <mesh key={i}>
            <planeGeometry args={[0.32, 0.42]} />
            <meshStandardMaterial color='#f8fafc' side={2} transparent />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const ModelScreen = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[0.08, 0.9, 0.08]} position={[0, 0.45, 0]} color='#475569' />
    <Soft args={[1.7, 1.1, 0.08]} position={[0, 1.4, 0]} color='#0f172a' />
    <TextPanel
      width={1.6}
      height={1}
      position={[0, 1.4, 0.045]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0f766e";
        ctx.fillRect(0, 0, w, h * 0.14);
        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${h * 0.08}px Poppins, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("Model.xlsx", w * 0.04, h * 0.095);
        const cols = 5;
        const rows = 7;
        const cw = w / cols;
        const ch = (h * 0.86) / rows;
        ctx.font = `500 ${ch * 0.42}px 'Work Sans', sans-serif`;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * cw;
            const y = h * 0.14 + r * ch;
            ctx.fillStyle = r === 0 || c === 0 ? "#e2e8f0" : (r + c) % 4 === 0 ? "#ccfbf1" : "#ffffff";
            ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
            ctx.fillStyle = "#334155";
            const label = r === 0 ? ["", "FY22", "FY23", "FY24", "FY25"][c] : c === 0 ? ["Rev", "COGS", "GP", "Opex", "EBIT", "EPS"][r - 1] : (100 + r * 37 + c * 13).toString();
            ctx.fillText(label, x + cw * 0.12, y + ch * 0.65);
          }
        }
      }}
    />
  </group>
);

const DaloopaHub = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.06, 0]} receiveShadow>
      <cylinderGeometry args={[1.9, 1.95, 0.12, 64]} />
      <meshStandardMaterial color='#0f172a' roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.75, 1.85, 64]} />
      <meshBasicMaterial color='#2dd4bf' toneMapped={false} />
    </mesh>
    <FilingStack position={[-1.15, 0.12, 0.2]} />
    <group scale={0.8} position={[0, 0.1, -0.1]}>
      <DataStack position={[0, 0, 0]} />
    </group>
    <ModelScreen position={[1.15, 0.12, -0.2]} rotation={[0, -0.35, 0]} />
    {/* source-link threads from model cells back to the filings */}
    {[0.15, 0.35, 0.55].map((dy, i) => (
      <mesh key={i} position={[0, 1.3 + dy, -0.05]} rotation={[0, 0, Math.PI / 2 + (i - 1) * 0.12]}>
        <cylinderGeometry args={[0.008, 0.008, 2.2, 6]} />
        <meshBasicMaterial color='#5eead4' toneMapped={false} transparent opacity={0.6} />
      </mesh>
    ))}
  </group>
);

// Stacked glowing discs: a literal "data layer"
const DataStack = ({ position }) => {
  const group = useRef();
  useFrame(({ clock }) => {
    group.current?.children.forEach((disc, i) => {
      disc.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(clock.elapsedTime * 2 - i * 0.8);
    });
  });
  return (
    <group ref={group} position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.25 + i * 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.28, 40]} />
          <meshStandardMaterial color='#38bdf8' emissive='#0ea5e9' emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const ServerRack = ({ position }) => {
  const leds = useRef();
  useFrame(({ clock }) => {
    leds.current?.children.forEach((led, i) => {
      led.material.emissiveIntensity = Math.sin(clock.elapsedTime * (3 + (i % 4)) + i) > 0.2 ? 2 : 0.2;
    });
  });
  return (
    <group position={position}>
      <Soft args={[0.9, 2.2, 0.8]} position={[0, 1.1, 0]} color='#1e293b' radius={0.06} />
      <group ref={leds}>
        {Array.from({ length: 16 }, (_, i) => (
          <mesh key={i} position={[-0.25 + (i % 4) * 0.16, 0.4 + Math.floor(i / 4) * 0.45, 0.41]}>
            <sphereGeometry args={[0.03, 8, 6]} />
            <meshStandardMaterial
              color={i % 3 ? "#22c55e" : "#38bdf8"}
              emissive={i % 3 ? "#22c55e" : "#38bdf8"}
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const SalesDecor = () => (
  <>
    {/* Numeral: left side */}
    <DeskSetup position={[-6.2, -1.6]}>
      <Paperwork />
    </DeskSetup>
    <TaxMapBoard position={[-7.9, 0, -3.6]} rotation={[0, 0.5, 0]} />
    <ShopAndTower position={[-4.3, 0, -2.6]} />

    {/* Revyl: back center */}
    <RevylLoop position={[0, 0, -5.2]} />

    {/* Daloopa: center of the room, current role */}
    <DaloopaHub position={[0, 0, 0.2]} />
    <ServerRack position={[8.1, 0, -4.9]} />

    {/* lounge along the right wall */}
    <group position={[7.4, 0, 1.6]} rotation={[0, -Math.PI / 2, 0]}>
      <Prop url={PROPS.rugStripes} size={3.6} position={[0, 0.01, 0.4]} />
      <Prop url={PROPS.couch} size={2.4} position={[0, 0, -0.5]} />
      <Prop url={PROPS.tableLow} size={1.2} position={[0, 0, 0.7]} />
    </group>
    <Plant position={[8.2, 0, 4.6]} />
    <Plant url={PROPS.plantPothos} position={[-8.2, 0, 4.6]} />
    <Prop url={PROPS.cactus} height={0.9} position={[-8.3, 0, -5.3]} />
  </>
);

export default {
  width: 18,
  depth: 13,
  floor: "#f5f3ff",
  wall: "#ede9fe",
  trim: "#5b21b6",
  stations: {
    numeral: [-6.2, -0.2],
    revyl: [0, -3.1],
    daloopa: [0, 2.7],
  },
  blockers: [
    [-6.2, -1.6, 1, 0.5],
    [-7.9, -3.6, 1.1, 0.4],
    [-4.3, -2.6, 0.7, 0.45],
    [-0.1, -5.2, 3.5, 0.6],
    [0, 0.2, 1.6, 1.1],
    [8.1, -4.9, 0.5, 0.45],
    [8, 1.6, 0.6, 1.3],
  ],
  Decor: SalesDecor,
};
