import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../contexts/LangContext';
import { imageUrl, mediaKind, mediaUrl } from '../../utils/url';
import Lightbox from './Lightbox';

function uniqueUrls(urls) {
  const seen = new Set();
  return urls
    .map(url => (typeof url === 'string' ? url.trim() : ''))
    .filter(Boolean)
    .filter(url => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

export default function ProjectCard({ project: p, index = 0, featured = false }) {
  const { lang } = useLang();
  const title = lang === 'id' && p.title_id ? p.title_id : p.title;
  const desc  = lang === 'id' && p.desc_id  ? p.desc_id  : p.desc;
  const [lightbox, setLightbox] = useState(null);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const cover = p.cover_image_url || p.image_url || p.images?.[0] || '';
  const galleryImages = useMemo(() => uniqueUrls([cover, ...(p.images || [])]), [cover, p.images]);
  const previewUrl = p.preview_media_url || '';
  const previewKind = mediaKind(previewUrl, p.preview_media_type || 'auto');
  const hasPreview = Boolean(previewUrl);

  function openLightbox(e) {
    e.stopPropagation();
    if (galleryImages.length > 0) setLightbox(0);
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        layout
        className={`project-card${featured ? ' featured' : ''}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.18) }}
      >
        {galleryImages.length > 0 && (
          <div className="project-img-wrap clickable" onClick={openLightbox}>
            <img
              className="project-img"
              src={imageUrl(cover)}
              alt={title}
              loading="lazy"
            />

            {hasPreview && hovered && (
              <motion.div
                className="project-preview-layer show"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {previewKind === 'video' ? (
                  <video
                    className="project-img project-preview-media"
                    src={mediaUrl(previewUrl, 'video')}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                ) : (
                  <img
                    className="project-img project-preview-media"
                    src={mediaUrl(previewUrl, 'image')}
                    alt=""
                    loading="lazy"
                  />
                )}
              </motion.div>
            )}

            {hasPreview && (
              <span className="project-preview-badge">
                {previewKind === 'video'
                  ? (lang === 'id' ? 'Preview Video' : 'Video Preview')
                  : (lang === 'id' ? 'Preview GIF/Gambar' : 'GIF/Image Preview')}
              </span>
            )}

            {galleryImages.length > 1 && (
              <span className="timeline-img-counter">1/{galleryImages.length}</span>
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
            images={galleryImages}
            index={lightbox}
            onClose={(next, cycle) => {
              if (cycle) {
                const n = ((next % galleryImages.length) + galleryImages.length) % galleryImages.length;
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
