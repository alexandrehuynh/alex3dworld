import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className='cta'>
      <p className='cta-text'>
        Hiring for sales or GTM? <br className='sm:block hidden' />
        Let’s talk.
      </p>
      <Link to="/contact" className='btn'>
        Contact
      </Link>
    </section>
  );
};

export default CTA;