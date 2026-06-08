import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../contexts/LangContext';
import { imageUrl, imageUrls, isDirectVideoUrl, isGoogleDriveFileUrl, mediaKind, mediaUrl } from '../../utils/url';
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

function uniqueMedia(items) {
  const seen = new Set();
  return items
    .filter(item => item?.url)
    .filter(item => {
      const key = `${item.kind || 'image'}:${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function SmartImage({ src, alt, className, loading = 'lazy', onFinalError }) {
  const candidates = useMemo(() => imageUrls(src), [src]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [src]);

  if (!candidates.length) return null;

  return (
    <img
      className={className}
      src={candidates[idx]}
      alt={alt}
      loading={loading}
      onError={() => {
        if (idx < candidates.length - 1) {
          setIdx(idx + 1);
        } else if (onFinalError) {
          onFinalError();
        }
      }}
    />
  );
}

export default function ProjectCard({ project: p, index = 0, featured = false }) {
  const { lang } = useLang();
  const title = lang === 'id' && p.title_id ? p.title_id : p.title;
  const desc  = lang === 'id' && p.desc_id  ? p.desc_id  : p.desc;
  const [lightbox, setLightbox] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const cardRef = useRef(null);

  const cover = p.cover_image_url || p.image_url || p.images?.[0] || '';
  const previewUrl = p.preview_media_url || '';
  const previewKind = mediaKind(previewUrl, p.preview_media_type || 'auto', 'preview');
  const hasPreview = Boolean(previewUrl);
  const isVideoPreview = hasPreview && previewKind === 'video';
  const isDriveVideoPreview = isVideoPreview && isGoogleDriveFileUrl(previewUrl);
  const isDirectVideoPreview = isVideoPreview && isDirectVideoUrl(previewUrl);
  const canHoverVideoPreview = isVideoPreview && !isDriveVideoPreview;
  const previewPoster = cover ? imageUrl(cover) : '';
  const canUsePreviewAsThumbnail = !cover && hasPreview;

  const galleryImages = useMemo(() => uniqueUrls([cover, ...(p.images || [])]), [cover, p.images]);

  const lightboxItems = useMemo(() => {
    const items = [];

    // Open the actual demo video first, but keep card thumbnail independent.
    if (hasPreview) {
      items.push({
        url: previewUrl,
        kind: previewKind,
        label: previewKind === 'video'
          ? (lang === 'id' ? 'Video demo' : 'Demo video')
          : (lang === 'id' ? 'Preview animasi/gambar' : 'Animated/image preview'),
      });
    }

    galleryImages.forEach((url, i) => {
      items.push({
        url,
        kind: 'image',
        label: i === 0
          ? (lang === 'id' ? 'Gambar utama' : 'Cover image')
          : `${lang === 'id' ? 'Screenshot' : 'Screenshot'} ${i}`,
      });
    });

    return uniqueMedia(items);
  }, [galleryImages, hasPreview, lang, previewKind, previewUrl]);

  useEffect(() => {
    setPreviewFailed(false);
  }, [previewUrl, previewKind]);

  useEffect(() => {
    setCoverFailed(false);
  }, [cover]);

  function openLightbox(e) {
    e.stopPropagation();
    if (lightboxItems.length > 0) setLightbox(0);
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const showMediaBox = Boolean(cover || hasPreview);

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
        {showMediaBox && (
          <div
            className="project-img-wrap clickable"
            onClick={openLightbox}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openLightbox(e);
            }}
            aria-label={isVideoPreview
              ? (lang === 'id' ? `Buka video demo ${title}` : `Open demo video for ${title}`)
              : (lang === 'id' ? `Buka galeri ${title}` : `Open gallery for ${title}`)}
          >
            {cover && !coverFailed ? (
              <SmartImage
                className="project-img"
                src={cover}
                alt={title}
                onFinalError={() => setCoverFailed(true)}
              />
            ) : canUsePreviewAsThumbnail && previewKind === 'video' && isDirectVideoPreview && !previewFailed ? (
              <video
                className="project-img project-video-thumb"
                src={mediaUrl(previewUrl, 'video')}
                poster={previewPoster || undefined}
                muted
                playsInline
                preload="metadata"
                onError={() => setPreviewFailed(true)}
              />
            ) : canUsePreviewAsThumbnail && previewKind === 'video' && isDriveVideoPreview ? (
              <div className="project-img project-img-placeholder project-video-placeholder">
                <span>{lang === 'id' ? 'Klik untuk membuka video demo' : 'Click to open demo video'}</span>
              </div>
            ) : canUsePreviewAsThumbnail && previewKind !== 'video' && !previewFailed ? (
              <SmartImage
                className="project-img"
                src={previewUrl}
                alt={title}
                onFinalError={() => setPreviewFailed(true)}
              />
            ) : (
              <div className="project-img project-img-placeholder">
                <span>{lang === 'id' ? 'Gambar belum tersedia' : 'Image not available'}</span>
              </div>
            )}

            <AnimatePresence>
              {cover && hasPreview && hovered && !previewFailed && (!isVideoPreview || canHoverVideoPreview) && (
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
                      poster={previewPoster || undefined}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="auto"
                      onCanPlay={(e) => { e.currentTarget.play().catch(() => {}); }}
                      onError={() => setPreviewFailed(true)}
                    />
                  ) : (
                    <SmartImage
                      className="project-img project-preview-media"
                      src={previewUrl}
                      alt=""
                      onFinalError={() => setPreviewFailed(true)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {hasPreview && !previewFailed && (
              <>
                <span className="project-preview-badge">
                  {previewKind === 'video'
                    ? (lang === 'id' ? 'Klik untuk video besar' : 'Click for full video')
                    : (lang === 'id' ? 'Klik untuk preview besar' : 'Click for full preview')}
                </span>
                {isVideoPreview && <span className="project-play-indicator">▶</span>}
              </>
            )}

            {lightboxItems.length > 1 && (
              <span className="timeline-img-counter">1/{lightboxItems.length}</span>
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
            items={lightboxItems}
            index={lightbox}
            onClose={(next, cycle) => {
              if (cycle) {
                const n = ((next % lightboxItems.length) + lightboxItems.length) % lightboxItems.length;
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
