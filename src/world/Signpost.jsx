import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { TextPanel } from "./interiors/shared";
import { buildings } from "../constants/world";

// Directory signpost in front of the fountain. The boards face the spawn
// camera (boards aimed straight at the far buildings would be edge-on), and
// each is shaped like an arrow toward its building, tilted up for the two
// buildings that sit ahead.
const BOARDS = [
  { id: "cafe", label: "Customer Service", dir: -1, tilt: 0.22 },
  { id: "code", label: "Software Dev", dir: 1, tilt: -0.22 },
  { id: "sales", label: "Tech Sales", dir: -1, tilt: 0 },
  { id: "gym", label: "Fitness Coach", dir: 1, tilt: 0 },
];

const W = 2.1;
const H = 0.42;

const arrowBoard = (label, color, dir) => (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  const tip = h * 0.55;
  const left = dir < 0 ? tip : 4;
  const right = dir < 0 ? w - 4 : w - tip;
  ctx.beginPath();
  if (dir < 0) {
    ctx.moveTo(4, h / 2);
    ctx.lineTo(left, 4);
    ctx.lineTo(right, 4);
    ctx.lineTo(right, h - 4);
    ctx.lineTo(left, h - 4);
  } else {
    ctx.moveTo(left, 4);
    ctx.lineTo(right, 4);
    ctx.lineTo(w - 4, h / 2);
    ctx.lineTo(right, h - 4);
    ctx.lineTo(left, h - 4);
  }
  ctx.closePath();
  ctx.fillStyle = "#fffaf0";
  ctx.fill();
  ctx.lineWidth = h * 0.1;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = "#1e293b";
  ctx.font = `700 ${h * 0.46}px Poppins, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, (left + right) / 2, h / 2 + 2, right - left - 16);
};

// sits on the grass ring between the plaza and the track, offset left
const Signpost = ({ position = [-2.4, 0, 7] }) => (
  <group position={position}>
    <RigidBody type='fixed' colliders={false}>
      <CylinderCollider args={[1.5, 0.15]} position={[0, 1.5, 0]} />
    </RigidBody>
    <mesh position={[0, 1.55, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.09, 3.1, 12]} />
      <meshStandardMaterial color='#7c4a2d' roughness={0.8} />
    </mesh>
    <mesh position={[0, 3.13, 0]}>
      <sphereGeometry args={[0.1, 16, 12]} />
      <meshStandardMaterial color='#fbbf24' metalness={0.5} roughness={0.3} />
    </mesh>
    {BOARDS.map((b, i) => {
      const accent = buildings.find((x) => x.id === b.id).accent;
      return (
        <group key={b.id} position={[b.dir * (W / 2 - 0.1), 2.75 - i * 0.55, 0.09]} rotation={[0, 0, b.tilt]}>
          <TextPanel width={W} height={H} draw={arrowBoard(b.label, accent, b.dir)} deps={[b.label]} transparent />
        </group>
      );
    })}
  </group>
);

export default Signpost;
