import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import { ensureUrl } from '../../utils/url';
import Modal from '../ui/Modal';

const EMPTY = { icon: '⭐', name_en: '', name_id: '', title: '', desc: '', image_url: '', demo_url: '', github_url: '', order: 0, hidden: false };

export default function SectionHobbies() {
  const { hobbies, setHobbies, getSectionConfig } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const layout = getSectionConfig('hobbies')?.layout || 'chip';
  const sorted = [...hobbies].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function save() {
    if (!form.name_en.trim()) { toast('Nama (EN) wajib diisi.', 'error'); return; }
    const item = {
      ...form,
      title: form.name_en,
      demo_url: ensureUrl(form.demo_url),
      github_url: ensureUrl(form.github_url),
      updated_at: Date.now(),
    };
    if (modal === 'add') setHobbies([...hobbies, { id: genId(), created_at: Date.now(), ...item }]);
    else setHobbies(hobbies.map(h => h.id === form.id ? { ...h, ...item } : h));
    setModal(null);
    toast('Hobi disimpan!');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(h => h.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setHobbies(arr.map((h, idx) => ({ ...h, order: idx })));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Hobi & Minat</h2>
        <button className="btn-save" onClick={() => { setForm({ ...EMPTY, order: hobbies.length }); setModal('add'); }}>+ Tambah</button>
      </div>
      <div className="info-panel" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <span style={{ fontSize: '.82rem', color: 'var(--text-2)' }}>
          Layout aktif: <strong style={{ color: 'var(--text-1)' }}>{layout === 'chip' ? 'Chip (minat/hobi)' : 'Project Card (proyek hobby)'}</strong>
          {' — '}ubah di <strong>Tata Section</strong>
        </span>
      </div>
      {!sorted.length
        ? <div className="empty-state">Belum ada hobi.</div>
        : <div className="items-list">
            {sorted.map((h, i) => (
              <div key={h.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(h.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(h.id, 1)}>▼</button>
                </div>
                <span style={{ fontSize: '1.4rem' }}>{h.icon}</span>
                <div className="item-info">
                  <div className="item-title">{h.name_en} {h.hidden ? <span className="badge-hidden">Hidden</span> : ''}</div>
                  {h.name_id && <div className="item-sub">{h.name_id}</div>}
                </div>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => { setForm({ ...EMPTY, ...h }); setModal('edit'); }}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(h.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Tambah Hobi' : 'Edit Hobi'}
        footer={<><button className="btn-cancel" onClick={() => setModal(null)}>Batal</button><button className="btn-save" onClick={save}>Simpan</button></>}>
        <div className="form-grid-2">
          <div className="field-group"><label>Nama (EN) *</label><input value={form.name_en} onChange={set('name_en')} placeholder="Running" /></div>
          <div className="field-group"><label>Nama (ID)</label><input value={form.name_id} onChange={set('name_id')} placeholder="Lari" /></div>
        </div>
        <div className="field-group"><label>Ikon (emoji)</label><input value={form.icon} onChange={set('icon')} style={{ maxWidth: 80, fontSize: '1.4rem' }} /></div>
        {layout === 'project-card' && <>
          <div className="field-group"><label>Deskripsi</label><textarea rows={2} value={form.desc} onChange={set('desc')} /></div>
          <div className="field-group"><label>URL Gambar</label><input value={form.image_url} onChange={set('image_url')} placeholder="https://..." /></div>
          <div className="form-grid-2">
            <div className="field-group"><label>Demo URL</label><input value={form.demo_url} onChange={set('demo_url')} /></div>
            <div className="field-group"><label>GitHub URL</label><input value={form.github_url} onChange={set('github_url')} /></div>
          </div>
        </>}
        <div className="field-group"><label>Urutan</label><input type="number" value={form.order} onChange={set('order')} min={0} style={{ maxWidth: 100 }} /></div>
        <label className="toggle-label">
          <input type="checkbox" checked={!form.hidden} onChange={e => setForm(f => ({ ...f, hidden: !e.target.checked }))} />
          <span className="toggle-check" />
          Tampilkan di halaman utama
        </label>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Hapus Hobi?" size="sm"
        footer={<><button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button><button className="btn-danger" onClick={() => { setHobbies(hobbies.filter(h => h.id !== confirm)); setConfirm(null); toast('Dihapus.'); }}>Hapus</button></>}>
        <p>Yakin ingin menghapus?</p>
      </Modal>
    </div>
  );
}
