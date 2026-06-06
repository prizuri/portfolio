import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';
import ProjectCard from '../ui/ProjectCard';

export default function Projects() {
  const { lang } = useLang();
  const { projects } = useContent();
  const [filter, setFilter] = useState('All');

  const sorted = useMemo(() =>
    [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
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
          <h2 className="section-title"><T en="Projects" id="Proyek" /></h2>
          <p className="section-sub">
            <T en="Selected work and case studies" id="Karya pilihan dan studi kasus" />
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

        <div className="project-grid cols-3">
          {featured && (
            <ProjectCard project={featured} index={0} featured={rest.length === 0} />
          )}
          {rest.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
