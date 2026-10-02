import { useThree } from "@react-three/fiber";
import { EffectComposer, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

// Tone mapping, vignette and anti-aliasing. (Ambient occlusion and bloom were
// removed: they produced flickering black patches while walking.) Keyed on canvas size and pixel ratio so
// the effect buffers are rebuilt when the window is resized, zoomed, or moved
// to another display (otherwise part of the screen can render black).
const Effects = () => {
  const { size, viewport } = useThree();
  const key = `${Math.round(size.width)}x${Math.round(size.height)}@${viewport.dpr}`;
  return (
    <EffectComposer key={key} multisampling={0}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.35} darkness={0.25} />
      <SMAA />
    </EffectComposer>
  );
};

export default Effects;
