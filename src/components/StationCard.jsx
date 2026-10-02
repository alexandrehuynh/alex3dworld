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
        className='w-full max-w-lg max-h-[70vh] overflow-y-auto rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur'
        style={{ borderTop: `6px solid ${building.accent}` }}
      >
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>
              {building.emoji} {building.name}
            </p>
            <h3 className='mt-1 font-poppins text-2xl font-semibold text-slate-900'>{section.title}</h3>
            {section.role && <p className='mt-1 font-medium text-slate-700'>{section.role}</p>}
            {(section.dates || section.place) && (
              <p className='text-sm text-slate-500'>
                {[section.dates, section.place].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className='shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium hover:bg-slate-200'
          >
            Esc ✕
          </button>
        </div>
        {section.points && (
          <ul className='mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600'>
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}

        {section.flyers && (
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {section.flyers.map((flyer, i) => (
              <div
                key={flyer.title}
                className='p-3 shadow-md'
                style={{ background: flyer.color, rotate: `${(i - 1) * 1.5}deg` }}
              >
                <p className='font-poppins font-semibold text-slate-900'>{flyer.title}</p>
                <p className='text-sm text-slate-700'>{flyer.role}</p>
                <p className='mt-1 text-xs text-slate-600'>{flyer.dates}</p>
                {flyer.note && <p className='mt-2 text-xs text-slate-700'>{flyer.note}</p>}
              </div>
            ))}
          </div>
        )}

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
