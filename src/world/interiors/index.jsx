import { CuboidCollider, RigidBody } from "@react-three/rapier";

import Prop from "../Prop";
import { PROPS } from "../props";
import { Room, Soft, Station, WALL_HEIGHT } from "./Room";

// Each interior: room shell colors/size, where each job's station sits
// (by index into rooms[id].sections), and the decor around it.

const Plant = ({ url = PROPS.plantMonstera, ...props }) => <Prop url={url} height={1.3} {...props} />;

const DeskSetup = ({ position, rotation = 0 }) => (
  <group position={[position[0], 0, position[1]]} rotation={[0, rotation, 0]}>
    <Prop url={PROPS.officeDesk} size={1.9} />
    <Prop url={PROPS.officeMonitor} height={0.45} position={[0.1, 0.78, -0.15]} />
    <Prop url={PROPS.officeComputer} height={0.45} position={[0.75, 0.78, -0.1]} />
    <Prop url={PROPS.officeChair} height={1.05} position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]} />
  </group>
);

/* ---------------------------------- Gym ---------------------------------- */

const SquatRack = ({ position }) => (
  <group position={position}>
    {[
      [-0.75, -0.5],
      [0.75, -0.5],
      [-0.75, 0.5],
      [0.75, 0.5],
    ].map(([x, z]) => (
      <Soft key={`${x}${z}`} args={[0.14, 2.4, 0.14]} position={[x, 1.2, z]} color='#334155' metalness={0.4} roughness={0.4} />
    ))}
    {[-0.5, 0.5].map((z) => (
      <Soft key={z} args={[1.64, 0.12, 0.12]} position={[0, 2.35, z]} color='#334155' metalness={0.4} roughness={0.4} />
    ))}
    <mesh position={[0, 1.45, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 2.5, 16]} />
      <meshStandardMaterial color='#cbd5e1' metalness={0.9} roughness={0.25} />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 1.05, 1.45, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.1, 40]} />
          <meshStandardMaterial color='#ef4444' roughness={0.5} />
        </mesh>
        <mesh position={[0, side * 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 40]} />
          <meshStandardMaterial color='#1e293b' roughness={0.5} />
        </mesh>
      </group>
    ))}
  </group>
);

const DumbbellRack = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <Soft args={[2.6, 0.08, 0.6]} position={[0, 0.55, 0]} color='#1f2937' />
    <Soft args={[2.6, 0.08, 0.6]} position={[0, 0.95, -0.05]} color='#1f2937' />
    {[-1.2, 1.2].map((x) => (
      <Soft key={x} args={[0.1, 1, 0.5]} position={[x, 0.5, 0]} color='#475569' />
    ))}
    {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
      <Prop key={x} url={PROPS.gymDumbbell} size={0.42} position={[x, i % 2 ? 1 : 0.6, 0]} rotation={[0, Math.PI / 2, 0]} />
    ))}
  </group>
);

const WeightBench = ({ position }) => (
  <group position={position} rotation={[0, Math.PI / 2, 0]}>
    <Soft args={[1.3, 0.16, 0.36]} position={[0, 0.5, 0]} color='#111827' radius={0.07} roughness={0.5} />
    {[-0.45, 0.45].map((x) => (
      <Soft key={x} args={[0.08, 0.45, 0.32]} position={[x, 0.22, 0]} color='#94a3b8' metalness={0.5} roughness={0.35} />
    ))}
  </group>
);

