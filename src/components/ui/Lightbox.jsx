import { useEffect, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { googleDriveEmbedUrl, imageUrl, imageUrls, isGoogleDriveFileUrl, mediaUrl } from '../../utils/url';

function normalizeItems(images = [], items = null) {
  if (Array.isArray(items) && items.length) {
    return items
      .map(item => ({
        url: typeof item === 'string' ? item : item?.url,
        kind: typeof item === 'string' ? 'image' : (item?.kind || 'image'),
        label: typeof item === 'string' ? '' : (item?.label || ''),
      }))
      .filter(item => item.url);
  }

  return (images || [])
    .map(url => ({ url, kind: 'image', label: '' }))
    .filter(item => item.url);
}

function SmartLightboxImage({ src, alt, className }) {
  const candidates = useMemo(() => imageUrls(src), [src]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [src]);

  if (!candidates.length) {
    return <div className={`${className || ''} lightbox-fallback`}>Image not available</div>;
  }

  return (
    <motion.img
      key={`${src}-${idx}`}
      className={className}
      src={candidates[idx]}
      alt={alt || ''}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25 }}
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}

export default function Lightbox({ images = [], items = null, index = 0, onClose }) {
  const mediaItems = normalizeItems(images, items);
  const current = mediaItems[index];
  const currentIsDriveVideo = current?.kind === 'video' && isGoogleDriveFileUrl(current.url);
  const currentDriveEmbedUrl = currentIsDriveVideo ? googleDriveEmbedUrl(current.url) : '';
  const posterCandidate = mediaItems.find(item => item.kind === 'image')?.url || '';
  const posterUrl = posterCandidate ? imageUrl(posterCandidate) : '';

  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose();
    if (mediaItems.length > 1) {
      if (e.key === 'ArrowRight') onClose(index + 1, true);
      if (e.key === 'ArrowLeft') onClose(index - 1, true);
    }
  }, [mediaItems.length, index, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  if (!current) return null;

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close preview">✕</button>

      {mediaItems.length > 1 && (
        <button className="lightbox-nav lightbox-prev" onClick={() => onClose(index - 1, true)} aria-label="Previous media">‹</button>
      )}

      <AnimatePresence mode="wait">
        {current.kind === 'video' ? (
          currentIsDriveVideo ? (
            <motion.iframe
              key={`${current.url}-${index}`}
              className="lightbox-media lightbox-video lightbox-frame"
              src={currentDriveEmbedUrl}
              title={current.label || 'Demo video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
            />
          ) : (
            <motion.video
              key={`${current.url}-${index}`}
              className="lightbox-media lightbox-video"
              src={mediaUrl(current.url, 'video')}
              poster={posterUrl || undefined}
              controls
              autoPlay
              playsInline
              preload="auto"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
            />
          )
        ) : (
          <SmartLightboxImage
            key={`${current.url}-${index}`}
            className="lightbox-media lightbox-img"
            src={current.url}
            alt={current.label || ''}
          />
        )}
      </AnimatePresence>

      {current.label && <span className="lightbox-label">{current.label}</span>}

      {mediaItems.length > 1 && (
        <button className="lightbox-nav lightbox-next" onClick={() => onClose(index + 1, true)} aria-label="Next media">›</button>
      )}

      {mediaItems.length > 1 && (
        <span className="lightbox-counter">{index + 1} / {mediaItems.length}</span>
      )}
    </motion.div>
  );
}
