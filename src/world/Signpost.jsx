import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { TextPanel } from "./interiors/shared";
import { buildings } from "../constants/world";

// Directory signpost in front of the fountain. The boards face the spawn
// camera (boards aimed straight at the far buildings would be edge-on), and
// each is shaped like an arrow toward its building; the two buildings that
// sit further back get arrows angled upward.
const BOARDS = [
  { id: "cafe", label: "Customer Service", dir: -1, tilt: 0.18 },
  { id: "code", label: "Software Engineering", dir: 1, tilt: 0.18 },
  { id: "sales", label: "Tech Sales", dir: -1, tilt: 0 },
  { id: "gym", label: "Fitness Coaching", dir: 1, tilt: 0 },
];

const W = 2.5;
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
      <CylinderCollider args={[2.1, 0.15]} position={[0, 2.1, 0]} />
    </RigidBody>
    <mesh position={[0, 2.15, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.09, 4.3, 12]} />
      <meshStandardMaterial color='#7c4a2d' roughness={0.8} />
    </mesh>
    <mesh position={[0, 4.35, 0]}>
      <sphereGeometry args={[0.1, 16, 12]} />
      <meshStandardMaterial color='#fbbf24' metalness={0.5} roughness={0.3} />
    </mesh>
    {/* header plank telling people what the arrows lead to */}
    <group position={[0, 3.95, 0.09]}>
      <TextPanel
        width={1.9}
        height={0.5}
        transparent
        draw={(ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.beginPath();
          ctx.roundRect(4, 4, w - 8, h - 8, h * 0.18);
          ctx.fillStyle = "#7c4a2d";
          ctx.fill();
          ctx.fillStyle = "#fef3c7";
          ctx.font = `800 ${h * 0.42}px Poppins, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.letterSpacing = `${h * 0.04}px`;
          ctx.fillText("CAREER PATHS", w / 2, h / 2 + 2);
        }}
      />
    </group>
    {BOARDS.map((b, i) => {
      const accent = buildings.find((x) => x.id === b.id).accent;
      return (
        // pivot at the pole so a tilted board only lifts its outer tip
        <group key={b.id} position={[0, 3.35 - i * 0.55, b.dir < 0 ? 0.11 : 0.09]} rotation={[0, 0, b.dir * b.tilt]}>
          <group position={[b.dir * (W / 2 - 0.1), 0, 0]}>
            <TextPanel width={W} height={H} draw={arrowBoard(b.label, accent, b.dir)} deps={[b.label]} transparent />
          </group>
        </group>
      );
    })}
  </group>
);

export default Signpost;
