import Prop from "../Prop";
import { PROPS } from "../props";
import { DeskSetup, Plant, Soft } from "./shared";

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

const CodeLabDecor = () => (
  <>
    <DeskSetup position={[-4.5, -3.6]} />
    <DeskSetup position={[0, -3.6]} />
    <DeskSetup position={[4.5, -3.6]} />
    <BigScreen position={[6.75, 0, 1.2]} rotation={[0, -Math.PI / 2, 0]} />
    <Prop url={PROPS.rugOval} size={4} position={[0, 0.01, 0.8]} />
    <Prop url={PROPS.armchair} size={1.1} position={[-6, 0, 0.6]} rotation={[0, Math.PI / 2, 0]} />
    <Prop url={PROPS.books} size={0.5} position={[-5.9, 0, 1.6]} />
    <Prop url={PROPS.lamp} height={1.7} position={[-6.4, 0, 3]} />
    <Plant position={[6.5, 0, -4.4]} />
    <Plant url={PROPS.plantPothos} position={[-6.5, 0, -4.4]} />
  </>
);

export default {
  width: 14,
  depth: 10,
  floor: "#e2e8f0",
  wall: "#e0f2fe",
  trim: "#0369a1",
  stations: {
    kateeva: [-4.5, -2.6],
    codingtemple: [0, -2.6],
    colab: [4.5, -2.6],
    projects: [5, 1.2],
  },
  blockers: [
    [-4.5, -3.6, 1, 0.5],
    [0, -3.6, 1, 0.5],
    [4.5, -3.6, 1, 0.5],
    [-6, 0.6, 0.55, 0.55],
  ],
  Decor: CodeLabDecor,
};
