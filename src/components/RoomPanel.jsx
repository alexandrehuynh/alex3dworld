import { useEffect } from "react";
import { Link } from "react-router-dom";

import { rooms } from "../constants/world";

const NOTE_COLORS = ["#fef08a", "#bbf7d0", "#fbcfe8", "#bae6fd", "#fed7aa"];

const Entry = ({ section, board, index }) => {
  const body = (
    <>
      <p className='font-poppins font-semibold text-lg text-slate-900'>{section.title}</p>
      <p className='text-sm text-slate-600'>
        {section.role ?? section.flyers?.map((f) => f.title).join(", ")}
      </p>
      {section.dates && <p className='text-xs text-slate-500'>{section.dates}</p>}
    </>
  );
  const className = board
    ? "room-note"
    : "rounded-xl bg-white/80 border border-slate-200 p-4 shadow-sm";
  const style = board
    ? { background: NOTE_COLORS[index % NOTE_COLORS.length], rotate: `${((index % 3) - 1) * 2}deg` }
    : undefined;

  if (!section.link) return <div className={className} style={style}>{body}</div>;
  const external = section.link.startsWith("http");
  return external ? (
    <a href={section.link} target='_blank' rel='noopener noreferrer' className={`${className} hover:-translate-y-0.5 transition`} style={style}>
      {body}
    </a>
  ) : (
    <Link to={section.link} className={`${className} hover:-translate-y-0.5 transition`} style={style}>
      {body}
    </Link>
  );
};

const RoomPanel = ({ building, onClose }) => {
  const room = rooms[building.id];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className='absolute inset-0 z-30 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4' onClick={onClose}>
      <div
        role='dialog'
        aria-label={building.name}
        className='w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl'
        style={{ borderTop: `8px solid ${building.accent}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-6 sm:p-8' style={{ background: room.board ? "#fdf6e3" : building.color }}>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-4xl'>{building.emoji}</p>
              <h2 className='head-text !text-3xl mt-2'>{building.name}</h2>
              <p className='mt-1 text-slate-600'>{room.intro}</p>
            </div>
            <button
              onClick={onClose}
              className='shrink-0 rounded-full bg-white px-3 py-1 text-sm font-medium shadow hover:bg-slate-50'
            >
              Esc ✕
            </button>
          </div>

          <div className={`mt-6 grid gap-4 ${room.board ? "grid-cols-2 sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {room.sections.map((section, i) => (
              <Entry key={section.id} section={section} board={room.board} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPanel;
