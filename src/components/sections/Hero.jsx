import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const { lang } = useLang();
  const { projects, experience, about } = useContent();

  const stats = [
    { val: experience.length || '2+', label: lang === 'id' ? 'Tahun Pengalaman' : 'Years Experience' },
    { val: projects.length || '10+', label: lang === 'id' ? 'Proyek Selesai' : 'Projects Completed' },
    { val: 'S2', label: lang === 'id' ? 'Magister Teknik Sipil' : 'Master Civil Engineering' },
  ];

  const status = lang === 'id' ? about?.status_id : about?.status_en;
  const isOpen = status?.toLowerCase().includes('open') || status?.toLowerCase().includes('terbuka');

  return (
    <section id="hero" className="hero">
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {status && (
          <motion.div variants={itemVariants}>
            <div className={`hero-badge${!isOpen ? ' hero-badge-alt' : ''}`}>
              {status}
            </div>
          </motion.div>
        )}

        <motion.h1 className="hero-title" variants={itemVariants}>
          {about?.full_name?.split(' ')[0] || 'Prizuri'}{' '}
          <span className="accent">{about?.full_name?.split(' ').slice(1).join(' ') || 'Hartadi'}</span>
        </motion.h1>

        <motion.p className="hero-role" variants={itemVariants}>
          {lang === 'id' ? about?.role_id : about?.role_en}
        </motion.p>

        <motion.p className="hero-desc" variants={itemVariants}>
          {lang === 'id' ? about?.hero_desc_id : about?.hero_desc_en}
        </motion.p>

        <motion.div className="hero-cta" variants={itemVariants}>
          <button className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            {lang === 'id' ? about?.hero_cta1_id : about?.hero_cta1_en}
          </button>
          <button className="btn btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            {lang === 'id' ? about?.hero_cta2_id : about?.hero_cta2_en}
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          variants={itemVariants}
        >
          {stats.map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-val">{s.val}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
