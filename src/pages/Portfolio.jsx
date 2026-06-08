import { motion, useScroll, useSpring } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Education from '../components/sections/Education';
import Hobbies from '../components/sections/Hobbies';
import Publications from '../components/sections/Publications';
import Contact from '../components/sections/Contact';

export default function Portfolio() {
  const { isSectionVisible } = useContent();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--accent)',
          transformOrigin: '0%',
          zIndex: 1001
        }}
      />
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <Hero />
        {isSectionVisible('about')        && <About />}
        {isSectionVisible('projects')     && <Projects />}
        {isSectionVisible('experience')   && <Experience />}
        {isSectionVisible('skills')       && <Skills />}
        {isSectionVisible('education')    && <Education />}
        {isSectionVisible('hobbies')      && <Hobbies />}
        {isSectionVisible('publications') && <Publications />}
        {isSectionVisible('contact')      && <Contact />}
        <footer className="footer">
          <div className="container">
            © {new Date().getFullYear()} Prizuri Hartadi. All rights reserved.
          </div>
        </footer>

        {/* Back to Top Button */}
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>
    </>
  );
}
