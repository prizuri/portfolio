import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import Modal from '../ui/Modal';

const EMPTY = { degree_en: '', degree_id: '', university: '', gpa: '', year_start: '', year_end: '', thesis_en: '', thesis_id: '', icon: 'M', order: 0, hidden: false };

export default function SectionEducation() {
  const { education, setEducation } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...education].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function save() {
    if (!form.degree_en.trim()) { toast('Gelar (EN) wajib diisi.', 'error'); return; }
    const item = { ...form, updated_at: Date.now() };
    if (modal === 'add') setEducation([...education, { id: genId(), created_at: Date.now(), ...item }]);
    else setEducation(education.map(e => e.id === form.id ? { ...e, ...item } : e));
    setModal(null);
    toast('Pendidikan disimpan!');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(e => e.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setEducation(arr.map((e, idx) => ({ ...e, order: idx })));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Pendidikan</h2>
        <button className="btn-save" onClick={() => { setForm({ ...EMPTY, order: education.length }); setModal('add'); }}>+ Tambah</button>
      </div>
      {!sorted.length
        ? <div className="empty-state">Belum ada data pendidikan.</div>
        : <div className="items-list">
            {sorted.map((e, i) => (
              <div key={e.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(e.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(e.id, 1)}>▼</button>
                </div>
                <button type="button" className="item-info item-info-clickable" onClick={() => { setForm({ ...EMPTY, ...e }); setModal('edit'); }} title="Klik untuk edit">
                  <div className="item-title">{e.degree_en} {e.hidden ? <span className="badge-hidden">Hidden</span> : ''}</div>
                  <div className="item-sub">{e.university} · {e.year_start}–{e.year_end}</div>
                </button>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => { setForm({ ...EMPTY, ...e }); setModal('edit'); }}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(e.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Tambah Pendidikan' : 'Edit Pendidikan'}
        footer={<><button className="btn-cancel" onClick={() => setModal(null)}>Batal</button><button className="btn-save" onClick={save}>Simpan</button></>}>
        <div className="form-grid-2">
          <div className="field-group"><label>Gelar / Program (EN) *</label><input value={form.degree_en} onChange={set('degree_en')} placeholder="Master of Civil Engineering" /></div>
          <div className="field-group"><label>Gelar / Program (ID)</label><input value={form.degree_id} onChange={set('degree_id')} placeholder="Magister Teknik Sipil" /></div>
        </div>
        <div className="field-group"><label>Universitas / Institusi</label><input value={form.university} onChange={set('university')} /></div>
        <div className="form-grid-3">
          <div className="field-group"><label>IPK / GPA</label><input value={form.gpa} onChange={set('gpa')} placeholder="3.80/4.00" /></div>
          <div className="field-group"><label>Tahun Mulai</label><input value={form.year_start} onChange={set('year_start')} placeholder="2023" /></div>
          <div className="field-group"><label>Tahun Selesai</label><input value={form.year_end} onChange={set('year_end')} placeholder="2025" /></div>
        </div>
        <div className="form-grid-2">
          <div className="field-group"><label>Tesis / Skripsi (EN)</label><textarea rows={2} value={form.thesis_en} onChange={set('thesis_en')} /></div>
          <div className="field-group"><label>Tesis / Skripsi (ID)</label><textarea rows={2} value={form.thesis_id} onChange={set('thesis_id')} /></div>
        </div>
        <div className="field-group"><label>Ikon (M = Master, B = Bachelor)</label><input value={form.icon} onChange={set('icon')} maxLength={2} style={{ maxWidth: 60 }} /></div>
        <label className="toggle-label">
          <input type="checkbox" checked={!form.hidden} onChange={e => setForm(f => ({ ...f, hidden: !e.target.checked }))} />
          <span className="toggle-check" />
          Tampilkan di halaman utama
        </label>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Hapus Pendidikan?" size="sm"
        footer={<><button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button><button className="btn-danger" onClick={() => { setEducation(education.filter(e => e.id !== confirm)); setConfirm(null); toast('Dihapus.'); }}>Hapus</button></>}>
        <p>Yakin ingin menghapus?</p>
      </Modal>
    </div>
  );
}
