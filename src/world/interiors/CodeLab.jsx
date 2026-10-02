import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { Plant, Soft, TextPanel } from "./shared";

/* Kateeva: an OLED inkjet printer laying RGB pixels onto a glass panel */
const COLS = 12;
const ROWS = 8;
const PIXEL = ["#ef4444", "#22c55e", "#3b82f6"];

const OledPrinter = ({ position }) => {
  const gantry = useRef();
  const pixels = useRef();
  useFrame(({ clock }) => {
    // sweep front-to-back, pause, then start a fresh panel
    const t = (clock.elapsedTime * 0.12) % 1.25;
    const sweep = Math.min(t, 1);
    const z = -0.7 + sweep * 1.4;
    if (gantry.current) gantry.current.position.z = z;
    pixels.current?.children.forEach((px) => {
      px.visible = px.position.z < z;
    });
  });
  return (
    <group position={position}>
      {/* machine base and frame */}
      <Soft args={[3, 0.9, 2]} position={[0, 0.45, 0]} color='#cbd5e1' radius={0.12} />
      <Soft args={[3.1, 0.08, 2.1]} position={[0, 0.92, 0]} color='#94a3b8' radius={0.03} />
      {/* glass substrate */}
      <mesh position={[0, 0.97, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.5]} />
        <meshStandardMaterial color='#e0f2fe' transparent opacity={0.55} roughness={0.05} metalness={0.2} />
      </mesh>
      {/* printed pixels, revealed behind the gantry */}
      <group ref={pixels}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          return (
            <mesh key={i} position={[-1 + c * (2 / (COLS - 1)), 0.985, -0.65 + r * (1.3 / (ROWS - 1))]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.1, 0.1]} />
              <meshBasicMaterial color={PIXEL[(c + r) % 3]} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      {/* moving gantry + print head */}
      <group ref={gantry}>
        {[-1.35, 1.35].map((x) => (
          <Soft key={x} args={[0.14, 0.6, 0.16]} position={[x, 1.25, 0]} color='#334155' />
        ))}
        <Soft args={[2.84, 0.14, 0.18]} position={[0, 1.55, 0]} color='#475569' />
        <Soft args={[0.3, 0.32, 0.26]} position={[0.2, 1.36, 0]} color='#1e293b' />
        <mesh position={[0.2, 1.17, 0]}>
          <cylinderGeometry args={[0.04, 0.01, 0.1, 12]} />
          <meshBasicMaterial color='#a78bfa' toneMapped={false} />
        </mesh>
      </group>
      {/* control station */}
      <group position={[2, 0, 0.5]}>
        <Soft args={[0.7, 1.05, 0.5]} position={[0, 0.52, 0]} color='#e2e8f0' />
        <Prop url={PROPS.officeMonitor} height={0.45} position={[0, 1.05, 0]} rotation={[0, -0.4, 0]} />
      </group>
      <TextPanel
        width={1.5}
        height={0.32}
        position={[0, 0.5, 1.01]}
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = "#e2e8f0";
          ctx.font = `600 ${h * 0.45}px Poppins, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("OLED INKJET", w / 2, h / 2);
        }}
      />
    </group>
  );
};

/* Bootcamp corner: Coding Temple + Co.Lab */
const CodeLaptop = ({ position, rotation, accent }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[0.5, 0.025, 0.34]} position={[0, 0.0125, 0]} color='#cbd5e1' radius={0.01} />
    <group position={[0, 0.02, -0.17]} rotation={[-0.25, 0, 0]}>
      <Soft args={[0.5, 0.34, 0.02]} position={[0, 0.17, 0]} color='#cbd5e1' radius={0.01} />
      <TextPanel
        width={0.46}
        height={0.3}
        position={[0, 0.17, 0.012]}
        emissive
        draw={(ctx, w, h) => {
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, w, h);
          const lines = [0.5, 0.75, 0.4, 0.62, 0.3, 0.55];
          lines.forEach((len, i) => {
            ctx.fillStyle = [accent, "#e2e8f0", "#fbbf24", "#e2e8f0", accent, "#94a3b8"][i];
            ctx.fillRect(w * (0.08 + (i % 3) * 0.05), h * (0.12 + i * 0.13), w * len, h * 0.06);
          });
        }}
      />
    </group>
  </group>
);

const StudentDesk = ({ position, accent }) => (
  <group position={position}>
    <Prop url={PROPS.tableMedium} size={1.4} />
    <CodeLaptop position={[0, 0.78, 0]} accent={accent} />
    <Prop url={PROPS.chairWood} height={0.95} position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]} />
  </group>
);

const Bootcamp = ({ position }) => (
  <group position={position}>
    <TextPanel
      width={3.6}
      height={0.7}
      position={[0, 2.45, -0.9]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0369a1";
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, h * 0.2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `800 ${h * 0.42}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("BOOTCAMP", w / 2, h / 2);
      }}
    />
    <StudentDesk position={[-1.3, 0, 0]} accent='#f472b6' />
    <StudentDesk position={[1.3, 0, 0]} accent='#34d399' />
    {/* little whiteboard between them */}
    <group position={[0, 0, -0.55]}>
      <Soft args={[0.06, 1.2, 0.06]} position={[0, 0.6, 0]} color='#94a3b8' />
      <Soft args={[0.9, 0.6, 0.04]} position={[0, 1.45, 0]} color='#ffffff' radius={0.02} />
    </group>
  </group>
);

