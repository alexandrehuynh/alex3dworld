import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { BUILDING_RING, ISLAND_RADIUS, buildings } from "../constants/world";

// Deterministic pseudo-random so the scenery layout is stable between reloads
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const LEAF_COLORS = ["#51cf66", "#40c057", "#69db7c", "#37b24d"];

// Rounded "puffball" tree: a few smooth, squashed spheres on a curved trunk
const Tree = ({ position, scale = 1, variant = 0 }) => (
  <group position={position} scale={scale} rotation={[0, variant * 1.7, 0]}>
    <mesh position={[0, 0.7, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.2, 1.4, 16]} />
      <meshStandardMaterial color='#8d5a3b' roughness={0.9} />
    </mesh>
    <mesh position={[0, 2, 0]} scale={[1, 0.9, 1]} castShadow>
      <sphereGeometry args={[0.95, 32, 24]} />
      <meshStandardMaterial color={LEAF_COLORS[variant % 4]} roughness={0.8} />
    </mesh>
    <mesh position={[0.45, 2.55, 0.2]} castShadow>
      <sphereGeometry args={[0.6, 32, 24]} />
      <meshStandardMaterial color={LEAF_COLORS[(variant + 1) % 4]} roughness={0.8} />
    </mesh>
    <mesh position={[-0.4, 2.4, -0.25]} castShadow>
      <sphereGeometry args={[0.55, 32, 24]} />
      <meshStandardMaterial color={LEAF_COLORS[(variant + 2) % 4]} roughness={0.8} />
    </mesh>
  </group>
);

const Rock = ({ position, scale = 1 }) => (
  <mesh position={position} scale={[scale, scale * 0.6, scale * 0.85]} castShadow receiveShadow>
    <icosahedronGeometry args={[0.5, 3]} />
    <meshStandardMaterial color='#c5cdd6' roughness={0.95} />
  </mesh>
);

// Working fountain: a central jet sprays droplets that arc out and splash
// into the pool, leaving expanding ripples. Water effects live outside the
// physics body so they don't affect the collider.
const STREAMS = 10;
const DROPS_PER_STREAM = 4;
const RIPPLES = STREAMS; // one splash where each stream lands
const POOL_Y = 0.62;
const NOZZLE_Y = 2.3;
const REACH = 1.25;
const PEAK = 1.1;

// Flowing stripes scrolled along each stream so the water reads as moving
const useFlowTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 64;
    const ctx = c.getContext("2d");
    // alternating bright and faint bands so the scrolling is easy to see
    ctx.fillStyle = "rgba(147,197,253,0.35)";
    ctx.fillRect(0, 0, 4, 64);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, 4, 20);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 1);
    return tex;
  }, []);

