import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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

function Counter({ value, format = (v) => Math.round(v) }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, format);

  useEffect(() => {
    const animation = animate(count, value, { duration: 2, ease: 'easeOut', delay: 0.8 });
    return () => animation.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Hero() {
  const { lang } = useLang();
  const { projects, experience, about } = useContent();

  const totalValue = projects.reduce((acc, p) => acc + (Number(p.project_value) || 0), 0);

  function formatApprox(v) {
    if (v === 0) return '0';
    const isID = lang === 'id';

    if (v >= 1e12) {
      return (v / 1e12).toFixed(0) + (isID ? 'T+' : 'T+'); // Trillion is T in both
    }
    if (v >= 1e9) {
      return (v / 1e9).toFixed(0) + (isID ? 'M+' : 'B+'); // Miliar vs Billion
    }
    if (v >= 1e6) {
      return (v / 1e6).toFixed(0) + (isID ? 'Jt+' : 'M+'); // Juta vs Million
    }
    return v.toLocaleString(isID ? 'id-ID' : 'en-US');
  }

  const stats = [
    { 
      val: totalValue, 
      label: lang === 'id' ? 'Nilai Proyek Ditangani' : 'Total Project Value', 
      format: formatApprox,
      prefix: 'IDR ' 
    },
    { 
      val: experience.length, 
      label: lang === 'id' ? 'Total Pengalaman' : 'Total Experiences' 
    },
    { 
      val: Number(about?.years_exp) || 1, 
      label: lang === 'id' ? 'Tahun Pengalaman' : 'Years Experience', 
      suffix: '+' 
    },
  ];


  const status = lang === 'id' ? about?.status_id : about?.status_en;
  const allowedStatusColors = ['green', 'blue', 'none'];
  const statusColor = allowedStatusColors.includes(about?.status_color) ? about.status_color : 'green';

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
            <div className={`hero-badge hero-badge-${statusColor}`}>
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
          <button type="button" className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            {lang === 'id' ? about?.hero_cta1_id : about?.hero_cta1_en}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            {lang === 'id' ? about?.hero_cta2_id : about?.hero_cta2_en}
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          variants={itemVariants}
        >
          {stats.map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-val">
                {s.prefix && <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginRight: '4px', fontWeight: 600 }}>{s.prefix}</span>}
                <Counter value={s.val} format={s.format} />
                {s.suffix && <span>{s.suffix}</span>}
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
