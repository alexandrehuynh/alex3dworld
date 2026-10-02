import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { logo } from "../assets/images";

// Home's world listens for this to walk you back out to the plaza
export const GO_HOME_EVENT = "portfolio:home";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition ${
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
      <a href='#/' onClick={goHome} className='nav-pill pr-4' aria-label='Home'>
        <img src={logo} alt='' className='h-8 w-8 rounded-full object-contain' />
        <span className='font-poppins text-sm font-semibold text-slate-800'>Alex Huynh</span>
      </a>
      <nav className='nav-pill'>
        <NavLink to='/about' className={linkClass}>
          About
        </NavLink>
        <NavLink to='/projects' className={linkClass}>
          Projects
        </NavLink>
        <NavLink to='/contact' className={linkClass}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