const FountainWater = () => {
  const ripples = useRef();
  const plume = useRef();
  const flow = useFlowTexture();

  // One arcing tube per stream: up out of the nozzle and down into the pool
  const curves = useMemo(
    () =>
      Array.from({ length: STREAMS }, (_, i) => {
        const a = (i / STREAMS) * Math.PI * 2;
        const pts = Array.from({ length: 24 }, (_, k) => {
          const t = k / 23;
          const r = REACH * t;
          const y = NOZZLE_Y + 4 * PEAK * t * (1 - t) - (NOZZLE_Y - POOL_Y) * t * t;
          return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
        });
        return new THREE.CatmullRomCurve3(pts);
      }),
    []
  );
  const geometries = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 48, 0.035, 8, false)), [curves]);
  const drops = useRef();
  const splashes = useRef();
  const temp = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    flow.offset.x -= delta * 2.4;
    const t0 = clock.elapsedTime;
    // bright droplets riding each stream from nozzle to pool
    if (drops.current) {
      let n = 0;
      curves.forEach((curve, s) => {
        for (let k = 0; k < DROPS_PER_STREAM; k++) {
          const t = (t0 * 0.9 + k / DROPS_PER_STREAM + s * 0.13) % 1;
          curve.getPoint(t, point);
          temp.position.copy(point);
          temp.scale.setScalar(0.055);
          temp.updateMatrix();
          drops.current.setMatrixAt(n++, temp.matrix);
        }
      });
      drops.current.instanceMatrix.needsUpdate = true;
    }
    // little splash domes that pop up where each stream lands
    splashes.current?.children.forEach((dome, i) => {
      const t = (t0 * 2.2 + i * 0.37) % 1;
      dome.scale.set(0.12 + t * 0.08, 0.25 * Math.sin(t * Math.PI), 0.12 + t * 0.08);
      dome.material.opacity = 0.9 * (1 - t);
    });
    ripples.current?.children.forEach((ring, i) => {
      const t = (clock.elapsedTime * 0.6 + (i % 3) / 3) % 1;
      const a = (i / STREAMS) * Math.PI * 2;
      ring.position.set(Math.cos(a) * REACH, POOL_Y + 0.01, Math.sin(a) * REACH);
      ring.scale.setScalar(0.25 + t * 0.9);
      ring.material.opacity = 0.7 * (1 - t);
    });
    if (plume.current) plume.current.scale.y = 1 + Math.sin(clock.elapsedTime * 9) * 0.06;
  });

  return (
    <group>
      <mesh position={[0, POOL_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.97, 64]} />
        <meshStandardMaterial color='#3b9cf0' roughness={0.08} metalness={0.25} />
      </mesh>
      <mesh ref={plume} position={[0, NOZZLE_Y + 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.09, 0.6, 16, 1, true]} />
        <meshStandardMaterial color='#e0f2fe' emissive='#bae6fd' emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            map={flow}
            color='#e0f2fe'
            emissive='#bae6fd'
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      ))}
      <instancedMesh ref={drops} args={[null, null, STREAMS * DROPS_PER_STREAM]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshBasicMaterial color='#ffffff' toneMapped={false} />
      </instancedMesh>
      <group ref={splashes}>
        {Array.from({ length: STREAMS }, (_, i) => {
          const a = (i / STREAMS) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * REACH, POOL_Y, Math.sin(a) * REACH]}>
              <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshBasicMaterial color='#ffffff' transparent opacity={0.8} depthWrite={false} />
            </mesh>
          );
        })}
      </group>
      <group ref={ripples}>
        {Array.from({ length: RIPPLES }, (_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.2, 32]} />
            <meshBasicMaterial color='#ffffff' transparent opacity={0.5} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Fountain = () => (
  <>
    <RigidBody type='fixed' colliders='hull'>
      <group>
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.2, 2.35, 0.6, 64]} />
          <meshStandardMaterial color='#e2e8f0' roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[2.1, 0.16, 16, 64]} />
          <meshStandardMaterial color='#f1f5f9' roughness={0.5} />
        </mesh>
        {/* column with a small top bowl and nozzle */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.34, 1.4, 32]} />
          <meshStandardMaterial color='#f1f5f9' roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.2, 0.25, 32]} />
          <meshStandardMaterial color='#f1f5f9' roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.25, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
          <meshStandardMaterial color='#cbd5e1' metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </RigidBody>
    <FountainWater />
  </>
);

