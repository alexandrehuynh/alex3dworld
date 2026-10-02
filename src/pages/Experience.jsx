import { Link, NavLink, Navigate, useParams } from "react-router-dom";

import { CTA } from "../components";
import { projects } from "../constants";
import { tracks } from "../constants/career";
import { arrow } from "../assets/icons";

const Stat = ({ value, label, accent }) => (
  <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
    <p className='font-poppins text-3xl font-bold' style={{ color: accent }}>
      {value}
    </p>
    <p className='mt-1 text-sm text-slate-500'>{label}</p>
  </div>
);

const Role = ({ section, accent }) => {
  if (section.flyers)
    return (
      <div className='grid gap-4 sm:grid-cols-3'>
        {section.flyers.map((f) => (
          <div key={f.title} className='rounded-xl border border-slate-200 bg-white p-4'>
            <p className='font-poppins font-semibold text-slate-900'>{f.title}</p>
            <p className='text-sm text-slate-600'>{f.role}</p>
            <p className='mt-1 text-xs text-slate-400'>{f.dates}</p>
            {f.note && <p className='mt-2 text-sm text-slate-600'>{f.note}</p>}
          </div>
        ))}
      </div>
    );

  return (
    <div className='relative border-l-2 pl-6' style={{ borderColor: accent }}>
      <span className='absolute -left-[7px] top-1.5 h-3 w-3 rounded-full' style={{ background: accent }} />
      <div className='flex flex-wrap items-baseline justify-between gap-x-4'>
        <h3 className='font-poppins text-xl font-semibold text-slate-900'>{section.title}</h3>
        {(section.dates || section.place) && (
          <p className='text-sm text-slate-400'>{[section.dates, section.place].filter(Boolean).join(" · ")}</p>
        )}
      </div>
      {section.role && <p className='font-medium text-slate-600'>{section.role}</p>}
      {section.points && (
        <ul className='mt-3 list-disc space-y-1.5 pl-5 text-slate-600'>
          {section.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {section.link && section.link.startsWith("http") && (
        <a href={section.link} target='_blank' rel='noopener noreferrer' className='mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600'>
          Visit <img src={arrow} alt='' className='h-3 w-3' />
        </a>
      )}
    </div>
  );
};

const Projects = () => (
  <div className='mt-14'>
    <h2 className='subhead-text'>Projects & hackathons</h2>
    <div className='mt-6 grid gap-6 sm:grid-cols-2'>
      {projects.map((p) => (
        <div key={p.name} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className={`block-container h-10 w-10`}>
              <div className={`btn-back rounded-lg ${p.theme}`} />
              <div className='btn-front flex items-center justify-center rounded-lg'>
                <img src={p.iconUrl} alt='' className='h-1/2 w-1/2 object-contain' />
              </div>
            </div>
            <h3 className='font-poppins text-lg font-semibold'>{p.name}</h3>
          </div>
          <p className='mt-3 text-sm text-slate-600'>{p.description}</p>
          <div className='mt-3 flex gap-5 text-sm font-semibold'>
            {p.link && (
              <a href={p.link} target='_blank' rel='noopener noreferrer' className='text-blue-600'>
                Live demo →
              </a>
            )}
            {p.codeLink && (
              <a href={p.codeLink} target='_blank' rel='noopener noreferrer' className='text-slate-600'>
                Code →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Extra = ({ extra, accent }) => (
  <div className='mt-14'>
    <h2 className='subhead-text'>{extra.title}</h2>
    {extra.groups && (
      <div className='mt-6 grid gap-5 sm:grid-cols-2'>
        {extra.groups.map((g) => (
          <div key={g.label}>
            <p className='text-xs font-semibold uppercase tracking-wide text-slate-400'>{g.label}</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {g.chips.map((c) => (
                <span key={c} className='rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700'>
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    {extra.list && (
      <ul className='mt-6 grid gap-3 sm:grid-cols-2'>
        {extra.list.map((c) => (
          <li key={c.name} className='flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4'>
            <span className='mt-1 h-2.5 w-2.5 shrink-0 rounded-full' style={{ background: accent }} />
            <div>
              <p className='font-medium text-slate-900'>{c.name}</p>
              {c.issuer && <p className='text-sm text-slate-500'>{c.issuer}</p>}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Experience = () => {
  const { track: trackId = "sales" } = useParams();
  const track = tracks.find((t) => t.id === trackId);
  if (!track) return <Navigate to='/experience' replace />;

  return (
    <section className='max-container'>
      <h1 className='head-text'>
        <span className='blue-gradient_text drop-shadow font-semibold'>Experience</span>
      </h1>

      {/* Sales is the career; the other tabs are how I got here */}
      <div className='mt-6 flex flex-wrap items-center gap-2'>
        {tracks.map((t, i) => (
          <div key={t.id} className='flex items-center gap-2'>
            {i === 1 && <span className='mx-1 hidden text-xs font-medium uppercase tracking-wide text-slate-400 sm:inline'>How I got here</span>}
            <NavLink
              to={t.id === "sales" ? "/experience" : `/experience/${t.id}`}
              end
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "text-white shadow" : "bg-white text-slate-700 hover:bg-slate-100"
                }`
              }
              style={({ isActive }) => (isActive ? { background: t.accent } : undefined)}
            >
              {t.emoji} {t.label}
            </NavLink>
          </div>
        ))}
      </div>

      <p className='mt-6 max-w-2xl text-slate-500'>{track.blurb}</p>

      <div className='mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {track.stats.map((s) => (
          <Stat key={s.label} {...s} accent={track.accent} />
        ))}
      </div>

      <div className='mt-14 flex flex-col gap-10'>
        {track.sections
          .filter((s) => !s.link || s.link.startsWith("http") || s.points)
          .map((s) => (
            <Role key={s.id} section={s} accent={track.accent} />
          ))}
      </div>

      {track.earlier && (
        <div className='mt-14'>
          <h2 className='subhead-text'>{track.earlier.title}</h2>
          <div className='mt-8 flex flex-col gap-10'>
            {track.earlier.sections.map((s) => (
              <Role key={s.id} section={s} accent={track.accent} />
            ))}
          </div>
        </div>
      )}
      {track.showProjects && <Projects />}
      {track.extra && <Extra extra={track.extra} accent={track.accent} />}

      <p className='mt-14 text-sm text-slate-400'>
        Want to see this in 3D?{" "}
        <Link to='/' className='font-medium text-blue-600'>
          Walk into the {track.label} building →
        </Link>
      </p>

      <hr className='mt-10 border-slate-200' />
      <CTA />
    </section>
  );
};

export default Experience;
