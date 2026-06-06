import { motion } from 'framer-motion';
import { useLang } from '../../contexts/LangContext';
import { imageUrl } from '../../utils/url';

export default function ProjectCard({ project: p, index = 0, featured = false }) {
  const { lang } = useLang();
  const title = lang === 'id' && p.title_id ? p.title_id : p.title;
  const desc  = lang === 'id' && p.desc_id  ? p.desc_id  : p.desc;

  return (
    <motion.div
      className={`project-card${featured ? ' featured' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {p.image_url && (
        <img className="project-img" src={imageUrl(p.image_url)} alt={title} loading="lazy" />
      )}
      <div className="project-body">
        <div className="project-meta">
          {p.category && <span className="project-cat">{p.category}</span>}
          {p.status    && <span className="project-status">{p.status}</span>}
        </div>
        <h3 className="project-title">{title}</h3>
        {desc && <p className="project-desc">{desc}</p>}
        {p.tags?.length > 0 && (
          <div className="project-tags">
            {p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
          </div>
        )}
        <div className="project-cta">
          {p.demo_url && (
            <a className="btn btn-primary btn-sm" href={p.demo_url} target="_blank" rel="noopener noreferrer">
              {lang === 'id' ? 'Demo Langsung' : 'Live Demo'}
            </a>
          )}
          {p.github_url && (
            <a className="btn btn-outline btn-sm" href={p.github_url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