// A path with rounded ends from the plaza to each building door
const Path = ({ angle }) => {
  const length = BUILDING_RING - 6;
  const mid = 3.5 + length / 2;
  return (
    <group position={[Math.sin(angle) * mid, 0.02, Math.cos(angle) * mid]} rotation={[0, angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.2, length]} />
        <meshStandardMaterial color='#e8d6ae' roughness={1} />
      </mesh>
      {[-1, 1].map((end) => (
        <mesh key={end} position={[0, 0, (end * length) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.1, 32]} />
          <meshStandardMaterial color='#e8d6ae' roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

// Island top: flat grass with a soft rounded rim (lathe profile)
const useIslandTop = () =>
  useMemo(() => {
    const pts = [new THREE.Vector2(0, 0)];
    const rim = 0.9;
    pts.push(new THREE.Vector2(ISLAND_RADIUS - rim, 0));
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      pts.push(new THREE.Vector2(ISLAND_RADIUS - rim + Math.sin(a) * rim, -rim + Math.cos(a) * rim));
    }
    pts.push(new THREE.Vector2(ISLAND_RADIUS - 0.2, -1.2));
    pts.push(new THREE.Vector2(0, -1.2));
    return new THREE.LatheGeometry(pts, 96);
  }, []);

const Island = () => {
  const topGeometry = useIslandTop();
  const scenery = useMemo(() => {
    const rand = seeded(42);
    const trees = [];
    const rocks = [];
    const keepClear = (x, z) => {
      const r = Math.hypot(x, z);
      if (r < 6.5 || r > ISLAND_RADIUS - 1.5) return false;
      // keep the south side open so trees don't block the follow camera
      if (z > 4 && Math.abs(x) < 9) return false;
      // stay off the running track
      if (r > BUILDING_RING - 8 && r < BUILDING_RING - 4.8) return false;
      // stay away from buildings and their paths
      return buildings.every((b) => {
        const [bx, , bz] = b.position;
        if (Math.hypot(x - bx, z - bz) < 7) return false;
        const along = (x * bx + z * bz) / BUILDING_RING;
        const across = Math.abs(x * bz - z * bx) / BUILDING_RING;
        return !(along > 0 && along < BUILDING_RING && across < 2.5);
      });
    };
    while (trees.length < 38) {
      const a = rand() * Math.PI * 2;
      const r = 6 + rand() * (ISLAND_RADIUS - 6);
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      if (keepClear(x, z))
        trees.push({ position: [x, 0, z], scale: 0.7 + rand() * 0.6, variant: trees.length % 4 });
    }
    while (rocks.length < 18) {
      const a = rand() * Math.PI * 2;
      const r = 6 + rand() * (ISLAND_RADIUS - 6);
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      if (keepClear(x, z)) rocks.push({ position: [x, 0.15, z], scale: 0.5 + rand() * 0.8 });
    }
    return { trees, rocks };
  }, []);

  return (
    <group>
      {/* Walkable top */}
      <RigidBody type='fixed' colliders={false}>
        <CylinderCollider args={[0.5, ISLAND_RADIUS]} position={[0, -0.5, 0]} />
        <mesh geometry={topGeometry} receiveShadow>
          <meshStandardMaterial color='#5fc97f' roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Soft, rounded earth underneath */}
      <mesh position={[0, -1.1, 0]} scale={[1, 0.42, 1]}>
        <sphereGeometry args={[ISLAND_RADIUS - 0.3, 96, 48, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color='#b07d56' roughness={1} side={2} />
      </mesh>
      {[
        [6, -9, 4, 4.5],
        [-7, -8, -3, 4],
        [1, -12, -2, 3.2],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 1.3, 1]}>
          <sphereGeometry args={[r, 48, 32]} />
          <meshStandardMaterial color={i % 2 ? "#9c6b47" : "#a8744e"} roughness={1} />
        </mesh>
      ))}

      {/* Plaza + running track */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.5, 96]} />
        <meshStandardMaterial color='#eadcb8' roughness={1} />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[BUILDING_RING - 7.2, BUILDING_RING - 5.6, 160]} />
        <meshStandardMaterial color='#f0703a' roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BUILDING_RING - 6.45, BUILDING_RING - 6.35, 160]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>

      {buildings.map((b) => (
        <Path key={b.id} angle={b.angle} />
      ))}

      <Fountain />

      {scenery.trees.map((t, i) => (
        <RigidBody key={`tree-${i}`} type='fixed' colliders={false} position={t.position}>
          <CylinderCollider args={[1, 0.3 * t.scale]} position={[0, 1, 0]} />
          <Tree position={[0, 0, 0]} scale={t.scale} variant={t.variant} />
        </RigidBody>
      ))}
      {scenery.rocks.map((r, i) => (
        <Rock key={`rock-${i}`} {...r} />
      ))}
    </group>
  );
};

export default Island;
