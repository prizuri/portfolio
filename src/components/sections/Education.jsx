import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

export default function Education() {
  const { lang } = useLang();
  const { education } = useContent();
  const sorted = [...education].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  if (!sorted.length) return null;

  return (
    <section id="education" className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="Education" id="Pendidikan" /></h2>
        </motion.div>

        <div className="timeline">
          {sorted.map((edu, i) => {
            const degree = lang === 'id' && edu.degree_id ? edu.degree_id : edu.degree_en;
            const thesis = lang === 'id' && edu.thesis_id ? edu.thesis_id : edu.thesis_en;
            return (
              <motion.div
                key={edu.id}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="timeline-dot">{edu.icon || '🎓'}</div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <div className="timeline-title">{degree}</div>
                      <div className="timeline-sub">{edu.university}</div>
                    </div>
                    <div className="timeline-date">{edu.year_start}–{edu.year_end}</div>
                  </div>
                  {edu.gpa && (
                    <div className="timeline-gpa">
                      GPA: <strong style={{ color: 'var(--text-1)' }}>{edu.gpa}</strong>
                    </div>
                  )}
                  {thesis && (
                    <p className="timeline-desc" style={{ marginTop: 10, fontStyle: 'italic' }}>
                      &ldquo;{thesis}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
