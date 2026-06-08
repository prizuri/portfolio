import { useNavigate } from 'react-router-dom';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_SECTION_CONFIG } from '../../utils/storage';

const LABELS = {
  about:        { en: 'About Me',             id: 'Tentang Saya' },
  projects:     { en: 'Projects',             id: 'Proyek' },
  experience:   { en: 'Experience',           id: 'Pengalaman' },
  skills:       { en: 'Skills',               id: 'Keahlian' },
  education:    { en: 'Education',            id: 'Pendidikan' },
  hobbies:      { en: 'Hobbies & Interests',  id: 'Hobi & Minat' },
  publications: { en: 'Publications',         id: 'Publikasi / Karya' },
  contact:      { en: 'Contact',              id: 'Kontak' },
};

const LAYOUTS = {
  hobbies:      ['chip', 'project-card'],
  publications: ['list'],
};

const LAYOUT_LABELS = {
  chip:           'Chip (ikon + nama)',
  'project-card': 'Project Card (gambar + deskripsi + link)',
  list:           'Daftar',
};

const EDIT_TARGETS = {
  about: 'about',
  projects: 'projects',
  experience: 'experience',
  skills: 'skills',
  education: 'education',
  hobbies: 'hobbies',
  publications: 'publications',
  contact: 'site',
};

export default function SectionManager() {
  const { sections, setSections } = useContent();
  const toast = useToast();
  const navigate = useNavigate();

  const merged = DEFAULT_SECTION_CONFIG.map(def => {
    const saved = sections.find(s => s.id === def.id);
    return saved ? { ...def, ...saved } : { ...def };
  });

  function saveSections(nextSections, message = 'Pengaturan disimpan.') {
    setSections(nextSections);
    toast(message);
  }

  function toggleVisible(id) {
    saveSections(merged.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  }

  function setLayout(id, layout) {
    saveSections(merged.map(s => s.id === id ? { ...s, layout } : s), 'Layout diperbarui.');
  }

  function setTitle(id, field, value) {
    setSections(merged.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function resetSections() {
    if (!confirm('Reset semua pengaturan section ke default?')) return;
    saveSections(DEFAULT_SECTION_CONFIG, 'Pengaturan section direset.');
  }

  return (
    <div>
      <div className="page-header">
        <h2>Tata Section</h2>
        <button className="btn-cancel" onClick={resetSections}>Reset Default</button>
      </div>
      <p style={{ color: 'var(--text-2)', fontSize: '.88rem', marginBottom: 20 }}>
        Atur section mana yang tampil di website, judulnya, dan pilih layoutnya.
      </p>
      <div className="section-toggle-list">
        {merged.map(sec => {
          const editTarget = EDIT_TARGETS[sec.id];
          const fallbackLabel = LABELS[sec.id] || { en: sec.id, id: sec.id };

          return (
            <div key={sec.id} className="section-toggle-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div className="item-info">
                  <div className="item-title" style={{ textTransform: 'uppercase', fontSize: '.75rem', color: 'var(--text-3)' }}>ID: {sec.id}</div>
                </div>
                {LAYOUTS[sec.id] && LAYOUTS[sec.id].length > 1 && (
                  <select
                    className="layout-select"
                    value={sec.layout || LAYOUTS[sec.id][0]}
                    onChange={e => setLayout(sec.id, e.target.value)}
                    style={{ marginLeft: 'auto' }}
                  >
                    {LAYOUTS[sec.id].map(l => (
                      <option key={l} value={l}>{LAYOUT_LABELS[l]}</option>
                    ))}
                  </select>
                )}
                <label className="toggle-switch" style={{ marginLeft: LAYOUTS[sec.id] ? 0 : 'auto' }}>
                  <input
                    type="checkbox"
                    checked={sec.visible !== false}
                    onChange={() => toggleVisible(sec.id)}
                  />
                  <span className="toggle-slider" />
                </label>
                {editTarget && (
                  <button
                    type="button"
                    onClick={() => navigate(`/f9xk7b/${editTarget}`)}
                    className="btn-edit"
                    style={{ padding: '6px 10px', fontSize: '.85rem' }}
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="form-grid-2">
                <div className="field-group">
                  <label style={{ fontSize: '.7rem' }}>Judul (EN)</label>
                  <input
                    value={sec.title_en || fallbackLabel.en}
                    onChange={e => setTitle(sec.id, 'title_en', e.target.value)}
                    style={{ fontSize: '.85rem', padding: '6px 10px' }}
                  />
                </div>
                <div className="field-group">
                  <label style={{ fontSize: '.7rem' }}>Judul (ID)</label>
                  <input
                    value={sec.title_id || fallbackLabel.id}
                    onChange={e => setTitle(sec.id, 'title_id', e.target.value)}
                    style={{ fontSize: '.85rem', padding: '6px 10px' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
