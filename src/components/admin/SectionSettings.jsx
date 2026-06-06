import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';

export default function SectionSettings() {
  const { langSettings, setLangSettings } = useContent();
  const toast = useToast();
  const [idEnabled, setIdEnabled] = useState(langSettings?.id_enabled === true);

  function save() {
    setLangSettings({ id_enabled: idEnabled });
    toast('Pengaturan bahasa disimpan!');
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
        <h4>Informasi</h4>
        <div className="storage-row"><span>Versi</span><strong>2.0 (React)</strong></div>
        <div className="storage-row"><span>Hosting</span><strong>GitHub Pages</strong></div>
        <div className="storage-row"><span>Kontak</span><strong>justforapp2122@gmail.com</strong></div>
      </div>
    </div>
  );
}
