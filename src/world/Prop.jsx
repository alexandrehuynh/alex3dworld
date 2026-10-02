import * as THREE from "three";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

// Loads a static model and normalizes it: centered on x/z, resting on y=0, and
// scaled so its height (or largest side, via `size`) matches the given value.
const Prop = ({ url, height, size, ...props }) => {
  const { scene } = useGLTF(url);

  const { object, scale } = useMemo(() => {
    const object = scene.clone(true);
    object.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.set(-center.x, -box.min.y, -center.z);
    const scale = height
      ? height / (dims.y || 1)
      : size
        ? size / (Math.max(dims.x, dims.y, dims.z) || 1)
        : 1;
    return { object, scale };
  }, [scene, height, size]);

  return (
    <group {...props}>
      <group scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
};

export default Prop;
