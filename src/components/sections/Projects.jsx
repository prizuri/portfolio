import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';
import ProjectCard from '../ui/ProjectCard';

export default function Projects() {
  const { lang } = useLang();
  const { projects, getSectionConfig } = useContent();
  const [filter, setFilter] = useState('All');
  const config = getSectionConfig('projects');
  const title = lang === 'id' ? config.title_id : config.title_en;

  const sorted = useMemo(() =>
    [...projects].filter(p => !p.hidden).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
  [projects]);

  const categories = useMemo(() => {
    const cats = [...new Set(sorted.map(p => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [sorted]);

  const visible = filter === 'All' ? sorted : sorted.filter(p => p.category === filter);
  const [featured, ...rest] = visible;

  if (!sorted.length) return null;

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title">{title || (lang === 'id' ? 'Proyek' : 'Projects')}</h2>
          <p className="section-sub">
            <T en="Selected professional, research, and personal projects" id="Karya pilihan dan studi kasus" />
          </p>
        </motion.div>

        {categories.length > 2 && (
          <div className="projects-filter">
            {categories.map(c => (
              <button
                key={c}
                className={`filter-chip${filter === c ? ' active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <motion.div 
          className="project-grid cols-3"
          layout
        >
          <AnimatePresence>
            {visible.map((p, i) => (
              <ProjectCard 
                key={p.id} 
                project={p} 
                index={i} 
                featured={filter !== 'All' ? false : (i === 0 && rest.length === 0)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