const Gym = () => (
  <>
    {/* Mirror wall + ballet barre (Pure Barre corner) */}
    <mesh position={[-4, 1.5, -5.48]}>
      <planeGeometry args={[6, 2.2]} />
      <meshStandardMaterial color='#dbeafe' emissive='#bfdbfe' emissiveIntensity={0.35} metalness={0.2} roughness={0.08} />
    </mesh>
    <mesh position={[-4, 1, -5.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 5.4, 20]} />
      <meshStandardMaterial color='#d6a873' roughness={0.4} />
    </mesh>
    {[-6.4, -1.6].map((x) => (
      <Soft key={x} args={[0.08, 1, 0.08]} position={[x, 0.5, -5.1]} color='#94a3b8' />
    ))}
    <Prop url={PROPS.gymMat} size={1.9} position={[-5.4, 0.01, -3.4]} />
    <Prop url={PROPS.gymMat} size={1.9} position={[-3.1, 0.01, -3.4]} />

    {/* Equinox: squat rack + plate tree */}
    <SquatRack position={[0.4, 0, -4.4]} />
    <group position={[2.2, 0, -4.6]}>
      <Soft args={[0.12, 1.4, 0.12]} position={[0, 0.7, 0]} color='#334155' />
      {[0.35, 0.75, 1.15].map((y, i) => (
        <mesh key={y} position={[0, y, 0.08]} castShadow>
          <cylinderGeometry args={[0.3 - i * 0.05, 0.3 - i * 0.05, 0.08, 32]} />
          <meshStandardMaterial color={["#3b82f6", "#facc15", "#22c55e"][i]} roughness={0.5} />
        </mesh>
      ))}
    </group>

    {/* Murray Athletic: turf lane + bench */}
    <mesh position={[5.2, 0.015, -3.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial color='#22c55e' roughness={1} />
    </mesh>
    {[-1.2, 1.2].map((z) => (
      <mesh key={z} position={[5.2, 0.02, -3.6 + z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 0.06]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
    ))}
    <WeightBench position={[5.2, 0, -4.1]} />

    {/* LuxFit: dumbbell rack on the right wall */}
    <DumbbellRack position={[7.3, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

    {/* Bay Club: cardio row */}
    {[3.6, 5.4].map((x) => (
      <Prop key={x} url={PROPS.gymTreadmill} size={1.9} position={[x, 0, 3]} rotation={[0, Math.PI, 0]} />
    ))}

    {/* OFFTHEWEIGHTS: heavy bag on a frame + brand banner */}
    <group position={[-6.2, 0, 1.6]}>
      <Soft args={[0.12, 2.6, 0.12]} position={[-0.7, 1.3, 0]} color='#334155' />
      <Soft args={[1.5, 0.12, 0.12]} position={[0, 2.6, 0]} color='#334155' />
      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color='#64748b' />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.75, 8, 24]} />
        <meshStandardMaterial color='#b91c1c' roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.305, 0.305, 0.12, 32]} />
        <meshStandardMaterial color='#111827' roughness={0.5} />
      </mesh>
    </group>
    <Soft args={[0.06, 1.1, 2.6]} position={[-7.75, 1.6, 1.6]} color='#facc15' />

    <Plant position={[7, 0, -4.8]} />
  </>
);

/* -------------------------------- Code Lab ------------------------------- */

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

const CodeLab = () => (
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

/* ------------------------------- AI Sales HQ ------------------------------ */

const Whiteboard = ({ position }) => (
  <group position={position}>
    <Soft args={[3, 1.8, 0.1]} position={[0, 1.6, 0]} color='#ffffff' />
    {[0.5, 0.8, 1.15, 1.5].map((h, i) => (
      <Soft key={i} args={[0.32, h, 0.05]} position={[-0.8 + i * 0.55, 0.8 + h / 2, 0.08]} color={["#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"][i]} />
    ))}
  </group>
);

const SalesHQ = () => (
  <>
    <DeskSetup position={[-4.5, -3.4]} />
    <Whiteboard position={[0, 0, -4.85]} />
    <group position={[4.2, 0, -2]}>
      <Prop url={PROPS.rugStripes} size={3.6} position={[0, 0.01, 0.4]} />
      <Prop url={PROPS.couch} size={2.4} position={[0, 0, -1.2]} />
      <Prop url={PROPS.armchair} size={1.1} position={[1.6, 0, 0.6]} rotation={[0, -Math.PI / 2, 0]} />
      <Prop url={PROPS.tableLow} size={1.2} position={[0, 0, 0.3]} />
    </group>
    <Prop url={PROPS.pictureFrame} height={1.2} position={[-1.8, 1.4, -4.95]} />
    <Plant position={[-6.5, 0, -4.3]} />
    <Plant url={PROPS.plantPothos} position={[6.5, 0, 2.5]} />
    <Prop url={PROPS.cactus} height={0.9} position={[-6.5, 0, 2.5]} />
  </>
);

/* ---------------------------------- Café --------------------------------- */

const EspressoMachine = ({ position }) => (
  <group position={position}>
    <Soft args={[0.7, 0.55, 0.45]} position={[0, 0.28, 0]} color='#94a3b8' metalness={0.7} roughness={0.25} />
    <Soft args={[0.7, 0.1, 0.45]} position={[0, 0.6, 0]} color='#475569' />
    {[-0.15, 0.15].map((x) => (
      <mesh key={x} position={[x, 0.18, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color='#1e293b' metalness={0.6} />
      </mesh>
    ))}
  </group>
);

const Cafe = () => (
  <>
    {/* Counter with pastry display and espresso machine */}
    <RigidBody type='fixed' colliders={false}>
      <CuboidCollider args={[2.6, 0.6, 0.45]} position={[0.6, 0.6, -3.9]} />
    </RigidBody>
    <Soft args={[5.2, 1.1, 0.9]} position={[0.6, 0.55, -3.9]} color='#b45309' radius={0.15} />
    <Soft args={[5.4, 0.1, 1]} position={[0.6, 1.13, -3.9]} color='#fef3c7' radius={0.04} />
    <EspressoMachine position={[2.4, 1.18, -4.05]} />
    <Prop url={PROPS.cafeCake} size={0.4} position={[-1.2, 1.18, -3.9]} />
    <Prop url={PROPS.cafeCroissant} size={0.3} position={[-0.6, 1.18, -3.8]} />
    <Prop url={PROPS.cafeDonut} size={0.25} position={[-0.15, 1.18, -3.85]} />
    <Prop url={PROPS.cafeMuffin} size={0.25} position={[0.3, 1.18, -3.8]} />
    {[1.2, 1.5].map((x) => (
      <Prop key={x} url={PROPS.cafeMug} size={0.18} position={[x, 1.18, -3.7]} />
    ))}
    <Prop url={PROPS.shelfSmall} height={1} position={[0.6, 1.7, -4.95]} />
    {[-1, 0.4, 1.8].map((x) => (
      <Prop key={x} url={PROPS.stool} height={0.8} position={[x, 0, -2.9]} />
    ))}

    {/* Tour guide table with a map */}
    <group position={[-4.4, 0, 1]}>
      <Prop url={PROPS.tableMedium} size={1.6} />
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshStandardMaterial color='#d9f99d' />
      </mesh>
      {[-1, 1].map((s) => (
        <Prop key={s} url={PROPS.chairWood} height={1} position={[s * 1.05, 0, 0]} rotation={[0, (-s * Math.PI) / 2, 0]} />
      ))}
    </group>

    {/* Job board on the left wall */}
    <Prop url={PROPS.officeCorkboard} size={1.8} position={[-6.75, 1.1, -2.6]} rotation={[0, Math.PI / 2, 0]} />

    <group position={[3.8, 0, 1.6]}>
      <Prop url={PROPS.tableMedium} size={1.4} />
      <Prop url={PROPS.cafeMug} size={0.18} position={[0.2, 0.78, 0.1]} />
      <Prop url={PROPS.chairWood} height={1} position={[0, 0, 0.95]} rotation={[0, Math.PI, 0]} />
    </group>
    <Plant url={PROPS.plantPothos} position={[6.4, 0, -4.4]} />
  </>
);

export const INTERIORS = {
  gym: {
    width: 16,
    depth: 11,
    floor: "#475569",
    wall: "#f8fafc",
    trim: "#1f2937",
    stations: [
      [-4.3, -3.2], // Pure Barre
      [0.4, -3.4], // Equinox
      [5.2, -3.3], // Murray Athletic
      [6.4, 0], // LuxFit
      [4.5, 1.5], // Bay Club
      [-4.9, 1.6], // OFFTHEWEIGHTS
    ],
    // [x, z, halfWidth, halfDepth] boxes the player can't walk through
    blockers: [
      [0.4, -4.4, 0.9, 0.6],
      [4.5, 3, 1.9, 0.9],
      [7.3, 0, 0.35, 1.3],
      [-6.2, 1.6, 0.8, 0.3],
      [2.2, -4.6, 0.3, 0.3],
    ],
    Decor: Gym,
  },
  code: {
    width: 14,
    depth: 10,
    floor: "#e2e8f0",
    wall: "#e0f2fe",
    trim: "#0369a1",
    stations: [
      [-4.5, -2.6], // Kateeva
      [0, -2.6], // Coding Temple
      [4.5, -2.6], // Co.Lab
      [5, 1.2], // Projects
    ],
    blockers: [
      [-4.5, -3.6, 1, 0.5],
      [0, -3.6, 1, 0.5],
      [4.5, -3.6, 1, 0.5],
      [-6, 0.6, 0.55, 0.55],
    ],
    Decor: CodeLab,
  },
  sales: {
    width: 14,
    depth: 10,
    floor: "#f5f3ff",
    wall: "#ede9fe",
    trim: "#5b21b6",
    stations: [
      [-4.5, -2.4], // Numeral
      [0, -3.6], // Revyl
      [4.2, -0.4], // Dalupa
    ],
    blockers: [
      [-4.5, -3.4, 1, 0.5],
      [4.2, -3.2, 1.3, 0.5],
      [4.2, -1.7, 0.6, 0.4],
    ],
    Decor: SalesHQ,
  },
  cafe: {
    width: 14,
    depth: 10,
    floor: "#e7c9a0",
    wall: "#fff7ed",
    trim: "#92400e",
    stations: [
      [0.6, -2.7], // Server
      [-4.4, 2.3], // Tour Guide
      [-5.8, -2.6], // More odd jobs
    ],
    blockers: [
      [-4.4, 1, 1.4, 0.5],
      [3.8, 1.6, 0.7, 0.7],
    ],
    Decor: Cafe,
  },
};

export { WALL_HEIGHT };

// Puts a job station on each spot and wraps everything in the room shell.
export const Interior = ({ building, sections, active, onZone, offZone }) => {
  const config = INTERIORS[building.id];
  const { Decor } = config;
  return (
    <Room
      width={config.width}
      depth={config.depth}
      floor={config.floor}
      wall={config.wall}
      trim={config.trim}
      active={active}
      onZone={onZone}
      offZone={offZone}
    >
      <RigidBody type='fixed' colliders={false}>
        {config.blockers?.map(([x, z, hw, hd], i) => (
          <CuboidCollider key={i} args={[hw, 1.2, hd]} position={[x, 1.2, z]} />
        ))}
      </RigidBody>
      <Decor />
      {sections.map((section, i) =>
        config.stations[i] ? (
          <Station
            key={section.title}
            index={i}
            label={section.title}
            position={config.stations[i]}
            accent={building.accent}
            active={active}
            onZone={onZone}
            offZone={offZone}
          />
        ) : null
      )}
    </Room>
  );
};

export const interiorSpawn = (id) => [0, 1.5, INTERIORS[id].depth / 2 - 2];
