import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Prop from "../Prop";
import { PROPS } from "../props";
import { LogoDecal, Plant, Soft, TextPanel } from "./shared";
import codingTempleLogo from "../../assets/logos/codingtemple.png";
import coLabLogo from "../../assets/logos/colab.png";
import unrLogo from "../../assets/logos/unr.png";
import { gainSpan, kateeva } from "./brands";

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
        {/* monitor showing the RGB pixel inspection GUI */}
        <group position={[0, 1.05, 0]} rotation={[0, -0.4, 0]}>
          <Soft args={[0.06, 0.18, 0.06]} position={[0, 0.09, 0]} color='#1f2937' />
          <Soft args={[0.66, 0.42, 0.04]} position={[0, 0.38, 0]} color='#111827' radius={0.02} />
          <TextPanel
            width={0.6}
            height={0.36}
            position={[0, 0.38, 0.022]}
            emissive
            draw={(ctx, w, h) => {
              ctx.fillStyle = "#0f172a";
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = "#334155";
              ctx.fillRect(0, 0, w, h * 0.14);
              ctx.fillStyle = "#e2e8f0";
              ctx.font = `600 ${h * 0.09}px Poppins, sans-serif`;
              ctx.textBaseline = "middle";
              ctx.fillText("Pixel QA · RGB", w * 0.04, h * 0.07);
              // R / G / B uniformity bars
              [["#ef4444", 0.92], ["#22c55e", 0.88], ["#3b82f6", 0.95]].forEach(([c, v], i) => {
                const y = h * (0.26 + i * 0.16);
                ctx.fillStyle = "#1e293b";
                ctx.fillRect(w * 0.05, y, w * 0.5, h * 0.09);
                ctx.fillStyle = c;
                ctx.fillRect(w * 0.05, y, w * 0.5 * v, h * 0.09);
              });
              // pass badge + mini pixel grid
              ctx.fillStyle = "#16a34a";
              ctx.fillRect(w * 0.05, h * 0.76, w * 0.22, h * 0.13);
              ctx.fillStyle = "#ffffff";
              ctx.fillText("PASS", w * 0.08, h * 0.825);
              const colors = ["#ef4444", "#22c55e", "#3b82f6"];
              for (let r = 0; r < 4; r++)
                for (let c = 0; c < 4; c++) {
                  ctx.fillStyle = colors[(r + c) % 3];
                  ctx.fillRect(w * (0.62 + c * 0.085), h * (0.26 + r * 0.15), w * 0.06, h * 0.1);
                }
            }}
          />
        </group>
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
      position={[0, 2.75, -0.9]}
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
    {/* each bootcamp's logo above its desk */}
    {/* matching white panels so both logos read the same size, with a gap under the banner */}
    {[
      [-1.3, codingTempleLogo, 1.3],
      [1.3, coLabLogo, 0.82],
    ].map(([x, url, w]) => (
      <group key={x} position={[x, 1.75, -0.9]}>
        <Soft args={[1.55, 0.95, 0.05]} color='#ffffff' radius={0.05} />
        <LogoDecal url={url} width={w} position={[0, 0, 0.03]} />
      </group>
    ))}
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
    <TextPanel
      width={2.45}
      height={1.35}
      position={[0, 1.7, 0.075]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0ea5e9";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `800 ${h * 0.16}px Poppins, sans-serif`;
        ctx.fillText("PROJECTS &", w / 2, h * 0.3);
        ctx.fillText("HACKATHONS", w / 2, h * 0.5);
        ctx.fillStyle = "#e0f2fe";
        [0.68, 0.78, 0.88].forEach((y, i) => ctx.fillRect(w * (0.2 + i * 0.05), h * y, w * (0.6 - i * 0.1), h * 0.04));
      }}
    />
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
    {/* old monitor running a Wi-Fi signal-strength logger */}
    <Soft args={[0.42, 0.32, 0.26]} position={[-0.12, 0.79, -0.08]} color='#e7e5e4' radius={0.04} />
    <TextPanel
      width={0.32}
      height={0.22}
      position={[-0.12, 0.8, 0.055]}
      emissive
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0b3b4f";
        ctx.fillRect(0, 0, w, h);
        // gridlines
        ctx.strokeStyle = "rgba(94,234,212,0.15)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, (h * i) / 4);
          ctx.lineTo(w, (h * i) / 4);
          ctx.stroke();
        }
        // RSSI trace over time
        const pts = [0.55, 0.5, 0.62, 0.45, 0.4, 0.52, 0.35, 0.42, 0.3, 0.38, 0.33];
        ctx.strokeStyle = "#5eead4";
        ctx.lineWidth = h * 0.04;
        ctx.beginPath();
        pts.forEach((v, i) => {
          const x = w * (0.05 + (i / (pts.length - 1)) * 0.62);
          i ? ctx.lineTo(x, h * v) : ctx.moveTo(x, h * v);
        });
        ctx.stroke();
        // signal bars + dBm readout
        [0.25, 0.45, 0.65, 0.85].forEach((v, i) => {
          ctx.fillStyle = i < 3 ? "#f2a51a" : "rgba(242,165,26,0.3)";
          ctx.fillRect(w * (0.74 + i * 0.06), h * (0.6 - v * 0.45), w * 0.04, h * v * 0.45);
        });
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `700 ${h * 0.16}px Poppins, sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText("-48 dBm", w * 0.06, h * 0.85);
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
      width={0.46}
      height={0.12}
      position={[0, 0.66, 0.27]}
      rotation={[-0.3, 0, 0]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0f172a";
        ctx.font = `800 ${h * 0.62}px Poppins, sans-serif`;
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

// Round reception desk in the middle of the studio: a curved counter that's
// open at the back, with a monitor, a "Welcome" plaque, and a plant
const WelcomeDesk = ({ position }) => (
  <group position={position}>
    {/* counter body: 3/4 ring, opening at the back (-z) for the chair.
        Cylinder wall, wood top, and stripe all span the same arc. */}
    <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI * 1.25, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.1, 1.1, 1, 48, 1, true, 0, Math.PI * 1.5]} />
      <meshStandardMaterial color='#e0f2fe' roughness={0.5} side={2} />
    </mesh>
    {/* wood top */}
    <mesh position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI * 0.75]}>
      <ringGeometry args={[0.75, 1.2, 48, 1, 0, Math.PI * 1.5]} />
      <meshStandardMaterial color='#c08552' roughness={0.6} side={2} />
    </mesh>
    {/* accent stripe */}
    <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI * 1.25, 0]}>
      <cylinderGeometry args={[1.105, 1.105, 0.08, 48, 1, true, 0, Math.PI * 1.5]} />
      <meshStandardMaterial color='#0369a1' side={2} />
    </mesh>
    <TextPanel
      width={0.9}
      height={0.28}
      position={[0, 0.65, 1.12]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0369a1";
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, h * 0.3);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 ${h * 0.5}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("WELCOME", w / 2, h / 2);
      }}
    />
    <Prop url={PROPS.officeMonitor} height={0.42} position={[-0.5, 1.03, 0.65]} rotation={[0, Math.PI - 0.6, 0]} />
    <Prop url={PROPS.cafeMug} size={0.14} position={[0.55, 1.03, 0.65]} />
    <Prop url={PROPS.cactus} height={0.4} position={[0.8, 1.03, 0.1]} />
    <Prop url={PROPS.officeChair} height={1.05} position={[0, 0, -0.35]} />
  </group>
);

// UNR diploma, framed on the back wall between the printer and the bootcamp
const Diploma = ({ position }) => (
  <group position={position}>
    <Soft args={[1.75, 1.35, 0.06]} color='#1e2a4a' radius={0.03} />
    <Soft args={[1.6, 1.2, 0.07]} color='#c9a227' radius={0.02} metalness={0.4} roughness={0.4} />
    <TextPanel
      width={1.5}
      height={1.1}
      position={[0, 0, 0.04]}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#fffdf6";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#1e2a4a";
        ctx.lineWidth = w * 0.008;
        ctx.strokeRect(w * 0.03, h * 0.04, w * 0.94, h * 0.92);
        ctx.fillStyle = "#1e2a4a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 ${h * 0.065}px Georgia, serif`;
        ctx.fillText("University of Nevada, Reno", w / 2, h * 0.42);
        ctx.font = `italic 400 ${h * 0.05}px Georgia, serif`;
        ctx.fillText("confers upon Alexandre Huynh the degree of", w / 2, h * 0.53);
        ctx.font = `700 ${h * 0.075}px Georgia, serif`;
        ctx.fillText("Bachelor of Science", w / 2, h * 0.64);
        ctx.font = `600 ${h * 0.06}px Georgia, serif`;
        ctx.fillText("Electrical Engineering", w / 2, h * 0.74);
        ctx.font = `400 ${h * 0.045}px Georgia, serif`;
        ctx.fillText("Minors in Mathematics and Business Administration", w / 2, h * 0.83);
        ctx.fillText("May 2017", w / 2, h * 0.9);
      }}
    />
    {/* the N mark at the top of the diploma (crop of the logo's square) */}
    <LogoDecal url={unrLogo} width={0.5} position={[0, 0.34, 0.045]} />
  </group>
);

