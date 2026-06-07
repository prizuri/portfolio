import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { readData, KEYS } from '../../utils/storage';

function collectAllData() {
  return {
    about:         readData(KEYS.about),
    projects:      readData(KEYS.projects) || [],
    experience:    readData(KEYS.experience) || [],
    skills:        readData(KEYS.skills) || [],
    education:     readData(KEYS.education) || [],
    hobbies:       readData(KEYS.hobbies) || [],
    publications:  readData(KEYS.publications) || [],
    sections:      readData(KEYS.sections),
    lang_settings: readData(KEYS.lang),
  };
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function SectionSettings() {
  const { langSettings, setLangSettings } = useContent();
  const toast = useToast();
  const [idEnabled, setIdEnabled] = useState(langSettings?.id_enabled === true);
  const [publishing, setPublishing] = useState(false);

  function save() {
    setLangSettings({ id_enabled: idEnabled });
    toast('Pengaturan bahasa disimpan!');
  }

  async function publish() {
    setPublishing(true);
    const data = collectAllData();
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast('content.json berhasil disimpan ke disk!');
      } else {
        throw new Error('Server error');
      }
    } catch {
      downloadJson(data);
      toast('Download content.json — simpan ke public/data/');
    }
    setPublishing(false);
  }

  function download() {
    downloadJson(collectAllData());
    toast('Download content.json siap!');
  }

  return (
    <div>
      <div className="page-header">
        <h2>Pengaturan</h2>
        <button className="btn-save" onClick={save}>Simpan</button>
      </div>

      <div className="info-panel">
        <h4>Pengaturan Bahasa</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <label className="toggle-switch">
            <input type="checkbox" checked={idEnabled} onChange={e => setIdEnabled(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text-1)' }}>Aktifkan Bahasa Indonesia</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-3)' }}>
              {idEnabled
                ? 'Toggle bahasa EN/ID tampil di navbar.'
                : 'Website hanya tampil dalam bahasa Inggris. Toggle bahasa disembunyikan.'}
            </div>
          </div>
        </label>
      </div>

      <div className="info-panel" style={{ marginTop: 16 }}>
        <h4>Publikasi Data</h4>
        <p style={{ fontSize: '.85rem', color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.7 }}>
          Semua data dari admin panel (tentang, proyek, pengalaman, dll.) akan diekspor ke <code style={{ color: 'var(--text-1)' }}>content.json</code>.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-save" onClick={publish} disabled={publishing} style={{ opacity: publishing ? '.6' : '1' }}>
            {publishing ? 'Menyimpan...' : 'Publish ke File'}
          </button>
          <button className="btn-outline btn-sm" onClick={download} style={{ padding: '9px 20px' }}>
            Download content.json
          </button>
        </div>
      </div>

      <div className="info-panel" style={{ marginTop: 16 }}>
        <h4>Informasi</h4>
        <div className="storage-row"><span>Versi</span><strong>2.0 (React)</strong></div>
        <div className="storage-row"><span>Hosting</span><strong>GitHub Pages</strong></div>
        <div className="storage-row"><span>Kontak</span><strong>justforapp2122@gmail.com</strong></div>
      </div>
    </div>
  );
}