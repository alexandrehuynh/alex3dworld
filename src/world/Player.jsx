import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Ecctrl } from "ecctrl";
import { useJoystickStore } from "ecctrl/input";

import CharacterModel from "./CharacterModel";
import { playerState } from "./playerState";

export const SPAWN = [0, 2, 9];
const CAMERA_OFFSET = new THREE.Vector3(0, 7.5, 10);
// Portrait phones see less width, so pull the camera further back
const CAMERA_OFFSET_NARROW = new THREE.Vector3(0, 11, 15);
const LOOK_OFFSET = new THREE.Vector3(0, 0.5, -3);
// Close-up while choosing a character
// Indoors the rooms are small, so sit closer
const CAMERA_OFFSET_INDOOR = new THREE.Vector3(0, 6, 8.5);
// Standing at a station: ease in so the set piece fills the view
const CAMERA_OFFSET_STATION = new THREE.Vector3(0, 4.2, 6.4);
const CAMERA_OFFSET_PICK = new THREE.Vector3(0, 1.6, 5);
const LOOK_OFFSET_PICK = new THREE.Vector3(0, 0.2, 0);

const STILL = { forward: false, backward: false, leftward: false, rightward: false, run: false, jump: false, joystick: { x: 0, y: 0 } };
const camForward = new THREE.Vector3();
const camRight = new THREE.Vector3();
const toTarget = new THREE.Vector3();

// Turn a click-to-walk destination into a camera-relative joystick vector
// (Ecctrl moves relative to the camera). Returns null once arrived or stuck.
const steerToward = (camera, from, nav, delta) => {
  // follow waypoints; switch to the next one as soon as we're close
  let wp = nav.path[0];
  while (wp && nav.path.length > 1 && Math.hypot(wp.x - from.x, wp.z - from.z) < 0.5) {
    nav.path.shift();
    nav.best = Infinity;
    wp = nav.path[0];
  }
  if (!wp) return null;
  toTarget.set(wp.x - from.x, 0, wp.z - from.z);
  const dist = toTarget.length();
  if (nav.path.length === 1 && dist < 0.5) return null;
  // give up if we stop making progress (something unexpected in the way)
  if (dist < nav.best - 0.05) {
    nav.best = dist;
    nav.stuck = 0;
  } else if ((nav.stuck += delta) > 1.5) return null;
  camera.getWorldDirection(camForward).setY(0).normalize();
  camRight.crossVectors(camForward, camera.up).normalize();
  toTarget.normalize();
  // ease off on the last stretch so we stop on the spot instead of overshooting
  const speed = nav.path.length === 1 ? Math.min(1, Math.max(0.35, dist / 1.8)) : 1;
  return { x: toTarget.dot(camRight) * speed, y: toTarget.dot(camForward) * speed };
};

// Feet sit at the bottom of the capsule plus Ecctrl's float height
const FEET_Y = -(0.3 + 0.35 + 0.2);

const Player = ({ characterUrl, frozen, pose, closeUp, indoor, atStation, freeCam, focusRef, spawn = SPAWN }) => {
  const ecctrl = useRef();
  const [, getKeys] = useKeyboardControls();
  const [animation, setAnimation] = useState("idle");
  const animationRef = useRef("idle");
  const cameraTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const nav = useRef(null);

  useFrame(({ camera, size }, delta) => {
    const player = ecctrl.current;
    if (!player) return;
    // Dev-only handle for automated walkthrough tests (stripped from production builds)
    if (import.meta.env.DEV) {
      window.__player = player;
      window.__playerState = playerState;
    }

    // Feed keyboard + touch joystick (or a click-to-walk target) into the controller
    const keys = getKeys();
    const joystick = Object.values(useJoystickStore.getState().joysticks)[0];
    const manual =
      keys.forward || keys.backward || keys.leftward || keys.rightward || keys.jump || joystick?.active;

    if (playerState.moveTarget && (!nav.current || nav.current.target !== playerState.moveTarget)) {
      nav.current = {
        target: playerState.moveTarget,
        path: playerState.path.length ? [...playerState.path] : [playerState.moveTarget],
        best: Infinity,
        stuck: 0,
      };
    }
    let auto = null;
    if (nav.current && !manual && !frozen) {
      auto = steerToward(camera, player.currPos, nav.current, delta);
      if (!auto) {
        nav.current = playerState.moveTarget = null;
        playerState.path = [];
        // brake so we stop on the spot instead of sliding past it
        const v = player.body.linvel();
        player.body.setLinvel({ x: 0, y: v.y, z: 0 }, true);
      }
    } else if (manual || frozen) {
      nav.current = playerState.moveTarget = null;
      playerState.path = [];
    }

    player.setMovement(
      frozen
        ? STILL
        : auto
          ? { ...STILL, joystick: auto }
          : {
              forward: keys.forward,
              backward: keys.backward,
              leftward: keys.leftward,
              rightward: keys.rightward,
              run: keys.run,
              jump: keys.jump,
              joystick: joystick?.active ? { x: joystick.x, y: joystick.y } : { x: 0, y: 0 },
            }
    );
    playerState.position.copy(player.currPos);

    // Fell off the island: put them back on the plaza
    if (player.currPos.y < -25) {
      player.body.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true);
      player.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Pick a clip from the controller's state
    const next = !player.isMoving ? pose ?? "idle" : player.moveSpeed > 3.8 ? "run" : "walk";
    if (next !== animationRef.current) {
      animationRef.current = next;
      setAnimation(next);
    }

    if (focusRef) focusRef.current.copy(player.currPos);
    // Look-around mode hands the camera to OrbitControls
    if (freeCam) return;

    // Smooth follow camera at a fixed angle
    const t = 1 - Math.pow(0.001, delta);
    cameraTarget.current
      .copy(player.currPos)
      .add(
        closeUp
          ? CAMERA_OFFSET_PICK
          : indoor
            ? atStation
              ? CAMERA_OFFSET_STATION
              : CAMERA_OFFSET_INDOOR
            : size.width < size.height
              ? CAMERA_OFFSET_NARROW
              : CAMERA_OFFSET
      );
    lookTarget.current.lerp((closeUp ? LOOK_OFFSET_PICK : LOOK_OFFSET).clone().add(player.currPos), t);
    camera.position.lerp(cameraTarget.current, t);
    camera.lookAt(lookTarget.current);
  });

  return (
    <Ecctrl
      ref={ecctrl}
      name='player'
      position={spawn}
      capsuleHalfHeight={0.3}
      capsuleRadius={0.35}
      maxWalkVel={3.5}
      maxRunVel={7}
    >
      <CharacterModel url={characterUrl} animation={animation} position={[0, FEET_Y, 0]} />
    </Ecctrl>
  );
};

export default Player;
