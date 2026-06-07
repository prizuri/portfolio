import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';
import ProjectCard from '../ui/ProjectCard';

export default function Hobbies() {
  const { lang } = useLang();
  const { hobbies, getSectionConfig } = useContent();
  const sorted = [...hobbies].filter(h => !h.hidden).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const layout = getSectionConfig('hobbies')?.layout || 'chip';

  if (!sorted.length) return null;

  return (
    <section id="hobbies" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="Hobbies & Interests" id="Hobi & Minat" /></h2>
        </motion.div>

        {layout === 'project-card' ? (
          <div className="project-grid cols-3">
            {sorted.map((h, i) => (
              <ProjectCard key={h.id} project={h} index={i} />
            ))}
          </div>
        ) : (
          <div className="hobby-chips">
            {sorted.map((h, i) => (
              <motion.div
                key={h.id}
                className="hobby-chip"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                {h.icon && <span className="hobby-icon">{h.icon}</span>}
                <span className="hobby-name">
                  {lang === 'id' && h.name_id ? h.name_id : h.name_en}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
