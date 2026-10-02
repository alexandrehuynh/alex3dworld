import { useEffect } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { setNavMap } from "../pathfinding";

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

  // Furniture blockers + room walls for the click-to-walk pathfinder
  useEffect(() => {
    setNavMap(
      { type: "rect", hw: config.width / 2, hd: config.depth / 2 },
      (config.blockers ?? []).map(([x, z, hw, hd]) => ({ type: "rect", x, z, hw, hd }))
    );
  }, [config]);
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
        radius: spot.radius ?? 1.6,
        showLabel: spot.label ?? config.labels !== false,
        // rings only where the spot isn't otherwise obvious (e.g. the parallettes)
        ring: spot.ring === true,
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
          showRing={zone.ring}
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
