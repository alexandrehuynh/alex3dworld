import { Canvas } from "@react-three/fiber";
import { Environment, KeyboardControls, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Physics } from "@react-three/rapier";
import { Joystick, useJoystickStore } from "ecctrl/input";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import lofiOgg from "../assets/audio/lofi_loop.ogg";
import lofiMp3 from "../assets/audio/lofi.mp3";
import skyHdr from "../assets/sky/kloofendal_partly_cloudy_1k.hdr";
import CharacterPicker from "../components/CharacterPicker";
import { characters, loadCharacterId, saveCharacterId } from "../constants/characters";
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
  const [characterId, setCharacterId] = useState(
    () => characters.find((c) => c.id === loadCharacterId())?.id ?? null
  );
  const [picking, setPicking] = useState(characterId === null);
  const [previewId, setPreviewId] = useState(characterId ?? characters[0].id);
  const activeCharacter = characters.find((c) => c.id === (picking ? previewId : characterId));

  const confirmCharacter = useCallback(() => {
    saveCharacterId(previewId);
    setCharacterId(previewId);
    setPicking(false);
  }, [previewId]);

  const nearby = buildings.find((b) => b.id === nearbyId);
  const open = buildings.find((b) => b.id === openId);

  useEffect(() => {
    if (!audioRef.current) {
      // CC0 lofi loop; older Safari can't play Ogg, so fall back to the MP3
      const canOgg = new Audio().canPlayType("audio/ogg") !== "";
      audioRef.current = new Audio(canOgg ? lofiOgg : lofiMp3);
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
    if (!showIntro || picking) return;
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
  }, [showIntro, picking]);

  return (
    <section className='w-full h-screen relative overflow-hidden'>
      {picking && (
        <CharacterPicker
          characters={characters}
          selectedId={previewId}
          onSelect={setPreviewId}
          onConfirm={confirmCharacter}
        />
      )}

      {showIntro && !picking && (
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
          shadows='percentage'
          dpr={[1, 2]}
          className='w-full h-screen bg-sky-200'
          camera={{ fov: 50, near: 0.1, far: 500, position: [0, 12, 26] }}
        >
          <Suspense fallback={null}>
            {/* CC0 sky from Poly Haven, used as the backdrop only */}
            <Environment files={skyHdr} background='only' backgroundRotation={[0, Math.PI / 2, 0]} />
            <fog attach='fog' args={["#dbeafe", 60, 140]} />

            {/* Soft studio-style ambient light, generated in code (no HDRI download) */}
            <Environment resolution={256} environmentIntensity={0.55}>
              <Lightformer intensity={2} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} color='#fff7ed' />
              <Lightformer intensity={0.8} position={[-20, 4, 10]} rotation-y={Math.PI / 2} scale={[30, 10, 1]} color='#bae6fd' />
              <Lightformer intensity={0.8} position={[20, 4, -10]} rotation-y={-Math.PI / 2} scale={[30, 10, 1]} color='#fde68a' />
            </Environment>
            <hemisphereLight skyColor='#e0f2fe' groundColor='#4ade80' intensity={0.35} />
            <directionalLight
              position={[20, 30, 15]}
              intensity={2.5}
              color='#fff1d6'
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-radius={6}
              shadow-bias={-0.0004}
              shadow-normalBias={0.04}
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
              <Player
                characterUrl={activeCharacter.url}
                frozen={!!openId || picking}
                pose={picking ? "wave" : undefined}
                closeUp={picking}
              />
            </Physics>

            {/* Soft contact shading + gentle glow; skipped on phones to keep it smooth */}
            {!touch && (
              <EffectComposer multisampling={0}>
                <N8AO aoRadius={1.4} intensity={1.6} distanceFalloff={1} halfRes />
                <Bloom luminanceThreshold={0.85} intensity={0.35} mipmapBlur />
                <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                <Vignette offset={0.35} darkness={0.25} />
                <SMAA />
              </EffectComposer>
            )}
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

      {touch && !open && !picking && (
        <Joystick joystickWrapperStyle={{ left: 24, bottom: 72, width: 140, height: 140 }} />
      )}

      <Link
        to='/about'
        className='absolute top-24 right-4 z-20 hidden sm:block rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium shadow hover:bg-white'
      >
        Skip to résumé →
      </Link>

      {!picking && !open && (
        <button
          onClick={() => {
            setPreviewId(characterId);
            setPicking(true);
          }}
          className='absolute bottom-3 left-14 z-20 rounded-full bg-white/85 px-3 py-1.5 text-sm font-medium shadow hover:bg-white'
        >
          Change character
        </button>
      )}

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
