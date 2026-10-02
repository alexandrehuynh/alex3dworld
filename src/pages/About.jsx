import { Link } from "react-router-dom";

import { CTA } from "../components";
import { skills } from "../constants";
import { RESUME_URL, headline, salesSkills, toolkit, tracks } from "../constants/career";

const TOOL_ICONS = import.meta.glob("../assets/icons/tools/*.svg", { eager: true, import: "default" });
const toolIcon = (key) => TOOL_ICONS[`../assets/icons/tools/${key}.svg`];

const About = () => {
  const [sales, ...pastTracks] = tracks;

  return (
    <section className='max-container'>
      <p className='font-poppins text-sm font-semibold uppercase tracking-widest text-purple-600'>{headline.role}</p>
      <h1 className='head-text mt-2'>
        Hi, I'm{" "}
        <span className='blue-gradient_text font-semibold drop-shadow'>Alex</span> 👋
      </h1>
      <p className='mt-2 font-medium text-slate-700'>{headline.current}</p>

      <p className='mt-5 max-w-3xl text-lg leading-relaxed text-slate-600'>{headline.summary}</p>

      <div className='mt-6 flex flex-wrap gap-3'>
        <Link to='/experience' className='btn !w-auto'>
          See my sales results
        </Link>
        <a href={RESUME_URL} target='_blank' rel='noopener noreferrer' className='rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50'>
          Download résumé (PDF)
        </a>
      </div>

      {/* headline numbers from the sales track */}
      <div className='mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {sales.stats.map((s) => (
          <div key={s.label} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='font-poppins text-3xl font-bold text-purple-600'>{s.value}</p>
            <p className='mt-1 text-sm text-slate-500'>{s.label}</p>
          </div>
        ))}
      </div>

      <div className='mt-16'>
        <h3 className='subhead-text'>What I do</h3>
        <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-5'>
          {salesSkills.map((s) => (
            <span key={s} className='flex items-center justify-center rounded-full bg-purple-50 px-3 py-2 text-center text-sm font-medium text-purple-800 ring-1 ring-purple-200'>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className='mt-16'>
        <h3 className='subhead-text'>How I got here</h3>
        {/* the path, in order */}
        <ol className='mt-6 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700'>
          {[
            ["💻", "Engineering", "2015–2020"],
            ["🏋️", "Fitness coaching + customer service", "2020–2025"],
            ["📈", "Sales & GTM", "2025–now"],
          ].map(([e, l, d], i) => (
            <li key={l} className='flex items-center gap-2'>
              {i > 0 && <span className='text-slate-300'>→</span>}
              <span className='rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200'>
                {e} {l} <span className='text-slate-400'>· {d}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className='mt-5 max-w-3xl text-slate-500'>
          I started in engineering, then left to chase strength and conditioning: an unpaid internship and
          my CSCS, with restaurant shifts paying the rent, then five years coaching at gyms. Sales is where
          I'm building my career now, and everything before it is why I'm good at it: I can talk shop with
          engineers, I learned trust and retention on the gym floor, and I learned to read a room waiting
          tables.
        </p>
        <div className='mt-6 grid gap-4 sm:grid-cols-3'>
          {pastTracks.map((t) => (
            <Link
              key={t.id}
              to={`/experience/${t.id}`}
              className='group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
              style={{ borderTop: `4px solid ${t.accent}` }}
            >
              <p className='text-2xl'>{t.emoji}</p>
              <p className='mt-2 font-poppins font-semibold text-slate-900'>{t.label}</p>
              <p className='mt-1 text-sm text-slate-500'>{t.blurb}</p>
              <p className='mt-3 text-sm font-semibold' style={{ color: t.accent }}>
                See more →
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className='py-16'>
        <h3 className='subhead-text'>Toolkit</h3>
        <div className='mt-8 flex flex-col gap-10'>
          {toolkit.map((group) => (
            <div key={group.title}>
              <p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>
                {group.title}
                {group.note && <span className='ml-2 font-normal normal-case tracking-normal text-slate-400'>· {group.note}</span>}
              </p>
              <div className='mt-4 flex flex-wrap gap-3'>
                {group.tools?.map((t) => (
                  <div key={t.name} className='flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white shadow-sm'>
                    {t.icon ? (
                      <img src={toolIcon(t.icon)} alt='' className='h-8 w-8 object-contain' />
                    ) : (
                      <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-poppins text-sm font-bold text-white'>
                        {t.name[0]}
                      </span>
                    )}
                    <span className='text-xs font-medium text-slate-700'>{t.name}</span>
                  </div>
                ))}
                {group.skills &&
                  skills
                    .filter((sk) => group.skills.includes(sk.name))
                    .map((sk) => (
                      <div key={sk.name} className='flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white' title={sk.name}>
                        <img src={sk.imageUrl} alt={sk.name} className='h-7 w-7 object-contain' />
                        <span className='text-[10px] text-slate-500'>{sk.name}</span>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className='border-slate-200' />
      <CTA />
    </section>
  );
};

export default About;
