import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import Modal from '../ui/Modal';

const EMPTY = { name: '', name_id: '', category: '', order: 0, hidden: false };

export default function SectionSkills() {
  const { skills, setSkills } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...skills].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function save() {
    if (!form.name.trim()) { toast('Nama wajib diisi.', 'error'); return; }
    const item = { ...form, updated_at: Date.now() };
    if (modal === 'add') setSkills([...skills, { id: genId(), created_at: Date.now(), ...item }]);
    else setSkills(skills.map(s => s.id === form.id ? { ...s, ...item } : s));
    setModal(null);
    toast('Keahlian disimpan!');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(s => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setSkills(arr.map((s, idx) => ({ ...s, order: idx })));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Keahlian</h2>
        <button className="btn-save" onClick={() => { setForm({ ...EMPTY, order: skills.length }); setModal('add'); }}>+ Tambah</button>
      </div>
      {!sorted.length
        ? <div className="empty-state">Belum ada keahlian.</div>
        : <div className="items-list">
            {sorted.map((s, i) => (
              <div key={s.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(s.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(s.id, 1)}>▼</button>
                </div>
                <button type="button" className="item-info item-info-clickable" onClick={() => { setForm({ ...EMPTY, ...s }); setModal('edit'); }} title="Klik untuk edit">
                  <div className="item-title">{s.name} {s.hidden ? <span className="badge-hidden">Hidden</span> : ''}</div>
                  <div className="item-sub">{s.category || 'General'}</div>
                </button>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => { setForm({ ...EMPTY, ...s }); setModal('edit'); }}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(s.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Tambah Keahlian' : 'Edit Keahlian'} size="sm"
        footer={<><button className="btn-cancel" onClick={() => setModal(null)}>Batal</button><button className="btn-save" onClick={save}>Simpan</button></>}>
        <div className="field-group"><label>Nama (EN) *</label><input value={form.name} onChange={set('name')} placeholder="SAP2000" /></div>
        <div className="field-group"><label>Nama (ID)</label><input value={form.name_id} onChange={set('name_id')} /></div>
        <div className="field-group"><label>Kategori</label><input value={form.category} onChange={set('category')} placeholder="Structural Analysis" /></div>
        <div className="field-group"><label>Urutan</label><input type="number" value={form.order} onChange={set('order')} min={0} style={{ maxWidth: 100 }} /></div>
        <label className="toggle-label">
          <input type="checkbox" checked={!form.hidden} onChange={e => setForm(f => ({ ...f, hidden: !e.target.checked }))} />
          <span className="toggle-check" />
          Tampilkan di halaman utama
        </label>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Hapus Keahlian?" size="sm"
        footer={<><button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button><button className="btn-danger" onClick={() => { setSkills(skills.filter(s => s.id !== confirm)); setConfirm(null); toast('Dihapus.'); }}>Hapus</button></>}>
        <p>Yakin ingin menghapus?</p>
      </Modal>
    </div>
  );
}
