import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../contexts/LangContext';
import { imageUrl } from '../../utils/url';
import Lightbox from './Lightbox';

export default function ProjectCard({ project: p, index = 0, featured = false }) {
  const { lang } = useLang();
  const title = lang === 'id' && p.title_id ? p.title_id : p.title;
  const desc  = lang === 'id' && p.desc_id  ? p.desc_id  : p.desc;
  const images = p.images?.filter(Boolean) || (p.image_url ? [p.image_url] : []);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length < 2) return;
    timerRef.current = setInterval(() => {
      setImgIdx(i => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  function openLightbox(e) {
    e.stopPropagation();
    setLightbox(imgIdx);
  }

  return (
    <>
      <motion.div
        className={`project-card${featured ? ' featured' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
      >
        {images.length > 0 && (
          <div className="project-img-wrap clickable" onClick={openLightbox}>
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                className="project-img"
                src={imageUrl(images[imgIdx])}
                alt={title}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <span className="timeline-img-counter">{imgIdx + 1}/{images.length}</span>
            )}
          </div>
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

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            onClose={(next, cycle) => {
              if (cycle) {
                const n = ((next % images.length) + images.length) % images.length;
                setLightbox(n);
              } else {
                setLightbox(null);
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}