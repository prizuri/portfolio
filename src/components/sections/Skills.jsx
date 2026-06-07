import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

export default function Skills() {
  const { lang } = useLang();
  const { skills } = useContent();

  const grouped = useMemo(() => {
    const map = {};
    [...skills].filter(s => !s.hidden).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).forEach(s => {
      const cat = s.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return Object.entries(map);
  }, [skills]);

  if (!skills.length) return null;

  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="Skills" id="Keahlian" /></h2>
        </motion.div>

        <div className="skills-grid" style={{ maxWidth: 760, margin: '0 auto' }}>
          {grouped.map(([cat, items], gi) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: gi * 0.08 }}
            >
              <div className="skill-group-title">{cat}</div>
              <div className="skill-chips">
                {items.map((s, i) => (
                  <motion.span
                    key={s.id}
                    className="skill-chip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: gi * 0.06 + i * 0.04 }}
                  >
                    {lang === 'id' && s.name_id ? s.name_id : s.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
