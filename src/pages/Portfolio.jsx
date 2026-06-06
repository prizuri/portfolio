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

  return (
    <>
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
      </div>
    </>
  );
}
