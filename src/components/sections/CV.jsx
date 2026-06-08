import { motion } from 'framer-motion';
import { useLang } from '../../contexts/LangContext';
import { useContent } from '../../contexts/ContentContext';

const DEFAULT_CV = {
  summary_en: 'Junior Structural Engineer with expertise in structural analysis, design, and assessment of steel and reinforced concrete structures. Skilled in using SAP2000, ETABS, Abaqus, and Python for engineering solutions.',
  summary_id: 'Insinyur Struktur Junior yang ahli dalam analisis, desain, dan asesmen struktur baja dan beton bertulang. Mahir dalam menggunakan SAP2000, ETABS, Abaqus, dan Python untuk solusi teknik.',
  education_en: 'Master of Civil Engineering, Universitas Gadjah Mada (2023-2025)\nBachelor of Civil Engineering, Universitas Sumatera Utara (2018-2022)',
  education_id: 'Magister Teknik Sipil, Universitas Gadjah Mada (2023-2025)\nSarjana Teknik Sipil, Universitas Sumatera Utara (2018-2022)',
  skills_en: 'Structural Analysis (SAP2000, ETABS, Abaqus, SAFE), Experimental Testing, Python Programming, Structural Assessment, AutoCAD',
  skills_id: 'Analisis Struktur (SAP2000, ETABS, Abaqus, SAFE), Pengujian Eksperimental, Pemrograman Python, Penilaian Struktural, AutoCAD',
  certifications_en: 'Professional Engineer-in-Training\nAISC Steel Design Certificate\nOSHA Safety Training',
  certifications_id: 'Insinyur Profesional Dalam Pelatihan\nSertifikat Desain Baja AISC\nPelatihan Keamanan OSHA',
  cv_url: '',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function withLineBreaks(text) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .map((line, index) => <span key={`${line}-${index}`}>{line}<br /></span>);
}

export default function CV() {
  const { lang } = useLang();
  const { cvData, getSectionConfig } = useContent();
  const cv = { ...DEFAULT_CV, ...(cvData || {}) };
  const config = getSectionConfig('cv');
  const title = lang === 'id' ? config.title_id : config.title_en;

  return (
    <section id="cv" className="cv section">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          {title || 'Curriculum Vitae'}
        </motion.h2>

        <div className="cv-grid">
          <motion.div variants={itemVariants} className="cv-section">
            <h3>{lang === 'id' ? 'Ringkasan Profesional' : 'Professional Summary'}</h3>
            <p>{withLineBreaks(lang === 'id' ? cv.summary_id : cv.summary_en)}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="cv-section">
            <h3>{lang === 'id' ? 'Pendidikan' : 'Education'}</h3>
            <p>{withLineBreaks(lang === 'id' ? cv.education_id : cv.education_en)}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="cv-section">
            <h3>{lang === 'id' ? 'Keahlian' : 'Skills'}</h3>
            <p>{withLineBreaks(lang === 'id' ? cv.skills_id : cv.skills_en)}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="cv-section">
            <h3>{lang === 'id' ? 'Sertifikasi' : 'Certifications'}</h3>
            <p>{withLineBreaks(lang === 'id' ? cv.certifications_id : cv.certifications_en)}</p>
          </motion.div>

          {cv.cv_url && (
            <motion.div variants={itemVariants} className="cv-section cv-download">
              <a
                href={cv.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {lang === 'id' ? 'Download CV Lengkap' : 'Download Full CV'}
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
