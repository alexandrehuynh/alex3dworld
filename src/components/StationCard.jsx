import { useEffect } from "react";
import { Link } from "react-router-dom";

// Card for a single job station inside a building
const StationCard = ({ building, section, onClose, onOverview }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const external = section.link?.startsWith("http");

  return (
    <div className='absolute inset-x-0 bottom-6 z-30 flex justify-center px-4'>
      <div
        role='dialog'
        aria-label={section.title}
        className='w-full max-w-md rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur'
        style={{ borderTop: `6px solid ${building.accent}` }}
      >
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>
              {building.emoji} {building.name}
            </p>
            <h3 className='mt-1 font-poppins text-2xl font-semibold text-slate-900'>{section.title}</h3>
            <p className='mt-1 text-slate-600'>{section.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className='shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium hover:bg-slate-200'
          >
            Esc ✕
          </button>
        </div>
        <div className='mt-4 flex flex-wrap gap-3'>
          {section.link &&
            (external ? (
              <a href={section.link} target='_blank' rel='noopener noreferrer' className='btn !w-auto'>
                Visit →
              </a>
            ) : (
              <Link to={section.link} className='btn !w-auto'>
                Open →
              </Link>
            ))}
          <button onClick={onOverview} className='rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200'>
            See everything in {building.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