/* Projects & hackathons: big screen on the right wall */
const BigScreen = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[2.8, 1.7, 0.12]} position={[0, 1.7, 0]} color='#0f172a' />
    <mesh position={[0, 1.7, 0.07]}>
      <planeGeometry args={[2.55, 1.45]} />
      <meshStandardMaterial color='#38bdf8' emissive='#0ea5e9' emissiveIntensity={0.9} />
    </mesh>
    {[0.25, -0.05, -0.35].map((y, i) => (
      <mesh key={y} position={[-0.3 + i * 0.15, 1.7 + y, 0.08]}>
        <planeGeometry args={[1.6 - i * 0.3, 0.12]} />
        <meshStandardMaterial color='#e0f2fe' emissive='#e0f2fe' emissiveIntensity={0.6} />
      </mesh>
    ))}
  </group>
);

/* GainSpan: a tiny intern desk (on purpose) */
const InternDesk = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[0.9, 0.05, 0.5]} position={[0, 0.6, 0]} color='#d6a873' radius={0.02} />
    {[
      [-0.4, -0.2],
      [0.4, -0.2],
      [-0.4, 0.2],
      [0.4, 0.2],
    ].map(([x, z]) => (
      <Soft key={`${x}${z}`} args={[0.04, 0.6, 0.04]} position={[x, 0.3, z]} color='#78350f' radius={0.01} />
    ))}
    {/* old monitor with a Wi-Fi interference histogram */}
    <Soft args={[0.42, 0.32, 0.26]} position={[-0.12, 0.79, -0.08]} color='#e7e5e4' radius={0.04} />
    <TextPanel
      width={0.32}
      height={0.22}
      position={[-0.12, 0.8, 0.055]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#14532d";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#86efac";
        [0.2, 0.45, 0.8, 0.6, 0.35, 0.15].forEach((v, i) => {
          ctx.fillRect(w * (0.1 + i * 0.14), h * (0.9 - v * 0.75), w * 0.1, h * v * 0.75);
        });
      }}
    />
    {/* Wi-Fi module on a breadboard */}
    <Soft args={[0.2, 0.02, 0.12]} position={[0.28, 0.635, 0.05]} color='#f8fafc' radius={0.005} />
    <Soft args={[0.07, 0.02, 0.05]} position={[0.28, 0.655, 0.05]} color='#1e3a8a' radius={0.005} />
    <Prop url={PROPS.cafeMug} size={0.12} position={[0.36, 0.625, -0.15]} />
    {/* sticky notes + nameplate */}
    {["#fde047", "#f9a8d4"].map((c, i) => (
      <Soft key={c} args={[0.08, 0.005, 0.08]} position={[0.1 + i * 0.1, 0.627, 0.17]} rotation={[0, i * 0.3, 0]} color={c} radius={0.002} />
    ))}
    <TextPanel
      width={0.34}
      height={0.08}
      position={[0, 0.66, 0.255]}
      rotation={[-0.3, 0, 0]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fde68a";
        ctx.font = `700 ${h * 0.6}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("INTERN", w / 2, h / 2);
      }}
    />
    {/* tiny stool */}
    <mesh position={[0, 0.22, 0.45]}>
      <cylinderGeometry args={[0.15, 0.13, 0.06, 20]} />
      <meshStandardMaterial color='#ef4444' />
    </mesh>
    <mesh position={[0, 0.1, 0.45]}>
      <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
      <meshStandardMaterial color='#94a3b8' metalness={0.6} />
    </mesh>
  </group>
);

const DevStudioDecor = () => (
  <>
    <OledPrinter position={[-4.6, 0, -3.3]} />
    <Bootcamp position={[3.6, 0, -3.6]} />
    <BigScreen position={[7.75, 0, 1.6]} rotation={[0, -Math.PI / 2, 0]} />
    <InternDesk position={[-6.2, 0, 2.6]} rotation={[0, 0.5, 0]} />
    <Prop url={PROPS.rugOval} size={3.6} position={[0, 0.01, 0.6]} />
    <Plant position={[7.2, 0, -4.8]} />
    <Plant url={PROPS.plantPothos} position={[-7.2, 0, -0.6]} />
  </>
);

export default {
  width: 16,
  depth: 11,
  floor: "#e2e8f0",
  wall: "#e0f2fe",
  trim: "#0369a1",
  stations: {
    kateeva: [-4.6, -1.1],
    gainspan: [-4.9, 2.9],
    codingtemple: [2.3, -1.7],
    colab: [4.9, -1.7],
    projects: [6.1, 1.6],
  },
  blockers: [
    [-4.6, -3.3, 1.6, 1.1],
    [3.6, -3.7, 2.1, 0.6],
    [-6.2, 2.6, 0.5, 0.35],
  ],
  Decor: DevStudioDecor,
};
