import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

import { CLIPS } from "../constants/characters";

const TARGET_HEIGHT = 1.6;

// Loads a character, normalizes it to a consistent height with its feet at y=0,
// and cross-fades between clips when `animation` changes.
const CharacterModel = ({ url, animation = "idle", ...props }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(url);

  const { model, scale } = useMemo(() => {
    const model = cloneSkinned(scene);
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    // Apply the file's own (Z-up, centimeter) root transforms before measuring
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model, true);
    const height = box.max.y - box.min.y || 1;
    const scale = TARGET_HEIGHT / height;
    model.position.y = -box.min.y;
    return { model, scale };
  }, [scene]);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[CLIPS[animation]];
    if (!action) return;
    action.reset().fadeIn(0.2).play();
    return () => action.fadeOut(0.2);
  }, [actions, animation]);

  return (
    <group {...props}>
      <group ref={group} scale={scale}>
        <primitive object={model} />
      </group>
    </group>
  );
};

export default CharacterModel;
