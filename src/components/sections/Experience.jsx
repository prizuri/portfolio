import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

export default function Experience() {
  const { lang } = useLang();
  const { experience } = useContent();
  const sorted = [...experience].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  if (!sorted.length) return null;

  return (
    <section id="experience" className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="Experience" id="Pengalaman" /></h2>
        </motion.div>

        <div className="timeline">
          {sorted.map((exp, i) => {
            const title = lang === 'id' && exp.title_id ? exp.title_id : exp.title;
            const desc  = lang === 'id' && exp.desc_id  ? exp.desc_id  : exp.desc;
            return (
              <motion.div
                key={exp.id}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="timeline-dot">{exp.icon || '●'}</div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <div className="timeline-title">{title}</div>
                      <div className="timeline-sub">{exp.company}</div>
                    </div>
                    <div className="timeline-date">
                      {exp.year_start}–{exp.year_end || (lang === 'id' ? 'Skrg' : 'Now')}
                    </div>
                  </div>
                  {desc && <p className="timeline-desc" style={{ marginTop: 10 }}>{desc}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
