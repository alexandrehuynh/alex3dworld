import { useProgress } from "@react-three/drei";

// DOM overlay shown while 3D assets load. Rendered outside the <Canvas>
// (drei's <Html> inside a Suspense fallback crashes on unmount under React 19).
const Loader = () => {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className='absolute inset-0 z-20 flex flex-col justify-center items-center gap-3 pointer-events-none'>
      <div className='w-20 h-20 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin'></div>
      <p className='text-sm font-medium text-slate-600'>{Math.round(progress)}%</p>
    </div>
  );
};

export default Loader;
