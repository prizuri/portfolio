import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import { ensureUrl } from '../../utils/url';
import Modal from '../ui/Modal';

const EMPTY = {
  title: '', title_id: '', category: 'Professional', status: '',
  desc: '', desc_id: '', image_url: '', tags: '',
  demo_url: '', github_url: '', order: 0, featured: false,
};

export default function SectionProjects() {
  const { projects, setProjects } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  function openAdd() { setForm({ ...EMPTY, order: projects.length }); setModal('add'); }
  function openEdit(p) {
    setForm({ ...EMPTY, ...p, tags: (p.tags || []).join(', ') });
    setModal('edit');
  }

  function save() {
    if (!form.title.trim()) { toast('Judul wajib diisi.', 'error'); return; }
    const item = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      demo_url: ensureUrl(form.demo_url),
      github_url: ensureUrl(form.github_url),
      updated_at: Date.now(),
    };
    if (modal === 'add') {
      setProjects([...projects, { id: genId(), created_at: Date.now(), ...item }]);
    } else {
      setProjects(projects.map(p => p.id === form.id ? { ...p, ...item } : p));
    }
    setModal(null);
    toast('Proyek berhasil disimpan!');
  }

  function remove(id) {
    setProjects(projects.filter(p => p.id !== id));
    setConfirm(null);
    toast('Proyek dihapus.');
  }

  function move(id, dir) {
    const arr = [...sorted];
    const i = arr.findIndex(p => p.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setProjects(arr.map((p, idx) => ({ ...p, order: idx })));
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header">
        <h2>Proyek</h2>
        <button className="btn-save" onClick={openAdd}>+ Tambah</button>
      </div>

      {!sorted.length
        ? <div className="empty-state">Belum ada proyek. Klik + Tambah untuk mulai.</div>
        : (
          <div className="items-list">
            {sorted.map((p, i) => (
              <div key={p.id} className="item-card">
                <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                  <button className="btn-order" disabled={i === 0} onClick={() => move(p.id, -1)}>▲</button>
                  <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(p.id, 1)}>▼</button>
                </div>
                <div className="item-info">
                  <div className="item-title">{p.title}</div>
                  <div className="item-sub">{p.category} {p.status ? `· ${p.status}` : ''}</div>
                </div>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn-del" onClick={() => setConfirm(p.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Tambah Proyek' : 'Edit Proyek'}
        size="lg"
        footer={
          <>
            <button className="btn-cancel" onClick={() => setModal(null)}>Batal</button>
            <button className="btn-save" onClick={save}>Simpan</button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="field-group">
            <label>Judul (EN) *</label>
            <input value={form.title} onChange={set('title')} placeholder="SLF Assessment System" />
          </div>
          <div className="field-group">
            <label>Judul (ID)</label>
            <input value={form.title_id} onChange={set('title_id')} placeholder="Sistem Penilaian SLF" />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="field-group">
            <label>Kategori</label>
            <select value={form.category} onChange={set('category')}>
              <option>Professional</option>
              <option>Academic</option>
              <option>Personal</option>
            </select>
          </div>
          <div className="field-group">
            <label>Status</label>
            <input value={form.status} onChange={set('status')} placeholder="Completed / In Progress" />
          </div>
        </div>
        <div className="field-group">
          <label>Deskripsi (EN)</label>
          <textarea rows={3} value={form.desc} onChange={set('desc')} />
        </div>
        <div className="field-group">
          <label>Deskripsi (ID)</label>
          <textarea rows={3} value={form.desc_id} onChange={set('desc_id')} />
        </div>
        <div className="field-group">
          <label>URL Gambar</label>
          <input value={form.image_url} onChange={set('image_url')} placeholder="https://prizuri.github.io/portfolio/img/project.jpg" />
          <span className="hint">Upload ke public/img/ di GitHub repo</span>
        </div>
        <div className="field-group">
          <label>Tags (pisah koma)</label>
          <input value={form.tags} onChange={set('tags')} placeholder="Python, SAP2000, React" />
        </div>
        <div className="form-grid-2">
          <div className="field-group">
            <label>Demo URL</label>
            <input value={form.demo_url} onChange={set('demo_url')} placeholder="https://project.vercel.app" />
          </div>
          <div className="field-group">
            <label>GitHub URL</label>
            <input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/user/repo" />
          </div>
        </div>
        <div className="field-group">
          <label>Urutan (0 = paling atas)</label>
          <input type="number" value={form.order} onChange={set('order')} min={0} style={{ maxWidth: 100 }} />
        </div>
      </Modal>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Hapus Proyek?"
        size="sm"
        footer={
          <>
            <button className="btn-cancel" onClick={() => setConfirm(null)}>Batal</button>
            <button className="btn-danger" onClick={() => remove(confirm)}>Hapus</button>
          </>
        }
      >
        <p>Yakin ingin menghapus proyek ini? Tidak bisa dibatalkan.</p>
      </Modal>
    </div>
  );
}
