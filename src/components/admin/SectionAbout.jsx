import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';

const DEFAULT_BIO = {
  en: [
    '<p class="about-bio">I am a Structural Engineer with a Master\'s degree in Civil Engineering from Universitas Gadjah Mada (GPA 3.80/4.00) and a Bachelor\'s degree from Universitas Sumatera Utara (GPA 3.53/4.00). My work spans structural analysis, finite element modeling, and digital tools for engineering practice.</p>',
    '<p class="about-bio">Outside my engineering career, I enjoy building web applications and exploring data-driven approaches to problem-solving. I believe in combining technical rigor with clear communication to deliver impactful solutions.</p>'
  ].join(''),
  id: [
    '<p class="about-bio">Saya adalah Insinyur Struktur dengan gelar Magister Teknik Sipil dari Universitas Gadjah Mada (IPK 3,80/4,00) dan Sarjana Teknik Sipil dari Universitas Sumatera Utara (IPK 3,53/4,00). Pekerjaan saya mencakup analisis struktur, pemodelan elemen hingga, dan pengembangan alat digital untuk praktik rekayasa.</p>',
    '<p class="about-bio">Di luar karier teknik, saya senang membangun aplikasi web dan mengeksplorasi pendekatan berbasis data untuk pemecahan masalah. Saya percaya pada kombinasi ketelitian teknis dengan komunikasi yang jelas untuk menghasilkan solusi yang berdampak.</p>'
  ].join(''),
};

export default function SectionAbout() {
  const { about, setAbout } = useContent();
  const toast = useToast();
  const [bioEN, setBioEN] = useState(about?.bio_en || '');
  const [bioID, setBioID] = useState(about?.bio_id || '');
  const [photoUrl, setPhotoUrl] = useState(about?.photo_url || '');

  function save() {
    setAbout({ bio_en: bioEN, bio_id: bioID, photo_url: photoUrl });
    toast('Tentang saya berhasil disimpan!');
  }

  return (
    <div>
      <div className="page-header">
        <h2>Tentang Saya</h2>
        <button className="btn-save" onClick={save}>Simpan</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field-group">
          <label>URL Foto Profil</label>
          <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://prizuri.github.io/portfolio/img/photo.jpg" />
          <span className="hint">Upload foto ke folder public/img/ di GitHub repo, lalu paste URL-nya</span>
        </div>
        {photoUrl && (
          <img src={photoUrl} alt="preview" style={{ width: 120, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
        )}

        <div className="field-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Bio (English)</label>
            <button className="btn-edit" onClick={() => setBioEN(DEFAULT_BIO.en)}>↺ Default</button>
          </div>
          <textarea rows={6} value={bioEN} onChange={e => setBioEN(e.target.value)} />
          <span className="hint">HTML diizinkan: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;</span>
        </div>

        <div className="field-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Bio (Indonesia)</label>
            <button className="btn-edit" onClick={() => setBioID(DEFAULT_BIO.id)}>↺ Default</button>
          </div>
          <textarea rows={6} value={bioID} onChange={e => setBioID(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
