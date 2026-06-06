import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import Modal from '../ui/Modal';

const EMPTY = { title: '', title_id: '', company: '', year_start: '', year_end: '', desc: '', desc_id: '', icon: '', order: 0 };

export default function SectionExperience() {
  const { experience, setExperience } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...experience].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function openAdd() { setForm({ ...EMPTY, order: experience.length }); setModal('add'); }
  function openEdit(x) { setForm({ ...EMPTY, ...x }); setModal('edit'); }

  function save() {
    if (!form.title.trim()) { toast('Judul wajib diisi.', 'error'); return; }
    const item = { ...form, updated_at: Date.now() };
    if (modal === 'add') setExperience([...experience, { id: genId(), created_at: Date.now(), ...item }]);
    else setExperience(experience.map(x => x.id === form.id ? { ...x, ...item } : x));
    setModal(null);
    toast('Pengalaman disimpan!');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(x => x.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setExperience(arr.map((x, idx) => ({ ...x, order: idx })));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Pengalaman</h2>
        <button className="btn-save" onClick={openAdd}>+ Tambah</button>
      </div>
      {!sorted.length
        ? <div className="empty-state">Belum ada pengalaman.</div>
        : <div className="items-list">
            {sorted.map((x, i) => (
              <div key={x.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(x.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(x.id, 1)}>▼</button>
                </div>
                <div className="item-info">
                  <div className="item-title">{x.title}</div>
                  <div className="item-sub">{x.company} · {x.year_start}–{x.year_end || 'Skrg'}</div>
                </div>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => openEdit(x)}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(x.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Tambah Pengalaman' : 'Edit Pengalaman'}
        footer={<><button className="btn-cancel" onClick={() => setModal(null)}>Batal</button><button className="btn-save" onClick={save}>Simpan</button></>}>
        <div className="form-grid-2">
          <div className="field-group"><label>Jabatan (EN) *</label><input value={form.title} onChange={set('title')} /></div>
          <div className="field-group"><label>Jabatan (ID)</label><input value={form.title_id} onChange={set('title_id')} /></div>
        </div>
        <div className="field-group"><label>Perusahaan / Institusi</label><input value={form.company} onChange={set('company')} /></div>
        <div className="form-grid-3">
          <div className="field-group"><label>Tahun Mulai</label><input value={form.year_start} onChange={set('year_start')} placeholder="2023" /></div>
          <div className="field-group"><label>Tahun Selesai</label><input value={form.year_end} onChange={set('year_end')} placeholder="Sekarang" /></div>
          <div className="field-group"><label>Ikon (1 karakter)</label><input value={form.icon} onChange={set('icon')} maxLength={2} style={{ maxWidth: 60 }} /></div>
        </div>
        <div className="field-group"><label>Deskripsi (EN)</label><textarea rows={3} value={form.desc} onChange={set('desc')} /></div>
        <div className="field-group"><label>Deskripsi (ID)</label><textarea rows={3} value={form.desc_id} onChange={set('desc_id')} /></div>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Hapus Pengalaman?" size="sm"
        footer={<><button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button><button className="btn-danger" onClick={() => { setExperience(experience.filter(x => x.id !== confirm)); setConfirm(null); toast('Dihapus.'); }}>Hapus</button></>}>
        <p>Yakin ingin menghapus? Tidak bisa dibatalkan.</p>
      </Modal>
    </div>
  );
}
