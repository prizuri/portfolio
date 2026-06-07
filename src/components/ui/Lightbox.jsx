import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { imageUrl } from '../../utils/url';

export default function Lightbox({ images, index, onClose }) {
  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose();
    if (images.length > 1) {
      if (e.key === 'ArrowRight') onClose(index + 1, true);
      if (e.key === 'ArrowLeft') onClose(index - 1, true);
    }
  }, [images.length, index, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className="lightbox-close" onClick={onClose}>✕</button>

      {images.length > 1 && (
        <button className="lightbox-nav lightbox-prev" onClick={() => onClose(index - 1, true)}>‹</button>
      )}

      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          className="lightbox-img"
          src={imageUrl(images[index])}
          alt=""
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <button className="lightbox-nav lightbox-next" onClick={() => onClose(index + 1, true)}>›</button>
      )}

      {images.length > 1 && (
        <span className="lightbox-counter">{index + 1} / {images.length}</span>
      )}
    </motion.div>
  );
}