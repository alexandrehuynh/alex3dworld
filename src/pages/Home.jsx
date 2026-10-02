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
import StationCard from "../components/StationCard";
import { BUILDING_RING, buildings, rooms } from "../constants/world";
import { Building, Clouds, Island, Player } from "../world";
import { Interior, interiorSpawn } from "../world/interiors";
import { SPAWN } from "../world/Player";

// Where you reappear when walking out of a building: on its path, facing the plaza
const doorSpawn = (building) => {
  const k = (BUILDING_RING - 6) / BUILDING_RING;
  return [building.position[0] * k, 1.5, building.position[2] * k];
};

const sameTarget = (a, b) => a && b && a.kind === b.kind && a.id === b.id;

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

  // "island" or a building id when inside
  const [location, setLocation] = useState("island");
  const [spawn, setSpawn] = useState(SPAWN);
  const [fading, setFading] = useState(false);
  // What the player is standing at: { kind: "door" | "station" | "exit", id }
  const [target, setTarget] = useState(null);
  // Open UI: { kind: "station", id: sectionId } or { kind: "overview" }
  const [card, setCard] = useState(null);

  const inside = buildings.find((b) => b.id === location);
  const doorBuilding = target?.kind === "door" ? buildings.find((b) => b.id === target.id) : null;
  const overviewBuilding = card?.kind === "overview" ? inside ?? doorBuilding : null;
  const findSection = (id) => inside && rooms[inside.id].sections.find((s) => s.id === id);
  const stationSection = card?.kind === "station" ? findSection(card.id) : null;

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

  const onZone = useCallback((t) => setTarget(t), []);
  const offZone = useCallback((t) => setTarget((current) => (sameTarget(current, t) ? null : current)), []);
  const onDoorEnter = useCallback((id) => onZone({ kind: "door", id }), [onZone]);
  const onDoorExit = useCallback((id) => offZone({ kind: "door", id }), [offZone]);
  const closeCard = useCallback(() => setCard(null), []);

  // Fade out, swap scenes, fade back in
  const travel = useCallback((nextLocation, nextSpawn) => {
    setFading(true);
    setCard(null);
    setTimeout(() => {
      setTarget(null);
      setLocation(nextLocation);
      setSpawn(nextSpawn);
      setTimeout(() => setFading(false), 150);
    }, 350);
  }, []);

  const activate = useCallback(() => {
    if (!target || card || fading) return;
    setShowIntro(false);
    if (target.kind === "door") travel(target.id, interiorSpawn(target.id));
    else if (target.kind === "exit") travel("island", doorSpawn(inside));
    else if (target.kind === "station") setCard({ kind: "station", id: target.id });
  }, [target, card, fading, travel, inside]);

  // E / Enter acts on whatever you're standing at
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "e" || e.key === "E" || e.key === "Enter") activate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activate]);

  const prompt =
    target?.kind === "door"
      ? `${doorBuilding.emoji} Enter ${doorBuilding.name}`
      : target?.kind === "exit"
        ? "🚪 Back outside"
        : target?.kind === "station" && inside
          ? `${inside.emoji} ${findSection(target.id)?.title}`
          : null;

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

            <Physics key={location}>
              {inside ? (
                <Interior
                  building={inside}
                  sections={rooms[inside.id].sections}
                  active={target?.id ?? null}
                  onZone={onZone}
                  offZone={offZone}
                />
              ) : (
                <>
                  <Island />
                  {buildings.map((b) => (
                    <Building
                      key={b.id}
                      building={b}
                      isNearby={target?.kind === "door" && target.id === b.id}
                      onEnterZone={onDoorEnter}
                      onExitZone={onDoorExit}
                    />
                  ))}
                </>
              )}
              <Player
                characterUrl={activeCharacter.url}
                frozen={!!card || picking || fading}
                pose={picking ? "wave" : undefined}
                closeUp={picking}
                indoor={!!inside}
                spawn={spawn}
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

      {prompt && !card && !fading && !picking && (
        <div className='absolute bottom-24 sm:bottom-10 left-0 right-0 z-20 flex justify-center px-4'>
          <button onClick={activate} className='neo-brutalism-white neo-btn !text-base'>
            {prompt}
            {!touch && <kbd className='ml-2 rounded bg-slate-100 px-1.5 text-xs'>E</kbd>}
          </button>
        </div>
      )}

      {inside && !picking && (
        <div className='absolute top-24 left-4 z-20 flex flex-wrap items-center gap-2'>
          <span className='rounded-full bg-white/90 px-4 py-1.5 font-poppins text-sm font-semibold shadow'>
            {inside.emoji} {inside.name}
          </span>
          <button
            onClick={() => setCard({ kind: "overview" })}
            className='rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow hover:bg-white'
          >
            Overview
          </button>
          <button
            onClick={() => travel("island", doorSpawn(inside))}
            className='rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium shadow hover:bg-white'
          >
            Exit ↩
          </button>
        </div>
      )}

      {stationSection && (
        <StationCard
          building={inside}
          section={stationSection}
          onClose={closeCard}
          onOverview={() => setCard({ kind: "overview" })}
        />
      )}
      {overviewBuilding && <RoomPanel building={overviewBuilding} onClose={closeCard} />}

      <div
        className={`pointer-events-none absolute inset-0 z-40 bg-white transition-opacity duration-300 ${
          fading ? "opacity-100" : "opacity-0"
        }`}
      />

      {touch && !card && !picking && (
        <Joystick joystickWrapperStyle={{ left: 24, bottom: 72, width: 140, height: 140 }} />
      )}

      <Link
        to='/about'
        className='absolute top-24 right-4 z-20 hidden sm:block rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium shadow hover:bg-white'
      >
        Skip to résumé →
      </Link>

      {!picking && !card && (
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
