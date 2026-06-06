import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

export default function About() {
  const { lang } = useLang();
  const { about } = useContent();

  const bio = lang === 'id' ? about?.bio_id : about?.bio_en;
  const hasPhoto = !!about?.photo_url;

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

        <div className={`about-layout${hasPhoto ? ' about-with-photo' : ''}`}>
          {hasPhoto && (
            <motion.div
              className="about-photo-wrap"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <img
                src={about.photo_url}
                alt="Prizuri Hartadi"
                className="about-photo"
              />
            </motion.div>
          )}
          <motion.div
            className="about-bio"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: hasPhoto ? 0.1 : 0 }}
          >
            {bio
              ? <div className="about-bio-content" dangerouslySetInnerHTML={{ __html: bio }} />
              : <p style={{ color: 'var(--text-3)' }}><T en="Bio coming soon." id="Bio segera hadir." /></p>
            }
          </motion.div>
        </div>
      </div>
    </section>
  );
}
