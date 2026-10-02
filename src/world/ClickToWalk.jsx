import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { playerState } from "./playerState";
import { findPath } from "./pathfinding";

const ndc = new THREE.Vector2();

// Click or tap the ground (or a building / station) to walk there. Drags are
// ignored so they don't fight Look around. Objects can set userData.walkTo =
// [x, z] to send the player to a specific spot, like a door.
const ClickToWalk = ({ enabled }) => {
  const { gl, camera, scene, raycaster } = useThree();
  const marker = useRef();

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;
    let down = null;
    const onDown = (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() });
    const onUp = (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = performance.now() - down.t < 500;
      down = null;
      if (moved > 8 || !quick) return;

      const rect = el.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster
        .intersectObjects(scene.children, true)
        .find((h) => h.object.isMesh && h.object.visible && h.point.y < 4 && h.point.y > -0.5 && !h.object.userData.noWalk);
      if (!hit) return;

      let walkTo = null;
      for (let o = hit.object; o && !walkTo; o = o.parent) walkTo = o.userData?.walkTo;
      const [gx, gz] = walkTo ?? [hit.point.x, hit.point.z];
      const { x: sx, z: sz } = playerState.position;
      // route around obstacles; the last waypoint is where we actually end up
      const path = findPath(sx, sz, gx, gz);
      if (!path) return;
      playerState.path = path.map((p) => new THREE.Vector3(p.x, 0, p.z));
      playerState.moveTarget = playerState.path[playerState.path.length - 1];
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [enabled, gl, camera, scene, raycaster]);

  // Pulsing ring where you're headed
  useFrame(({ clock }) => {
    const m = marker.current;
    if (!m) return;
    const target = playerState.moveTarget;
    m.visible = !!target;
    if (!target) return;
    m.position.set(target.x, 0.05, target.z);
    const pulse = 1 + 0.15 * Math.sin(clock.elapsedTime * 6);
    m.scale.set(pulse, pulse, pulse);
  });

  return (
    <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} visible={false} userData={{ noWalk: true }}>
      <ringGeometry args={[0.3, 0.42, 32]} />
      <meshBasicMaterial color='#facc15' transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
};

export default ClickToWalk;
