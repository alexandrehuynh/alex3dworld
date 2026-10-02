import * as THREE from "three";

// Shared, frame-updated player info. Mutated in useFrame (no React renders):
// - position: where the player is now (signs reveal themselves by distance)
// - moveTarget: click/tap-to-walk destination, or null
export const playerState = {
  position: new THREE.Vector3(0, -1000, 0),
  moveTarget: null,
};
