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
  'chip':         'Chip (ikon + nama)',
  'project-card': 'Project Card (gambar + deskripsi + link)',
  'list':         'Daftar',
};

export default function SectionManager() {
  const { sections, setSections } = useContent();
  const toast = useToast();

  const merged = DEFAULT_SECTION_CONFIG.map(def => {
    const saved = sections.find(s => s.id === def.id);
    return saved ? { ...def, ...saved } : { ...def };
  });

  function toggleVisible(id) {
    setSections(merged.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    toast('Pengaturan disimpan.');
  }

  function setLayout(id, layout) {
    setSections(merged.map(s => s.id === id ? { ...s, layout } : s));
    toast('Layout diperbarui.');
  }

  function setTitle(id, field, value) {
    setSections(merged.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Tata Section</h2>
      </div>
      <p style={{ color: 'var(--text-2)', fontSize: '.88rem', marginBottom: 20 }}>
        Atur section mana yang tampil di website, judulnya, dan pilih layoutnya.
      </p>
      <div className="section-toggle-list">
        {merged.map(sec => (
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
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sec.visible !== false}
                  onChange={() => toggleVisible(sec.id)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
            
            <div className="form-grid-2">
              <div className="field-group">
                <label style={{ fontSize: '.7rem' }}>Judul (EN)</label>
                <input 
                  value={sec.title_en || LABELS[sec.id]?.en || ''} 
                  onChange={e => setTitle(sec.id, 'title_en', e.target.value)}
                  style={{ fontSize: '.85rem', padding: '6px 10px' }}
                />
              </div>
              <div className="field-group">
                <label style={{ fontSize: '.7rem' }}>Judul (ID)</label>
                <input 
                  value={sec.title_id || LABELS[sec.id]?.id || ''} 
                  onChange={e => setTitle(sec.id, 'title_id', e.target.value)}
                  style={{ fontSize: '.85rem', padding: '6px 10px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
