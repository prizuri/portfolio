import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { useState } from 'react';

export default function SectionCV() {
  const { cvData, setCVData } = useContent();
  const toast = useToast();

  // Initialize with empty object if no data exists
  const [formData, setFormData] = useState(() => ({
    summary_en: cvData?.summary_en || '',
    summary_id: cvData?.summary_id || '',
    education_en: cvData?.education_en || '',
    education_id: cvData?.education_id || '',
    skills_en: cvData?.skills_en || '',
    skills_id: cvData?.skills_id || '',
    certifications_en: cvData?.certifications_en || '',
    certifications_id: cvData?.certifications_id || '',
    cv_url: cvData?.cv_url || '',
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCVData(formData);
    toast('CV data disimpan.');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Edit CV</h2>
      </div>
      <form onSubmit={handleSubmit} className="cv-form">
        <div className="form-grid-2">
          <div className="field-group">
            <label>Professional Summary (EN)</label>
            <textarea
              name="summary_en"
              value={formData.summary_en}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your professional summary in English"
            />
          </div>
          <div className="field-group">
            <label>Ringkasan Profesional (ID)</label>
            <textarea
              name="summary_id"
              value={formData.summary_id}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your professional summary in Indonesian"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field-group">
            <label>Education (EN)</label>
            <textarea
              name="education_en"
              value={formData.education_en}
              onChange={handleChange}
              rows="3"
              placeholder="List your education background in English"
            />
          </div>
          <div className="field-group">
            <label>Pendidikan (ID)</label>
            <textarea
              name="education_id"
              value={formData.education_id}
              onChange={handleChange}
              rows="3"
              placeholder="Latar belakang pendidikan dalam Bahasa Indonesia"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field-group">
            <label>Skills (EN)</label>
            <textarea
              name="skills_en"
              value={formData.skills_en}
              onChange={handleChange}
              rows="3"
              placeholder="List your key skills in English"
            />
          </div>
          <div className="field-group">
            <label>Keahlian (ID)</label>
            <textarea
              name="skills_id"
              value={formData.skills_id}
              onChange={handleChange}
              rows="3"
              placeholder="Daftarkan keahlian utama Anda dalam Bahasa Indonesia"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field-group">
            <label>Certifications (EN)</label>
            <textarea
              name="certifications_en"
              value={formData.certifications_en}
              onChange={handleChange}
              rows="3"
              placeholder="List your certifications in English"
            />
          </div>
          <div className="field-group">
            <label>Sertifikasi (ID)</label>
            <textarea
              name="certifications_id"
              value={formData.certifications_id}
              onChange={handleChange}
              rows="3"
              placeholder="Daftarkan sertifikasi Anda dalam Bahasa Indonesia"
            />
          </div>
        </div>

        <div className="field-group">
          <label>CV URL (for download button)</label>
          <input
            name="cv_url"
            value={formData.cv_url}
            onChange={handleChange}
            placeholder="Enter URL to download full CV (e.g., Google Drive link)"
          />
          <p style={{ fontSize: '.75rem', color: 'var(--text-2)', marginTop: '4px' }}>
            Leave blank if you don't want to show a download button
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Simpan CV Data
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              // Reset to default values
              setFormData({
                summary_en: "Junior Structural Engineer with expertise in structural analysis, design, and assessment of steel and reinforced concrete structures. Skilled in using SAP2000, ETABS, Abaqus, and Python for engineering solutions.",
                summary_id: "Insinyur Struktur Junior yang ahli dalam analisis, desain, dan asesmen struktur baja dan beton bertulang. Mahir dalam menggunakan SAP2000, ETABS, Abaqus, dan Python untuk solusi teknik.",
                education_en: "Master of Civil Engineering, Universitas Gadjah Mada (2023-2025)\\nBachelor of Civil Engineering, Universitas Sumatera Utara (2018-2022)",
                education_id: "Magister Teknik Sipil, Universitas Gadjah Mada (2023-2025)\\nSarjana Teknik Sipil, Universitas Sumatera Utara (2018-2022)",
                skills_en: "Structural Analysis (SAP2000, ETABS, Abaqus, SAFE), Experimental Testing, Python Programming, Structural Assessment, AutoCAD",
                skills_id: "Analisis Struktur (SAP2000, ETABS, Abaqus, SAFE), Pengujian Eksperimental, Pemrograman Python, Penilaian Struktural, AutoCAD",
                certifications_en: "Professional Engineer-in-Training\\nAISC Steel Design Certificate\\nOSHA Safety Training",
                certifications_id: "Insinyur Profesional Dalam Pelatihan\\nSertifikat Desain Baja AISC\\nPelatihan Keamanan OSHA",
                cv_url: ""
              });
            }}
          >
            Reset ke Default
          </button>
        </div>
      </form>
    </div>
  );
}