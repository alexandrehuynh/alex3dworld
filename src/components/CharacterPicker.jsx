import { useEffect } from "react";

// Bottom sheet for choosing who you walk around as. The 3D preview is the
// player itself, shown close-up and waving behind this panel.
const CharacterPicker = ({ characters, selectedId, onSelect, onConfirm }) => {
  const index = characters.findIndex((c) => c.id === selectedId);
  const step = (dir) =>
    onSelect(characters[(index + dir + characters.length) % characters.length].id);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") step(-1);
      if (e.key === "ArrowRight" || e.key === "d") step(1);
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className='absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4'>
      <div className='w-full max-w-md rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur'>
        <p className='text-center font-poppins text-lg font-semibold text-slate-800'>
          Who do you want to be?
        </p>
        <div className='mt-4 flex items-center justify-between gap-2'>
          <button
            onClick={() => step(-1)}
            aria-label='Previous character'
            className='h-10 w-10 shrink-0 rounded-full bg-slate-100 text-lg hover:bg-slate-200'
          >
            ‹
          </button>
          <div className='flex flex-1 justify-center gap-2'>
            {/* two rows: He / She */}
            <div className='flex flex-col gap-2'>
              {["He", "She"].map((group) => (
                <div key={group} className='flex items-center justify-center gap-2'>
                  <span className='w-8 text-right text-xs font-semibold uppercase text-slate-400'>{group}</span>
                  {characters
                    .filter((c) => c.group === group)
                    .map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          c.id === selectedId ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => step(1)}
            aria-label='Next character'
            className='h-10 w-10 shrink-0 rounded-full bg-slate-100 text-lg hover:bg-slate-200'
          >
            ›
          </button>
        </div>
        <button onClick={onConfirm} className='btn mt-4 !w-full'>
          Start exploring
        </button>
      </div>
    </div>
  );
};

export default CharacterPicker;