const DevStudioDecor = () => (
  <>
    <OledPrinter position={[-4.6, 0, -3.3]} />
    <TextPanel width={4.4} height={0.8} position={[-4.6, 2.35, -5.48]} draw={kateeva} />
    <TextPanel width={1.9} height={0.95} position={[-7.97, 1.6, 2.7]} rotation={[0, Math.PI / 2, 0]} draw={gainSpan} />
    <Bootcamp position={[3.6, 0, -3.6]} />
    <group scale={1.3}>
      <Diploma position={[-0.3, 1.4, -4.19]} />
    </group>
    <BigScreen position={[7.75, 0, 1.6]} rotation={[0, -Math.PI / 2, 0]} />
    <InternDesk position={[-6.2, 0, 2.6]} rotation={[0, 0.5, 0]} />
    <WelcomeDesk position={[0, 0, 1.8]} />
    <Plant position={[7.2, 0, -4.8]} />
    <Plant url={PROPS.plantPothos} position={[-7.2, 0, -0.6]} />
  </>
);

export default {
  // Logos on the walls name every station, so no floating labels
  labels: false,
  width: 16,
  depth: 11,
  floor: "#e2e8f0",
  wall: "#e0f2fe",
  trim: "#0369a1",
  stations: {
    // walk-up zones in front of each set piece
    kateeva: { at: [-4.6, -1.2], area: [3.8, 2] },
    gainspan: { at: [-5.3, 2.8], radius: 1.7 },
    codingtemple: { at: [2.3, -1.8], area: [2.3, 2] },
    colab: { at: [4.9, -1.8], area: [2.3, 2] },
    unr: { at: [-0.5, -4], area: [2.4, 2] },
    projects: { at: [6.2, 1.6], area: [2.2, 3.2] },
  },
  blockers: [
    [0, 1.8, 1.2, 1.2],
    [-4.6, -3.3, 1.6, 1.1],
    [3.6, -3.7, 2.1, 0.6],
    [-6.2, 2.6, 0.5, 0.35],
  ],
  Decor: DevStudioDecor,
};
