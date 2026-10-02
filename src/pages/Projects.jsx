import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";

const Projects = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        My{" "}
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Projects
        </span>
      </h1>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Most of what I build sits where software meets health and fitness:
        computer vision that coaches your form, AI that makes sense of workout
        data, and tools that help people get care. Most of these are open
        source, so feel free to dig into the code.
      </p>

      <div className='flex flex-wrap my-20 gap-16'>
        {projects.map((project) => (
          <div className='lg:w-[400px] w-full' key={project.name}>
            <div className='block-container w-12 h-12'>
              <div className={`btn-back rounded-xl ${project.theme}`} />
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src={project.iconUrl}
                  alt={project.name}
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>

            <div className='mt-5 flex flex-col'>
              <h4 className='text-2xl font-poppins font-semibold'>
                {project.name}
              </h4>
              <p className='mt-2 text-slate-500'>{project.description}</p>
              <div className='mt-5 flex items-center gap-6 font-poppins'>
                {project.link && (
                  <a
                    href={project.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 font-semibold text-blue-600'
                  >
                    Live Demo
                    <img src={arrow} alt='' className='w-4 h-4 object-contain' />
                  </a>
                )}
                {project.codeLink && (
                  <a
                    href={project.codeLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 font-semibold text-slate-600'
                  >
                    Code
                    <img src={arrow} alt='' className='w-4 h-4 object-contain' />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default Projects;