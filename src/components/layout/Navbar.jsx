import { useState, useEffect, useCallback } from 'react';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const LINKS = [
  { section: 'about',      en: 'About',       id: 'Tentang' },
  { section: 'projects',   en: 'Projects',    id: 'Proyek' },
  { section: 'experience', en: 'Experience',  id: 'Pengalaman' },
  { section: 'skills',     en: 'Skills',      id: 'Keahlian' },
  { section: 'education',  en: 'Education',   id: 'Pendidikan' },
  { section: 'contact',    en: 'Contact',     id: 'Kontak' },
];

export default function Navbar() {
  const { lang, toggle, idEnabled } = useLang();
  const { isSectionVisible } = useContent();
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = useCallback(id => {
    scrollTo(id);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 100;
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => {
        if (s.offsetTop <= scrollY) setActive(s.id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visibleLinks = LINKS.filter(l => isSectionVisible(l.section));

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <button className="nav-logo" onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            PH<span className="accent">.</span>
          </button>
          <div className="nav-links">
            {visibleLinks.map(l => (
              <button
                key={l.section}
                className={`nav-link${active === l.section ? ' active' : ''}`}
                onClick={() => handleNav(l.section)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {lang === 'id' ? l.id : l.en}
              </button>
            ))}
            {idEnabled && (
              <button className="lang-toggle" onClick={toggle}>
                {lang === 'en' ? 'ID' : 'EN'}
              </button>
            )}
          </div>
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
          {visibleLinks.map(l => (
            <button
              key={l.section}
              className="nav-link"
              onClick={() => handleNav(l.section)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              {lang === 'id' ? l.id : l.en}
            </button>
          ))}
          {idEnabled && (
            <button className="lang-toggle" onClick={e => { e.stopPropagation(); toggle(); }}>
              {lang === 'en' ? 'Bahasa Indonesia' : 'English'}
            </button>
          )}
        </div>
      )}
    </>
  );
}
