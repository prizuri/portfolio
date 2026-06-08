import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { KEYS, readData, writeData, DEFAULT_SECTION_CONFIG } from '../../utils/storage';
import { imageUrl } from '../../utils/url';

function Counter({ value, format = (v) => Math.round(v) }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, format);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return () => animation.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Dashboard() {
  const { projects, experience, skills, education, hobbies, publications,
          about, sections, langSettings, refreshFromSource } = useContent();
  const toast = useToast();
  const [publishing, setPublishing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  function collectAllData() {
    return {
      about:         about || {},
      projects:      projects || [],
      experience:    experience || [],
      skills:        skills || [],
      education:     education || [],
      hobbies:       hobbies || [],
      publications:  publications || [],
      sections:      sections || [],
      lang_settings: langSettings || { id_enabled: true },
    };
  }

  async function publish() {
    setPublishing(true);
    const data = collectAllData();
    try {
      const apiPath = `${import.meta.env.BASE_URL}api/save-content`.replace(/\/+/g, '/');
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        writeData('ph_data_checksum', JSON.stringify(data));
        toast('content.json berhasil disimpan ke disk!');
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown status ' + res.status }));
        toast(`Gagal: ${err.error || 'Server error'}`, 'error');
      }
    } catch (e) {
      toast('Server tidak tersedia atau koneksi terputus.', 'error');
    }
    setPublishing(false);
  }

  async function forceSync() {
    if (!confirm('Ini akan menimpa perubahan lokal Anda dengan data dari content.json di server. Lanjutkan?')) return;
    setSyncing(true);
    const success = await refreshFromSource();
    if (success) {
      toast('Data berhasil disinkronisasi dari server!');
    } else {
      toast('Gagal sinkronisasi data.', 'error');
    }
    setSyncing(false);
  }

  function download() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(collectAllData(), null, 2)], { type: 'application/json' }));
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    toast('Download content.json siap!');
  }

  function exportBackup() {
    const data = { ...collectAllData(), exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast('Backup berhasil diunduh!');
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.about)        localStorage.setItem(KEYS.about,        JSON.stringify(data.about));
        if (data.projects)     localStorage.setItem(KEYS.projects,     JSON.stringify(data.projects));
        if (data.experience)   localStorage.setItem(KEYS.experience,   JSON.stringify(data.experience));
        if (data.skills)       localStorage.setItem(KEYS.skills,       JSON.stringify(data.skills));
        if (data.education)    localStorage.setItem(KEYS.education,    JSON.stringify(data.education));
        if (data.hobbies)      localStorage.setItem(KEYS.hobbies,      JSON.stringify(data.hobbies));
        if (data.publications) localStorage.setItem(KEYS.publications, JSON.stringify(data.publications));
        if (data.sections)     localStorage.setItem(KEYS.sections,     JSON.stringify(data.sections));
        if (data.lang_settings)localStorage.setItem(KEYS.lang,         JSON.stringify(data.lang_settings));
        toast('Backup diimpor. Refresh halaman untuk melihat perubahan.');
      } catch { toast('File tidak valid.', 'error'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function storageInfo() {
    let total = 0;
    Object.entries(localStorage).forEach(([k, v]) => {
      if (k.startsWith('ph_')) total += (k.length + v.length) * 2;
    });
    return `${(total / 1024).toFixed(1)} KB / 5120 KB`;
  }

  const totalProjectValue = projects.reduce((acc, p) => acc + (Number(p.project_value) || 0), 0);

  function formatCurrency(v) {
    if (v >= 1e12) return 'Rp' + (v / 1e12).toFixed(2) + ' T';
    if (v >= 1e9) return 'Rp' + (v / 1e9).toFixed(2) + ' M';
    if (v >= 1e6) return 'Rp' + (v / 1e6).toFixed(1) + ' Jt';
    return 'Rp' + Math.round(v).toLocaleString('id-ID');
  }

  const totalExpImages = experience.reduce((acc, x) => acc + (x.images?.length || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        <div className="stat-card" style={{ gridColumn: 'span 2', background: 'var(--accent-dim2)', borderColor: 'var(--accent)' }}>
          <div className="stat-val" style={{ fontSize: '2.2rem' }}>
            <Counter value={totalProjectValue} format={formatCurrency} />
          </div>
          <div className="stat-label" style={{ color: 'var(--accent-l)', fontWeight: 600 }}>Total Nilai Project</div>
        </div>
        {[
          ['Proyek',     projects.length],
          ['Pengalaman', experience.length],
          ['Keahlian',   skills.length],
          ['Pendidikan', education.length],
          ['Gambar', totalExpImages],
        ].map(([label, val]) => (
          <div key={label} className="stat-card">
            <div className="stat-val"><Counter value={val} /></div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {totalExpImages > 0 && (
        <div className="info-panel" style={{ marginTop: 16 }}>
          <h4>Galeri Pengalaman</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {experience.flatMap(x => (x.images || []).map((img, i) => (
              <div key={`${x.id}-${i}`} title={x.title}>
                <img src={imageUrl(img)} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
              </div>
            )))}
          </div>
        </div>
      )}

      <div className="info-panel">
        <h4>Storage</h4>
        <div className="storage-row"><span>Terpakai</span><strong>{storageInfo()}</strong></div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <button className="btn-save" onClick={publish} disabled={publishing} style={{ opacity: publishing ? '.6' : '1' }}>
          {publishing ? 'Menyimpan...' : 'Publish ke File'}
        </button>
        <button className="btn-outline btn-sm" onClick={download} style={{ padding: '9px 20px' }}>
          Download content.json
        </button>
        <button className="btn-cancel" onClick={exportBackup}>📦 Export Backup</button>
        <label className="btn-cancel" style={{ cursor: 'pointer' }}>
          📥 Import Backup
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <button className="btn-del" onClick={forceSync} disabled={syncing} style={{ marginLeft: 'auto' }}>
          {syncing ? 'Syncing...' : '🔄 Reset ke Data File'}
        </button>
      </div>

      <div className="info-panel" style={{ marginTop: 16 }}>
        <h4>Cara Publish</h4>
        <ol style={{ color: 'var(--text-2)', fontSize: '.85rem', paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Publish ke File</strong> (hanya saat <code>npm run dev</code>) → langsung simpan ke <code>public/data/content.json</code></li>
          <li><strong>Download content.json</strong> (selalu bisa) → simpan manual ke <code>public/data/</code>, lalu push ke GitHub</li>
          <li>GitHub Actions otomatis build & deploy dalam ~1-2 menit</li>
        </ol>
      </div>
    </div>
  );
}
