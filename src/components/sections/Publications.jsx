import { motion } from 'framer-motion';
import { useLang, T } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';
import { ensureUrl } from '../../utils/url';

export default function Publications() {
  const { lang } = useLang();
  const { publications, getSectionConfig } = useContent();
  const sorted = [...publications].filter(p => !p.hidden).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const config = getSectionConfig('publications');
  const title = lang === 'id' ? config.title_id : config.title_en;

  if (!sorted.length) return null;

  return (
    <section id="publications" className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title">{title || (lang === 'id' ? 'Publikasi / Karya' : 'Publications')}</h2>
        </motion.div>

        <div className="pub-list">
          {sorted.map((p, i) => {
            const title = lang === 'id' && p.title_id ? p.title_id : p.title;
            return (
              <motion.div
                key={p.id}
                className="pub-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <div className="pub-title">{title}</div>
                {p.authors && <div className="pub-authors">{p.authors}</div>}
                {(p.journal || p.year) && (
                  <div className="pub-venue">
                    {p.journal}{p.journal && p.year ? ', ' : ''}{p.year}
                  </div>
                )}
                {(p.doi || p.url) && (
                  <div className="pub-links">
                    {p.doi && (
                      <a className="btn btn-outline btn-sm" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">DOI</a>
                    )}
                    {p.url && (
                      <a className="btn btn-outline btn-sm" href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer">
                        <T en="View" id="Lihat" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
