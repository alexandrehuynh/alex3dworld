import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { DeskSetup, LogoDecal, Plant, Soft, TextPanel } from "./shared";
import numeralLogo from "../../assets/logos/numeral.png";
import { daloopa, numeral, revyl } from "./brands";

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
/* Revyl: a dev codes on a laptop -> code ships down the belt -> runs on    */
/* cloud devices -> green checks loop back to the developer                  */
/* ------------------------------------------------------------------------ */

const CODE_COLORS = ["#c4b5fd", "#e2e8f0", "#fbbf24", "#a78bfa", "#94a3b8", "#c4b5fd"];
const codeLines = (ctx, w, h, x0 = 0.08) => {
  [0.5, 0.75, 0.4, 0.62, 0.3, 0.55].forEach((len, i) => {
    ctx.fillStyle = CODE_COLORS[i];
    ctx.fillRect(w * (x0 + (i % 3) * 0.05), h * (0.14 + i * 0.13), w * len * 0.8, h * 0.06);
  });
};

const DevLaptop = () => (
  <group position={[0, 0.78, 0]}>
    <Soft args={[0.7, 0.03, 0.46]} position={[0, 0.015, 0]} color='#27272a' radius={0.012} />
    <group position={[0, 0.03, -0.23]} rotation={[-0.25, 0, 0]}>
      <Soft args={[0.7, 0.46, 0.025]} position={[0, 0.23, 0]} color='#27272a' radius={0.012} />
      <TextPanel
        width={0.64}
        height={0.4}
        position={[0, 0.23, 0.014]}
        emissive
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0a0a0f";
          ctx.fillRect(0, 0, w, h);
          codeLines(ctx, w, h);
        }}
      />
    </group>
  </group>
);

// A floating chunk of code (a commit) riding the belt
const CodeBlock = ({ color }) => (
  <group>
    <Soft args={[0.42, 0.06, 0.32]} color='#18181b' radius={0.02} />
    <TextPanel
      width={0.38}
      height={0.28}
      position={[0, 0.032, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = color;
        ctx.font = `700 ${h * 0.45}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("</>", w / 2, h / 2);
      }}
    />
  </group>
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
      {/* developer at a laptop */}
      <group position={[-2.6, 0, 0]}>
        <Prop url={PROPS.tableMedium} size={1.3} />
        <DevLaptop />
        <Prop url={PROPS.officeChair} height={1.05} position={[0, 0, 0.7]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* conveyor */}
      <Soft args={[2.8, 0.16, 0.7]} position={[0, 0.75, 0]} color='#18181b' radius={0.07} />
      {[-1.2, 0, 1.2].map((x) => (
        <Soft key={x} args={[0.1, 0.68, 0.55]} position={[x, 0.34, 0]} color='#94a3b8' metalness={0.5} />
      ))}
      <group ref={phones}>
        {Array.from({ length: PHONES }, (_, i) => (
          <group key={i}>
            <CodeBlock color={["#c4b5fd", "#a78bfa", "#e9d5ff", "#8b5cf6"][i]} />
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
            <meshStandardMaterial color='#ede9fe' emissive='#a78bfa' emissiveIntensity={0.2} roughness={0.9} />
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
        ctx.fillStyle = "#33141c";
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
            ctx.fillStyle = r === 0 || c === 0 ? "#e2e8f0" : (r + c) % 4 === 0 ? "#fce7eb" : "#ffffff";
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
      <meshStandardMaterial color='#33141c' roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.75, 1.85, 64]} />
      <meshBasicMaterial color='#f5e6e8' toneMapped={false} />
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
        <meshBasicMaterial color='#fda4af' toneMapped={false} transparent opacity={0.6} />
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
          <meshStandardMaterial color='#9f1239' emissive='#be123c' emissiveIntensity={0.6} roughness={0.3} />
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

// Wall sign over each company's zone
const ZoneSign = ({ x, draw, logo }) => (
  <group position={[x, 0, -6.42]}>
    <Soft args={[3.3, 1.05, 0.08]} position={[0, 2.45, 0]} color='#e2e8f0' radius={0.04} />
    <TextPanel width={3.15} height={0.9} position={[0, 2.45, 0.045]} draw={draw} />
    {logo && <LogoDecal url={logo} width={0.66} position={[-1.05, 2.45, 0.05]} />}
  </group>
);

/* Front-left: call center with headset desks and a deal gong */
const Headset = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
      <torusGeometry args={[0.09, 0.012, 8, 20, Math.PI]} />
      <meshStandardMaterial color='#111827' />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} position={[side * 0.09, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshStandardMaterial color='#7c3aed' />
      </mesh>
    ))}
    <mesh position={[-0.05, 0.03, 0.06]} rotation={[0.3, 0, 0.6]}>
      <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
      <meshStandardMaterial color='#111827' />
    </mesh>
  </group>
);

const CallCenter = ({ position }) => (
  <group position={position}>
    {/* low divider behind the row of desks */}
    <Soft args={[4.6, 1.1, 0.1]} position={[0, 0.55, -0.75]} color='#c4b5fd' radius={0.04} />
    {[-1.15, 1.15].map((x) => (
      <DeskSetup key={x} position={[x, 0]}>
        <Headset position={[-0.55, 0.78, 0.1]} rotation={[0, 0.4, 0]} />
      </DeskSetup>
    ))}
  </group>
);

const Gong = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    {[-0.75, 0.75].map((x) => (
      <Soft key={x} args={[0.1, 1.9, 0.1]} position={[x, 0.95, 0]} color='#7f1d1d' radius={0.03} />
    ))}
    <Soft args={[1.75, 0.12, 0.12]} position={[0, 1.9, 0]} color='#7f1d1d' radius={0.04} />
    {[-0.75, 0.75].map((x) => (
      <Soft key={`f${x}`} args={[0.3, 0.06, 0.5]} position={[x, 0.03, 0]} color='#450a0a' radius={0.02} />
    ))}
    {[-0.25, 0.25].map((x) => (
      <mesh key={`c${x}`} position={[x, 1.75, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.25, 6]} />
        <meshStandardMaterial color='#1f2937' />
      </mesh>
    ))}
    <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.55, 0.55, 0.05, 48]} />
      <meshStandardMaterial color='#d4a017' metalness={0.85} roughness={0.25} />
    </mesh>
    <mesh position={[0, 1.1, 0.03]}>
      <torusGeometry args={[0.18, 0.02, 8, 32]} />
      <meshStandardMaterial color='#a16207' metalness={0.8} roughness={0.3} />
    </mesh>
    {/* mallet leaning on the stand */}
    <group position={[0.95, 0, 0.15]} rotation={[0, 0, 0.2]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color='#78350f' />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.08, 16, 12]} />
        <meshStandardMaterial color='#f5f5f4' roughness={0.9} />
      </mesh>
    </group>
  </group>
);

/* Front-right: lounge with a couch facing a wall TV showing the sales board */
const SalesBoardTv = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[2.6, 1.55, 0.1]} position={[0, 1.75, 0]} color='#0f172a' radius={0.05} />
    <TextPanel
      width={2.45}
      height={1.4}
      position={[0, 1.75, 0.055]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#c4b5fd";
        ctx.font = `800 ${h * 0.1}px Poppins, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("CAREER HIGHLIGHTS", w * 0.06, h * 0.12);
        // career highlights labeled by company, so the board never looks dated
        const rows = [
          ["Numeral · first to quota", "Top SDR"],
          ["Numeral · peak month", "280%"],
          ["Numeral · pipeline sourced", "$178.5K"],
          ["Revyl · meetings booked", "52"],
        ];
        rows.forEach(([k, v], i) => {
          const y = h * (0.32 + i * 0.17);
          ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)";
          ctx.fillRect(w * 0.04, y - h * 0.075, w * 0.92, h * 0.15);
          ctx.fillStyle = "#e2e8f0";
          ctx.font = `500 ${h * 0.068}px Poppins, sans-serif`;
          ctx.textAlign = "left";
          ctx.fillText(k, w * 0.08, y);
          ctx.fillStyle = "#4ade80";
          ctx.font = `700 ${h * 0.09}px Poppins, sans-serif`;
          ctx.textAlign = "right";
          ctx.fillText(v, w * 0.92, y);
        });
      }}
    />
  </group>
);

