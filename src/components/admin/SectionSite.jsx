import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';

export default function SectionSite() {
  const { about, setAbout } = useContent();
  const toast = useToast();

  const [logoText, setLogoText] = useState(about?.logo_text || 'PH');
  const [fullName, setFullName] = useState(about?.full_name || 'Prizuri Hartadi');
  const [roleEN, setRoleEN] = useState(about?.role_en || '');
  const [roleID, setRoleID] = useState(about?.role_id || '');
  const [heroDescEN, setHeroDescEN] = useState(about?.hero_desc_en || '');
  const [heroDescID, setHeroDescID] = useState(about?.hero_desc_id || '');
  const [cta1EN, setCta1EN] = useState(about?.hero_cta1_en || '');
  const [cta1ID, setCta1ID] = useState(about?.hero_cta1_id || '');
  const [cta2EN, setCta2EN] = useState(about?.hero_cta2_en || '');
  const [cta2ID, setCta2ID] = useState(about?.hero_cta2_id || '');
  const [locEN, setLocEN] = useState(about?.location_en || '');
  const [locID, setLocID] = useState(about?.location_id || '');
  const [subEN, setSubEN] = useState(about?.contact_subtitle_en || '');
  const [subID, setSubID] = useState(about?.contact_subtitle_id || '');
  const [yearsExp, setYearsExp] = useState(about?.years_exp || '2');
  const [statusColor, setStatusColor] = useState(about?.status_color || 'green');
  const [formspree, setFormspree] = useState(about?.formspree_id || '');

  function save() {
    setAbout({
      ...about,
      logo_text: logoText,
      full_name: fullName,
      role_en: roleEN,
      role_id: roleID,
      hero_desc_en: heroDescEN,
      hero_desc_id: heroDescID,
      hero_cta1_en: cta1EN,
      hero_cta1_id: cta1ID,
      hero_cta2_en: cta2EN,
      hero_cta2_id: cta2ID,
      location_en: locEN,
      location_id: locID,
      contact_subtitle_en: subEN,
      contact_subtitle_id: subID,
      years_exp: yearsExp,
      status_color: statusColor,
      formspree_id: formspree
    });
    toast('Pengaturan situs disimpan!');
  }

  return (
    <div>
      <div className="page-header">
        <h2>Situs & Hero</h2>
        <button className="btn-save" onClick={save}>Simpan</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="info-panel">
          <h4>Umum</h4>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Teks Logo</label>
              <input value={logoText} onChange={e => setLogoText(e.target.value)} placeholder="PH" />
            </div>
            <div className="field-group">
              <label>Nama Lengkap</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Prizuri Hartadi" />
            </div>
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label>Angka Tahun Pengalaman (tampil di Hero)</label>
            <input value={yearsExp} onChange={e => setYearsExp(e.target.value)} placeholder="2" />
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label>Warna Lampu Status</label>
            <select value={statusColor} onChange={e => setStatusColor(e.target.value)}>
              <option value="green">Hijau (Aktif/Tersedia)</option>
              <option value="blue">Biru (Muted/Bekerja)</option>
              <option value="none">Tanpa Lampu</option>
            </select>
          </div>
        </div>

        <div className="info-panel">
          <h4>Hero Section</h4>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Role (EN)</label>
              <input value={roleEN} onChange={e => setRoleEN(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Role (ID)</label>
              <input value={roleID} onChange={e => setRoleID(e.target.value)} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Hero Description (EN)</label>
              <textarea value={heroDescEN} onChange={e => setHeroDescEN(e.target.value)} rows={3} />
            </div>
            <div className="field-group">
              <label>Hero Description (ID)</label>
              <textarea value={heroDescID} onChange={e => setHeroDescID(e.target.value)} rows={3} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Button 1 (EN)</label>
              <input value={cta1EN} onChange={e => setCta1EN(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Button 1 (ID)</label>
              <input value={cta1ID} onChange={e => setCta1ID(e.target.value)} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Button 2 (EN)</label>
              <input value={cta2EN} onChange={e => setCta2EN(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Button 2 (ID)</label>
              <input value={cta2ID} onChange={e => setCta2ID(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="info-panel">
          <h4>Kontak & Lokasi</h4>
          <div className="form-grid-2">
            <div className="field-group">
              <label>Lokasi (EN)</label>
              <input value={locEN} onChange={e => setLocEN(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Lokasi (ID)</label>
              <input value={locID} onChange={e => setLocID(e.target.value)} />
            </div>
          </div>
          <div className="form-grid-2" style={{ marginTop: 12 }}>
            <div className="field-group">
              <label>Sub-judul Kontak (EN)</label>
              <input value={subEN} onChange={e => setSubEN(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Sub-judul Kontak (ID)</label>
              <input value={subID} onChange={e => setSubID(e.target.value)} />
            </div>
          </div>
          <div className="field-group" style={{ marginTop: 12 }}>
            <label>Formspree ID</label>
            <input value={formspree} onChange={e => setFormspree(e.target.value)} placeholder="xvznzqdz" />
            <span className="hint">ID unik dari endpoint Formspree Anda</span>
          </div>
        </div>
      </div>
    </div>
  );
}
