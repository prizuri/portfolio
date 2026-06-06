import { useState, useEffect } from 'react';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

const LINKS = [
  { href: '#about',        en: 'About',       id: 'Tentang' },
  { href: '#projects',     en: 'Projects',    id: 'Proyek' },
  { href: '#experience',   en: 'Experience',  id: 'Pengalaman' },
  { href: '#skills',       en: 'Skills',      id: 'Keahlian' },
  { href: '#education',    en: 'Education',   id: 'Pendidikan' },
  { href: '#contact',      en: 'Contact',     id: 'Kontak' },
];

export default function Navbar() {
  const { lang, toggle, idEnabled } = useLang();
  const { isSectionVisible } = useContent();
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const visibleLinks = LINKS.filter(l => {
    const id = l.href.slice(1);
    return isSectionVisible(id);
  });

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <a href="#hero" className="nav-logo">PH<span className="accent">.</span></a>
          <div className="nav-links">
            {visibleLinks.map(l => (
              <a key={l.href} href={l.href} className={`nav-link${active === l.href.slice(1) ? ' active' : ''}`}>
                {lang === 'id' ? l.id : l.en}
              </a>
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
            <a key={l.href} href={l.href} className="nav-link">{lang === 'id' ? l.id : l.en}</a>
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
