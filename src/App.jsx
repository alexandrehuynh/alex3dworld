import { lazy, Suspense } from "react";
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";

import { Footer, NavBar } from "./components";
import { About } from "./pages";
import Experience from "./pages/Experience";

// The 3D pages pull in three.js and the Rapier physics engine, so load them on demand
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));

const App = () => {
  return (
    <main className='bg-slate-300/20'>
      <Router>
        <NavBar />
        <Suspense fallback={null}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/*'
              element={
                <>
                  <Routes>
                    <Route path='/about' element={<About />} />
                    <Route path='/experience' element={<Experience />} />
                    <Route path='/experience/:track' element={<Experience />} />
                    {/* old link */}
                    <Route path='/projects' element={<Navigate to='/experience/engineering' replace />} />
                    <Route path='/contact' element={<Contact />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </main>
  );
};

export default App;