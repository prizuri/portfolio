import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

export default function About() {
  const { lang } = useLang();
  const { about } = useContent();

  const bio = lang === 'id' ? about?.bio_id : about?.bio_en;

  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title"><T en="About Me" id="Tentang Saya" /></h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: about?.photo_url ? '1fr 1.8fr' : '1fr', gap: '48px', alignItems: 'center', maxWidth: 860, margin: '0 auto' }}>
          {about?.photo_url && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <img
                src={about.photo_url}
                alt="Prizuri Hartadi"
                style={{ borderRadius: 16, width: '100%', aspectRatio: '3/4', objectFit: 'cover', border: '1px solid var(--border)' }}
              />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {bio
              ? <div style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '.95rem' }} dangerouslySetInnerHTML={{ __html: bio }} />
              : <p style={{ color: 'var(--text-3)' }}><T en="Bio coming soon." id="Bio segera hadir." /></p>
            }
          </motion.div>
        </div>
      </div>
    </section>
  );
}
