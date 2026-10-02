import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { Room, Station } from "./Room";
import cafe from "./Cafe";
import code from "./CodeLab";
import gym from "./Gym";
import sales from "./Sales";

// Each interior: room shell colors/size, where each job's station sits (keyed
// by the section id in rooms[building].sections), blockers, and decor.
export const INTERIORS = { cafe, code, gym, sales };

// Puts a station on each job's spot and wraps everything in the room shell.
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
      {sections.map((section) => {
        const spot = config.stations[section.id];
        if (!spot) return null;
        // spot: [x, z] for a ring, or { at: [x, z], area: [w, d] } / { at, radius }
        const at = Array.isArray(spot) ? spot : spot.at;
        return (
          <Station
            key={section.id}
            id={section.id}
            label={section.title}
            showLabel={spot.label ?? config.labels !== false}
            position={at}
            area={spot.area}
            radius={spot.radius}
            accent={building.accent}
            active={active}
            onZone={onZone}
            offZone={offZone}
          />
        );
      })}
    </Room>
  );
};

export const interiorSpawn = (id) => [0, 1.5, INTERIORS[id].depth / 2 - 2];
