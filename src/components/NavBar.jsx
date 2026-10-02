import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { logo } from "../assets/images";
import { RESUME_URL } from "../constants/career";

// Home's world listens for this to walk you back out to the plaza
export const GO_HOME_EVENT = "portfolio:home";

const linkClass = ({ isActive }) =>
  `rounded-full px-2.5 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white" : "text-slate-800 hover:bg-white"
  }`;

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goHome = (e) => {
    e.preventDefault();
    if (pathname === "/") window.dispatchEvent(new Event(GO_HOME_EVENT));
    else navigate("/");
  };

  return (
    <header className='header'>
      <a href='#/' onClick={goHome} className='nav-pill sm:pr-4' aria-label='Home'>
        <img src={logo} alt='' className='h-8 w-8 rounded-full object-contain' />
        <span className='hidden font-poppins text-sm font-semibold text-slate-800 sm:inline'>Alex Huynh</span>
      </a>
      <nav className='nav-pill'>
        <NavLink to='/about' className={linkClass}>
          About
        </NavLink>
        <NavLink to='/experience' className={linkClass}>
          Experience
        </NavLink>
        <NavLink to='/contact' className={linkClass}>
          Contact
        </NavLink>
        <a href={RESUME_URL} target='_blank' rel='noopener noreferrer' className='rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 sm:px-4 sm:py-1.5 sm:text-sm'>
          Résumé
        </a>
      </nav>
    </header>
  );
};

export default NavBar;
