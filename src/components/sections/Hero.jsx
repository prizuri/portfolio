import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { lang } = useLang();
  return (
    <section id="hero" className="hero">
      <div className="container">
        <motion.div {...fadeUp(0)}>
          <div className="hero-badge">
            <T en="Available for Opportunities" id="Terbuka untuk Peluang Baru" />
          </div>
        </motion.div>
        <motion.h1 className="hero-title" {...fadeUp(0.08)}>
          Prizuri <span className="accent">Hartadi</span>
        </motion.h1>
        <motion.p className="hero-role" {...fadeUp(0.14)}>
          <T en="Structural Engineer & Developer" id="Insinyur Struktur & Developer" />
        </motion.p>
        <motion.p className="hero-desc" {...fadeUp(0.2)}>
          <T
            en="Building reliable structures and digital solutions. Combining engineering precision with modern technology to create impactful work."
            id="Membangun struktur yang andal dan solusi digital. Memadukan presisi rekayasa dengan teknologi modern untuk menghasilkan karya yang berdampak."
          />
        </motion.p>
        <motion.div className="hero-cta" {...fadeUp(0.26)}>
          <a href="#projects" className="btn btn-primary">
            <T en="View Projects" id="Lihat Proyek" />
          </a>
          <a href="#contact" className="btn btn-outline">
            <T en="Get in Touch" id="Hubungi Saya" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
