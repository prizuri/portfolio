import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { KEYS, readData } from '../../utils/storage';

export default function Dashboard() {
  const { projects, experience, skills, education, hobbies, publications,
          about, sections, langSettings } = useContent();
  const toast = useToast();

  function publish() {
    const data = {
      about:        readData(KEYS.about),
      projects:     readData(KEYS.projects) || [],
      experience:   readData(KEYS.experience) || [],
      skills:       readData(KEYS.skills) || [],
      education:    readData(KEYS.education) || [],
      hobbies:      readData(KEYS.hobbies) || [],
      publications: readData(KEYS.publications) || [],
      sections:     readData(KEYS.sections) || [],
      lang_settings:readData(KEYS.lang) || {},
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.json';
    a.click();
    toast('content.json didownload. Upload ke public/data/ di GitHub repo.');
  }

  function exportBackup() {
    const data = {
      about: readData(KEYS.about),
      projects: readData(KEYS.projects) || [],
      experience: readData(KEYS.experience) || [],
      skills: readData(KEYS.skills) || [],
      education: readData(KEYS.education) || [],
      hobbies: readData(KEYS.hobbies) || [],
      publications: readData(KEYS.publications) || [],
      sections: readData(KEYS.sections) || [],
      lang_settings: readData(KEYS.lang) || {},
      exported_at: new Date().toISOString(),
    };
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

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stat-grid">
        {[
          ['Proyek',     projects.length],
          ['Pengalaman', experience.length],
          ['Keahlian',   skills.length],
          ['Pendidikan', education.length],
          ['Hobi',       hobbies.length],
          ['Publikasi',  publications.length],
        ].map(([label, val]) => (
          <div key={label} className="stat-card">
            <div className="stat-val">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="info-panel">
        <h4>Storage</h4>
        <div className="storage-row"><span>Terpakai</span><strong>{storageInfo()}</strong></div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <button className="btn-save" onClick={publish}>🚀 Publish ke Website</button>
        <button className="btn-cancel" onClick={exportBackup}>📦 Export Backup</button>
        <label className="btn-cancel" style={{ cursor: 'pointer' }}>
          📥 Import Backup
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="info-panel" style={{ marginTop: 16 }}>
        <h4>Cara Publish</h4>
        <ol style={{ color: 'var(--text-2)', fontSize: '.85rem', paddingLeft: 20, lineHeight: 2 }}>
          <li>Klik <strong style={{ color: 'var(--text-1)' }}>Publish ke Website</strong> → file <code>content.json</code> terunduh</li>
          <li>Upload file ke folder <code>public/data/</code> di GitHub repo</li>
          <li>GitHub Actions otomatis build & deploy dalam ~1-2 menit</li>
        </ol>
      </div>
    </div>
  );
}