const Lounge = () => (
  <>
    <SalesBoardTv position={[8.95, 0, 2.6]} rotation={[0, -Math.PI / 2, 0]} />
    {/* dark slate rug so the yellow couch stands out */}
    <Soft args={[3.2, 0.03, 3.4]} position={[6.4, 0.015, 2.6]} color='#334155' radius={0.012} roughness={1} />
    <Prop url={PROPS.couch} size={2.4} position={[5.2, 0, 2.6]} rotation={[0, Math.PI / 2, 0]} />
    <Prop url={PROPS.tableLow} size={1.1} position={[6.8, 0, 2.6]} rotation={[0, Math.PI / 2, 0]} />
    <Plant position={[8.3, 0, 4.8]} />
  </>
);

const SalesDecor = () => (
  <>
    {/* Numeral, left */}
    <ZoneSign x={-6} draw={numeral} logo={numeralLogo} />
    <DeskSetup position={[-6.6, -4.9]}>
      <Paperwork />
    </DeskSetup>
    <ShopAndTower position={[-4.5, 0, -4.9]} />
    <TaxMapBoard position={[-8.1, 0, -3.4]} rotation={[0, Math.PI / 2, 0]} />

    {/* Revyl, center */}
    <ZoneSign x={0} draw={revyl} />
    <group scale={0.85}>
      <RevylLoop position={[0, 0, -5.8]} />
    </group>

    {/* Daloopa, right */}
    <ZoneSign x={6} draw={daloopa} />
    <DaloopaHub position={[6, 0, -4.4]} />
    <ServerRack position={[8.3, 0, -5.8]} />

    {/* call center + gong, front-left */}
    <CallCenter position={[-5.4, 0, 2.2]} />
    <Gong position={[-7.6, 0, 4.4]} rotation={[0, 0.6, 0]} />

    {/* lounge, front-right */}
    <Lounge />
  </>
);

export default {
  labels: false,
  width: 18,
  depth: 13,
  floor: "#f8fafc",
  wall: "#f1f5f9",
  trim: "#5b21b6",
  stations: {
    numeral: [-6, -2.2],
    revyl: [0, -2.4],
    daloopa: [6, -1.8],
  },
  blockers: [
    [-6.6, -4.9, 1, 0.5],
    [-4.5, -4.9, 0.7, 0.45],
    [-8.1, -3.4, 0.4, 1.1],
    [0, -4.9, 3, 0.55],
    [6, -4.4, 1.6, 1.1],
    [8.3, -5.8, 0.5, 0.45],
    [-5.4, 2.2, 2.4, 0.9],
    [-7.6, 4.4, 0.9, 0.5],
    [5.2, 2.6, 0.5, 1.2],
    [6.8, 2.6, 0.5, 0.5],
  ],
  Decor: SalesDecor,
};
