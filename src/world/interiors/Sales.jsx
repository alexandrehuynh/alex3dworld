import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { DeskSetup, Plant, Soft, TextPanel } from "./shared";

/* Numeral: sales tax compliance. Paperwork desk + tax-rate map */
const TAX_TILES = [
  "7.25", "6.5", "8.9", "6", "4", "6.25", "5.5", "7", "4.45",
  "6", "9.55", "5", "6.35", "8.25", "4.5", "6.9", "7.5", "5.3",
];
const TaxMap = ({ position }) => (
  <TextPanel
    width={3}
    height={1.8}
    position={position}
    draw={(ctx, w, h) => {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.font = `700 ${h * 0.09}px Poppins, sans-serif`;
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
    <Soft args={[0.18, 0.04, 0.24]} position={[0.1, 0.8, 0.25]} color='#1f2937' radius={0.015} />
  </>
);

/* Revyl: mobile software factory. Phones ride a conveyor out of the factory */
const PHONES = 5;
const Conveyor = ({ position }) => {
  const phones = useRef();
  const gear = useRef();
  useFrame(({ clock }, delta) => {
    if (gear.current) gear.current.rotation.z -= delta * 0.8;
    phones.current?.children.forEach((phone, i) => {
      const t = (clock.elapsedTime * 0.12 + i / PHONES) % 1;
      phone.position.x = -2.2 + t * 4.4;
      phone.visible = t > 0.08;
    });
  });
  return (
    <group position={position}>
      {/* belt */}
      <Soft args={[5, 0.18, 0.9]} position={[0, 0.75, 0]} color='#1f2937' radius={0.08} />
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x) => (
        <Soft key={x} args={[0.12, 0.7, 0.7]} position={[x, 0.33, 0]} color='#94a3b8' metalness={0.5} />
      ))}
      {/* factory gate the phones come out of */}
      <group position={[-2.3, 0, 0]}>
        <Soft args={[0.9, 1.9, 1.2]} position={[0, 0.95, 0]} color='#16a34a' radius={0.2} />
        <mesh ref={gear} position={[0, 1.5, 0.62]}>
          <torusGeometry args={[0.28, 0.08, 8, 12]} />
          <meshStandardMaterial color='#bbf7d0' />
        </mesh>
      </group>
      <group ref={phones}>
        {Array.from({ length: PHONES }, (_, i) => (
          <group key={i} position={[0, 0.88, 0]}>
            <Soft args={[0.32, 0.05, 0.58]} color='#111827' radius={0.02} />
            <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.27, 0.5]} />
              <meshBasicMaterial color={["#a7f3d0", "#bae6fd", "#fde68a", "#fbcfe8", "#ddd6fe"][i]} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const GiantPhone = ({ position }) => (
  <group position={position}>
    <Soft args={[1.1, 2, 0.12]} position={[0, 1.5, 0]} color='#111827' radius={0.12} />
    <TextPanel
      width={0.96}
      height={1.8}
      position={[0, 1.5, 0.065]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#ecfdf5";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(0, 0, w, h * 0.12);
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 ${h * 0.045}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Your app", w / 2, h * 0.075);
        ["#bbf7d0", "#a7f3d0", "#d1fae5", "#bbf7d0"].forEach((c, i) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.roundRect(w * 0.08, h * (0.17 + i * 0.17), w * 0.84, h * 0.13, 16);
          ctx.fill();
        });
        ctx.fillStyle = "#16a34a";
        ctx.beginPath();
        ctx.roundRect(w * 0.2, h * 0.86, w * 0.6, h * 0.08, 30);
        ctx.fill();
      }}
    />
    <Soft args={[0.5, 0.5, 0.4]} position={[0, 0.25, 0.05]} color='#e2e8f0' />
  </group>
);

/* Daloopa: financial data for AI. Candlestick screen + server rack */
const CANDLES = [3, 4.2, 3.6, 5, 4.4, 5.6, 6.1, 5.4, 6.8, 7.4, 6.9, 8.2];
const ChartScreen = ({ position }) => (
  <group position={position}>
    <Soft args={[3.4, 2, 0.12]} position={[0, 1.8, 0]} color='#0f172a' />
    <TextPanel
      width={3.2}
      height={1.8}
      position={[0, 1.8, 0.065]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        for (let i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, (h * i) / 5);
          ctx.lineTo(w, (h * i) / 5);
          ctx.stroke();
        }
        const cw = w / (CANDLES.length + 1);
        const y = (v) => h * 0.9 - (v / 9) * h * 0.75;
        CANDLES.forEach((v, i) => {
          const prev = i ? CANDLES[i - 1] : v - 0.5;
          const up = v >= prev;
          ctx.fillStyle = ctx.strokeStyle = up ? "#22c55e" : "#ef4444";
          const x = cw * (i + 0.6);
          ctx.beginPath();
          ctx.moveTo(x + cw * 0.25, y(Math.max(v, prev) + 0.5));
          ctx.lineTo(x + cw * 0.25, y(Math.min(v, prev) - 0.5));
          ctx.stroke();
          ctx.fillRect(x, y(Math.max(v, prev)), cw * 0.5, Math.max(4, y(Math.min(v, prev)) - y(Math.max(v, prev))));
        });
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `600 ${h * 0.07}px Poppins, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText("Fundamentals → AI", w * 0.04, h * 0.1);
      }}
    />
  </group>
);

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
    <DeskSetup position={[-5, -3.8]}>
      <Paperwork />
    </DeskSetup>
    <TaxMap position={[-5, 1.9, -5.48]} />

    <Conveyor position={[0.2, 0, -4.4]} />
    <GiantPhone position={[2.6, 0, -2.6]} />

    <ChartScreen position={[5.4, 0, -5.4]} />
    <ServerRack position={[7.3, 0, -3.8]} />

    {/* lounge */}
    <group position={[-5, 0, 2.4]}>
      <Prop url={PROPS.rugStripes} size={3.6} position={[0, 0.01, 0.2]} />
      <Prop url={PROPS.couch} size={2.4} position={[0, 0, -0.9]} />
      <Prop url={PROPS.armchair} size={1.1} position={[1.6, 0, 0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <Prop url={PROPS.tableLow} size={1.2} position={[0, 0, 0.4]} />
    </group>
    <Plant position={[7.2, 0, 4.2]} />
    <Plant url={PROPS.plantPothos} position={[-7.2, 0, -4.6]} />
    <Prop url={PROPS.cactus} height={0.9} position={[4.6, 0, 4.4]} />
  </>
);

export default {
  width: 16,
  depth: 11,
  floor: "#f5f3ff",
  wall: "#ede9fe",
  trim: "#5b21b6",
  stations: {
    numeral: [-5, -2.4],
    revyl: [0.4, -2.6],
    daloopa: [5.4, -3],
  },
  blockers: [
    [-5, -3.8, 1, 0.5],
    [0.2, -4.4, 2.8, 0.6],
    [2.6, -2.6, 0.4, 0.3],
    [7.3, -3.8, 0.5, 0.45],
    [-5, 1.5, 1.3, 0.5],
    [-5, 2.8, 0.6, 0.4],
  ],
  Decor: SalesDecor,
};
