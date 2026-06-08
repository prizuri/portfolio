import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';
import { googleDriveEmbedUrl, imageUrls, isGoogleDriveFileUrl } from '../../utils/url';
import Lightbox from '../ui/Lightbox';


function SmartTimelineImage({ src, alt }) {
  const candidates = useMemo(() => imageUrls(src), [src]);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const driveEmbed = isGoogleDriveFileUrl(src) ? googleDriveEmbedUrl(src) : '';

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [src]);

  if (!src) {
    return (
      <div className="timeline-img timeline-img-placeholder">
        <span>Image not available</span>
      </div>
    );
  }

  if (failed) {
    if (driveEmbed) {
      return (
        <iframe
          className="timeline-img timeline-drive-frame"
          src={driveEmbed}
          title={alt || 'Experience image'}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <div className="timeline-img timeline-img-placeholder">
        <span>Image could not be loaded</span>
      </div>
    );
  }

  if (!candidates.length) {
    setFailed(true);
    return null;
  }

  return (
    <motion.img
      key={`${src}-${idx}`}
      className="timeline-img"
      src={candidates[idx]}
      alt={alt || ''}
      loading="lazy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onError={() => {
        if (idx < candidates.length - 1) {
          setIdx(idx + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

function TimelineItem({ exp, index, lang }) {
  const title = lang === 'id' && exp.title_id ? exp.title_id : exp.title;
  const desc  = lang === 'id' && exp.desc_id  ? exp.desc_id  : exp.desc;
  const images = exp.images?.filter(Boolean) || [];
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

  function openLightbox() {
    if (!images.length) return;
    setLightbox(imgIdx);
  }

  return (
    <>
      <motion.div
        className="timeline-item"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
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
          {images.length > 0 && (
            <div className="timeline-img-wrap clickable" onClick={openLightbox}>
              <AnimatePresence mode="wait">
                <SmartTimelineImage
                  key={`${images[imgIdx]}-${imgIdx}`}
                  src={images[imgIdx]}
                  alt={title}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <span className="timeline-img-counter">{imgIdx + 1}/{images.length}</span>
              )}
            </div>
          )}
          {desc && <p className="timeline-desc" style={{ marginTop: images.length ? 12 : 10 }}>{desc}</p>}
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

export default function Experience() {
  const { lang } = useLang();
  const { experience, getSectionConfig } = useContent();
  const sorted = [...experience].filter(e => !e.hidden).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const config = getSectionConfig('experience');
  const title = lang === 'id' ? config.title_id : config.title_en;

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
          <h2 className="section-title">{title || (lang === 'id' ? 'Pengalaman' : 'Experience')}</h2>
        </motion.div>

        <div className="timeline">
          {sorted.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}