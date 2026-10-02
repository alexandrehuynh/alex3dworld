import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { Room, Station, StationTracker } from "./Room";
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
  // spot: [x, z] for a ring, or { at: [x, z], area: [w, d] } / { at, radius }
  const zones = sections
    .filter((section) => config.stations[section.id])
    .map((section) => {
      const spot = config.stations[section.id];
      return {
        id: section.id,
        label: section.title,
        at: Array.isArray(spot) ? spot : spot.at,
        area: spot.area,
        radius: spot.radius ?? 1.1,
        showLabel: spot.label ?? config.labels !== false,
      };
    });
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
      {zones.map((zone) => (
        <Station
          key={zone.id}
          id={zone.id}
          label={zone.label}
          showLabel={zone.showLabel}
          showRing={config.rings !== false}
          position={zone.at}
          area={zone.area}
          radius={zone.radius}
          accent={building.accent}
          active={active}
        />
      ))}
      <StationTracker zones={zones} onZone={onZone} offZone={offZone} />
    </Room>
  );
};

export const interiorSpawn = (id) => [0, 1.5, INTERIORS[id].depth / 2 - 2];
