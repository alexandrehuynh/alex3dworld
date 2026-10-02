import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { Ecctrl } from "ecctrl";
import { useJoystickStore } from "ecctrl/input";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

import foxScene from "../assets/3d/fox.glb";

export const SPAWN = [0, 2, 9];
const CAMERA_OFFSET = new THREE.Vector3(0, 12, 14);
// Portrait phones see less width, so pull the camera further back
const CAMERA_OFFSET_NARROW = new THREE.Vector3(0, 17, 20);
const LOOK_OFFSET = new THREE.Vector3(0, 0.5, -3);

// Placeholder character: the fox from the contact page, until a CC0 humanoid
// replaces it. Clip names: idle, walk, hit (used as the run).
const Character = ({ animation }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(foxScene);
  // The contact page renders the same cached glTF, so walk with our own copy
  const model = useMemo(() => cloneSkinned(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[animation];
    if (!action) return;
    action.reset().fadeIn(0.15).play();
    return () => action.fadeOut(0.15);
  }, [actions, animation]);

  return (
    <group ref={group} position={[0, -0.6, 0]} rotation={[0, 0, 0]} scale={0.35}>
      <primitive object={model} />
    </group>
  );
};

const Player = ({ frozen }) => {
  const ecctrl = useRef();
  const [, getKeys] = useKeyboardControls();
  const [animation, setAnimation] = useState("idle");
  const animationRef = useRef("idle");
  const cameraTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(({ camera, size }, delta) => {
    const player = ecctrl.current;
    if (!player) return;

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
      player.body.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      player.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Pick a clip from the controller's state
    const next = !player.isMoving ? "idle" : player.moveSpeed > 3 ? "hit" : "walk";
    if (next !== animationRef.current) {
      animationRef.current = next;
      setAnimation(next);
    }

    // Smooth follow camera at a fixed angle
    const t = 1 - Math.pow(0.001, delta);
    cameraTarget.current
      .copy(player.currPos)
      .add(size.width < size.height ? CAMERA_OFFSET_NARROW : CAMERA_OFFSET);
    lookTarget.current.lerp(LOOK_OFFSET.clone().add(player.currPos), t);
    camera.position.lerp(cameraTarget.current, t);
    camera.lookAt(lookTarget.current);
  });

  return (
    <Ecctrl
      ref={ecctrl}
      name='player'
      position={SPAWN}
      capsuleHalfHeight={0.3}
      capsuleRadius={0.35}
      maxWalkVel={3.5}
      maxRunVel={7}
    >
      <Character animation={animation} />
    </Ecctrl>
  );
};

useGLTF.preload(foxScene);

export default Player;
