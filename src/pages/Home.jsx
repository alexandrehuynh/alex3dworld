import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Joystick, useJoystickStore } from "ecctrl/input";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import sakura from "../assets/sakura.mp3";
import { Loader, RoomPanel } from "../components";
import { soundoff, soundon } from "../assets/icons";
import { buildings } from "../constants/world";
import { Building, Clouds, Island, Player } from "../world";

const KEYBOARD_MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const Home = () => {
  const audioRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [nearbyId, setNearbyId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const touch = useMemo(isTouch, []);

  const nearby = buildings.find((b) => b.id === nearbyId);
  const open = buildings.find((b) => b.id === openId);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sakura);
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
    }
    if (isPlayingMusic) audioRef.current.play();
    else audioRef.current.pause();
    return () => audioRef.current?.pause();
  }, [isPlayingMusic]);

  const onEnterZone = useCallback((id) => setNearbyId(id), []);
  const onExitZone = useCallback(
    (id) => setNearbyId((current) => (current === id ? null : current)),
    []
  );
  const closeRoom = useCallback(() => setOpenId(null), []);

  // E / Enter opens the room you're standing at
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "e" || e.key === "E" || e.key === "Enter") && nearbyId && !openId) {
        setOpenId(nearbyId);
        setShowIntro(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearbyId, openId]);

  // Hide the intro card once they start moving
  useEffect(() => {
    if (!showIntro) return;
    const hide = (e) => {
      if (KEYBOARD_MAP.some((k) => k.keys.includes(e.code))) setShowIntro(false);
    };
    window.addEventListener("keydown", hide);
    const unsubscribe = useJoystickStore.subscribe((state) => {
      if (Object.values(state.joysticks).some((j) => j.active)) setShowIntro(false);
    });
    return () => {
      window.removeEventListener("keydown", hide);
      unsubscribe();
    };
  }, [showIntro]);

  return (
    <section className='w-full h-screen relative overflow-hidden'>
      {showIntro && (
        <div className='absolute top-24 left-0 right-0 z-10 flex justify-center px-4 pointer-events-none'>
          <div className='neo-brutalism-blue py-4 px-6 text-white text-center sm:text-lg max-w-md pointer-events-auto'>
            Hi, I'm <span className='font-semibold'>Alex Huynh</span> 👋
            <br />
            <span className='text-sm sm:text-base opacity-90'>
              {touch
                ? "Use the joystick to walk around. Each building is a chapter of my career."
                : "Walk with WASD or the arrow keys (Shift to run). Each building is a chapter of my career."}
            </span>
          </div>
        </div>
      )}

      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas
          shadows
          className='w-full h-screen bg-sky-200'
          camera={{ fov: 50, near: 0.1, far: 500, position: [0, 12, 26] }}
        >
          <Suspense fallback={null}>
            <Sky sunPosition={[60, 40, 30]} turbidity={2} rayleigh={0.6} />
            <ambientLight intensity={0.7} />
            <hemisphereLight skyColor='#bae6fd' groundColor='#4d7c0f' intensity={0.6} />
            <directionalLight
              position={[20, 30, 15]}
              intensity={2.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
            />
            <Clouds />

            <Physics>
              <Island />
              {buildings.map((b) => (
                <Building
                  key={b.id}
                  building={b}
                  isNearby={nearbyId === b.id}
                  onEnterZone={onEnterZone}
                  onExitZone={onExitZone}
                />
              ))}
              <Player frozen={!!openId} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <Loader />

      {nearby && !open && (
        <div className='absolute bottom-24 sm:bottom-10 left-0 right-0 z-20 flex justify-center px-4'>
          <button
            onClick={() => setOpenId(nearby.id)}
            className='neo-brutalism-white neo-btn !text-base'
          >
            {nearby.emoji} Enter {nearby.name}
            {!touch && <kbd className='ml-2 rounded bg-slate-100 px-1.5 text-xs'>E</kbd>}
          </button>
        </div>
      )}

      {open && <RoomPanel building={open} onClose={closeRoom} />}

      {touch && !open && (
        <Joystick joystickWrapperStyle={{ left: 24, bottom: 72, width: 140, height: 140 }} />
      )}

      <Link
        to='/about'
        className='absolute top-24 right-4 z-20 hidden sm:block rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium shadow hover:bg-white'
      >
        Skip to résumé →
      </Link>

      <div className='absolute bottom-2 left-2 z-20'>
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt='Toggle music'
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className='w-10 h-10 cursor-pointer object-contain'
        />
      </div>
    </section>
  );
};

export default Home;
