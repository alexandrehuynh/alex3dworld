import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Ecctrl } from "ecctrl";
import { useJoystickStore } from "ecctrl/input";

import CharacterModel from "./CharacterModel";

export const SPAWN = [0, 2, 9];
const CAMERA_OFFSET = new THREE.Vector3(0, 7.5, 10);
// Portrait phones see less width, so pull the camera further back
const CAMERA_OFFSET_NARROW = new THREE.Vector3(0, 11, 15);
const LOOK_OFFSET = new THREE.Vector3(0, 0.5, -3);
// Close-up while choosing a character
// Indoors the rooms are small, so sit closer
const CAMERA_OFFSET_INDOOR = new THREE.Vector3(0, 6, 8.5);
const CAMERA_OFFSET_PICK = new THREE.Vector3(0, 1.6, 5);
const LOOK_OFFSET_PICK = new THREE.Vector3(0, 0.2, 0);

// Feet sit at the bottom of the capsule plus Ecctrl's float height
const FEET_Y = -(0.3 + 0.35 + 0.2);

const Player = ({ characterUrl, frozen, pose, closeUp, indoor, spawn = SPAWN }) => {
  const ecctrl = useRef();
  const [, getKeys] = useKeyboardControls();
  const [animation, setAnimation] = useState("idle");
  const animationRef = useRef("idle");
  const cameraTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(({ camera, size }, delta) => {
    const player = ecctrl.current;
    if (!player) return;
    // Dev-only handle for automated walkthrough tests (stripped from production builds)
    if (import.meta.env.DEV) window.__player = player;

    // Feed keyboard + touch joystick into the controller each frame
    const keys = getKeys();
    const joystick = Object.values(useJoystickStore.getState().joysticks)[0];
    player.setMovement(
      frozen
        ? { forward: false, backward: false, leftward: false, rightward: false, run: false, jump: false, joystick: { x: 0, y: 0 } }
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

    // Smooth follow camera at a fixed angle
    const t = 1 - Math.pow(0.001, delta);
    cameraTarget.current
      .copy(player.currPos)
      .add(
        closeUp
          ? CAMERA_OFFSET_PICK
          : indoor
            ? CAMERA_OFFSET_INDOOR
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
