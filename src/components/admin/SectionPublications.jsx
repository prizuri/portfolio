import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import Modal from '../ui/Modal';

const EMPTY = { title: '', title_id: '', authors: '', journal: '', year: '', doi: '', url: '', order: 0, hidden: false };

export default function SectionPublications() {
  const { publications, setPublications } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...publications].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function save() {
    if (!form.title.trim()) { toast('Judul wajib diisi.', 'error'); return; }
    const item = { ...form, updated_at: Date.now() };
    if (modal === 'add') setPublications([...publications, { id: genId(), created_at: Date.now(), ...item }]);
    else setPublications(publications.map(p => p.id === form.id ? { ...p, ...item } : p));
    setModal(null);
    toast('Publikasi disimpan!');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(p => p.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setPublications(arr.map((p, idx) => ({ ...p, order: idx })));
  }

  return (
    <div>
      <div className="page-header">
        <h2>Publikasi / Karya</h2>
        <button className="btn-save" onClick={() => { setForm({ ...EMPTY, order: publications.length }); setModal('add'); }}>+ Tambah</button>
      </div>
      <div className="info-panel" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <span style={{ fontSize: '.82rem', color: 'var(--text-2)' }}>
          Section ini tersembunyi secara default. Aktifkan di <strong>Tata Section</strong> jika sudah ada publikasi.
        </span>
      </div>
      {!sorted.length
        ? <div className="empty-state">Belum ada publikasi.</div>
        : <div className="items-list">
            {sorted.map((p, i) => (
              <div key={p.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(p.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(p.id, 1)}>▼</button>
                </div>
                <div className="item-info">
                  <div className="item-title">{p.title} {p.hidden ? <span className="badge-hidden">Hidden</span> : ''}</div>
                  <div className="item-sub">{p.journal} {p.year ? `· ${p.year}` : ''}</div>
                </div>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => { setForm({ ...EMPTY, ...p }); setModal('edit'); }}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(p.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
      }
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Tambah Publikasi' : 'Edit Publikasi'}
        footer={<><button className="btn-cancel" onClick={() => setModal(null)}>Batal</button><button className="btn-save" onClick={save}>Simpan</button></>}>
        <div className="field-group"><label>Judul (EN) *</label><input value={form.title} onChange={set('title')} /></div>
        <div className="field-group"><label>Judul (ID)</label><input value={form.title_id} onChange={set('title_id')} /></div>
        <div className="field-group"><label>Penulis</label><input value={form.authors} onChange={set('authors')} placeholder="Hartadi, P., et al." /></div>
        <div className="form-grid-2">
          <div className="field-group"><label>Jurnal / Prosiding</label><input value={form.journal} onChange={set('journal')} /></div>
          <div className="field-group"><label>Tahun</label><input value={form.year} onChange={set('year')} placeholder="2024" /></div>
        </div>
        <div className="form-grid-2">
          <div className="field-group"><label>DOI</label><input value={form.doi} onChange={set('doi')} placeholder="10.1234/..." /></div>
          <div className="field-group"><label>URL</label><input value={form.url} onChange={set('url')} /></div>
        </div>
        <label className="toggle-label">
          <input type="checkbox" checked={!form.hidden} onChange={e => setForm(f => ({ ...f, hidden: !e.target.checked }))} />
          <span className="toggle-check" />
          Tampilkan di halaman utama
        </label>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Hapus Publikasi?" size="sm"
        footer={<><button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button><button className="btn-danger" onClick={() => { setPublications(publications.filter(p => p.id !== confirm)); setConfirm(null); toast('Dihapus.'); }}>Hapus</button></>}>
        <p>Yakin ingin menghapus?</p>
      </Modal>
    </div>
  );
}
