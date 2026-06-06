import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { lang } = useLang();
  const { projects, experience } = useContent();

  const stats = [
    { val: experience.length || '2+', label: lang === 'id' ? 'Tahun Pengalaman' : 'Years Experience' },
    { val: projects.length || '10+', label: lang === 'id' ? 'Proyek Selesai' : 'Projects Completed' },
    { val: 'S2', label: lang === 'id' ? 'Magister Teknik Sipil' : 'Master Civil Engineering' },
  ];

  return (
    <section id="hero" className="hero">
      <div className="container">
        <motion.div {...fadeUp(0)}>
          <div className="hero-badge">
            <T en="Open to New Opportunities" id="Terbuka untuk Peluang Baru" />
          </div>
        </motion.div>

        <motion.h1 className="hero-title" {...fadeUp(0.08)}>
          Prizuri{' '}
          <span className="accent">Hartadi</span>
        </motion.h1>

        <motion.p className="hero-role" {...fadeUp(0.16)}>
          <T en="Structural Engineer & Developer" id="Insinyur Struktur & Developer" />
        </motion.p>

        <motion.p className="hero-desc" {...fadeUp(0.22)}>
          <T
            en="Building reliable structures and digital solutions. Combining engineering precision with modern technology to deliver impactful results."
            id="Membangun struktur yang andal dan solusi digital. Memadukan presisi rekayasa dengan teknologi modern untuk menghasilkan karya yang berdampak."
          />
        </motion.p>

        <motion.div className="hero-cta" {...fadeUp(0.28)}>
          <a href="#projects" className="btn btn-primary">
            <T en="View Projects" id="Lihat Proyek" />
          </a>
          <a href="#contact" className="btn btn-outline">
            <T en="Get in Touch" id="Hubungi Saya" />
          </a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-val">{s.val}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
