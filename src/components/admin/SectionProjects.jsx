import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useToast } from '../../contexts/ToastContext';
import { genId } from '../../utils/storage';
import { ensureUrl, mediaKind, imageUrl } from '../../utils/url';
import Modal from '../ui/Modal';
import ImageUploadButton from './ImageUploadButton';

const EMPTY = {
  title: '', title_id: '', category: 'Professional', status: '',
  desc: '', desc_id: '', cover_image_url: '', preview_media_url: '', preview_media_type: 'auto',
  images: [], tags: '', demo_url: '', github_url: '', order: 0, featured: false, hidden: false,
  project_value: 0,
};

function uniqueUrls(urls) {
  const seen = new Set();
  return urls
    .map(url => (typeof url === 'string' ? url.trim() : ''))
    .filter(Boolean)
    .filter(url => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

function cleanMediaUrl(url) {
  const value = typeof url === 'string' ? url.trim() : '';
  return value ? ensureUrl(value) : '';
}

function normalizeProjectForForm(p = {}) {
  const legacyImages = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const cover = p.cover_image_url || p.image_url || legacyImages[0] || '';
  const gallery = p.cover_image_url
    ? legacyImages
    : legacyImages.filter(url => url !== cover);

  return {
    ...EMPTY,
    ...p,
    cover_image_url: cover,
    preview_media_url: p.preview_media_url || '',
    preview_media_type: p.preview_media_type || 'auto',
    images: uniqueUrls(gallery),
    tags: (p.tags || []).join(', '),
  };
}

export default function SectionProjects() {
  const { projects, setProjects } = useContent();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [galleryInput, setGalleryInput] = useState('');
  const [confirm, setConfirm] = useState(null);

  const sorted = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  function openAdd() {
    setForm({ ...EMPTY, order: projects.length });
    setGalleryInput('');
    setModal('add');
  }

  function openEdit(p) {
    setForm(normalizeProjectForForm(p));
    setGalleryInput('');
    setModal('edit');
  }

  function addGalleryImage() {
    const url = cleanMediaUrl(galleryInput);
    if (!url) return;
    setForm(f => ({ ...f, images: uniqueUrls([...(f.images || []), url]) }));
    setGalleryInput('');
  }

  function removeGalleryImage(i) {
    setForm(f => ({ ...f, images: (f.images || []).filter((_, idx) => idx !== i) }));
  }

  function moveGalleryImage(i, dir) {
    setForm(f => {
      const arr = [...(f.images || [])];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...f, images: arr };
    });
  }

  function save() {
    if (!form.title.trim()) { toast('Judul wajib diisi.', 'error'); return; }

    const cover = cleanMediaUrl(form.cover_image_url);
    const preview = cleanMediaUrl(form.preview_media_url);
    const gallery = uniqueUrls((form.images || []).map(cleanMediaUrl).filter(Boolean));
    const previewType = ['auto', 'image', 'video'].includes(form.preview_media_type) ? form.preview_media_type : 'auto';

    const item = {
      ...form,
      cover_image_url: cover,
      image_url: cover, // backward compatible untuk kode/data lama
      preview_media_url: preview,
      preview_media_type: previewType,
      images: gallery,
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
  const currentPreviewKind = mediaKind(form.preview_media_url, form.preview_media_type || 'auto', 'preview');

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
            {sorted.map((p, i) => {
              const cover = p.cover_image_url || p.image_url;
              const galleryCount = p.images?.length || 0;
              const previewKind = mediaKind(p.preview_media_url, p.preview_media_type || 'auto', 'preview');
              return (
                <div key={p.id} className="item-card">
                  <div className="item-actions" style={{ flexShrink: 0, marginRight: 4 }}>
                    <button className="btn-order" disabled={i === 0} onClick={() => move(p.id, -1)}>▲</button>
                    <button className="btn-order" disabled={i === sorted.length - 1} onClick={() => move(p.id, 1)}>▼</button>
                  </div>
                  <button type="button" className="item-info item-info-clickable" onClick={() => openEdit(p)} title="Klik untuk edit">
                    <div className="item-title">{p.title} {p.hidden ? <span className="badge-hidden">Hidden</span> : ''}</div>
                    <div className="item-sub">
                      {p.category} {p.status ? `· ${p.status}` : ''}
                      {cover ? ' · cover' : ''}
                      {p.preview_media_url ? ` · preview ${previewKind}` : ''}
                      {galleryCount > 0 ? ` · ${galleryCount} galeri` : ''}
                    </div>
                  </button>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-del" onClick={() => setConfirm(p.id)}>Hapus</button>
                  </div>
                </div>
              );
            })}
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
        <div className="form-grid-2">
          <div className="field-group">
            <label>Nilai Proyek (Angka saja, misal: 229000000000)</label>
            <input type="number" value={form.project_value || 0} onChange={set('project_value')} placeholder="0" />
            <span className="hint">Dalam IDR. Digunakan untuk statistik di Dashboard.</span>
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

        <div className="admin-media-box">
          <div className="field-group">
            <label>Cover Image / Gambar Utama</label>
            <div className="media-input-row">
              <input value={form.cover_image_url} onChange={set('cover_image_url')} placeholder="https://.../screenshot.webp" />
              <ImageUploadButton onUploaded={url => setForm(f => ({ ...f, cover_image_url: url }))} />
            </div>
            <span className="hint">Dipakai sebagai gambar utama di card project. Sebaiknya screenshot statis, bukan GIF.</span>
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label>Preview GIF / Video (opsional)</label>
              <input value={form.preview_media_url} onChange={set('preview_media_url')} placeholder="https://.../demo.gif atau demo.mp4" />
              <span className="hint">Muncul saat card di-hover. Untuk performa terbaik gunakan MP4/WebM pendek.</span>
            </div>
            <div className="field-group">
              <label>Jenis Preview</label>
              <select value={form.preview_media_type || 'auto'} onChange={set('preview_media_type')}>
                <option value="auto">Auto detect</option>
                <option value="image">GIF / Gambar</option>
                <option value="video">Video MP4/WebM</option>
              </select>
              <span className="hint">Saat ini terbaca sebagai: {currentPreviewKind}. Jika memakai link Google Drive MP4, pilih Video MP4/WebM agar lebih aman.</span>
            </div>
          </div>

          <div className="field-group">
            <label>Gallery Images / Screenshot Tambahan</label>
            <div className="media-input-row">
              <input value={galleryInput} onChange={e => setGalleryInput(e.target.value)} placeholder="https://..." />
              <button className="btn-save" onClick={addGalleryImage} style={{ padding: '9px 14px', fontSize: '.8rem' }}>Tambah</button>
              <ImageUploadButton onUploaded={url => setForm(f => ({ ...f, images: uniqueUrls([...(f.images || []), url]) }))} />
            </div>
            <span className="hint">Galeri akan tampil ketika gambar project diklik. Tambahkan screenshot fitur, bukan animasi terlalu berat.</span>
            {(form.images?.length || 0) > 0 && (
              <div className="media-url-list">
                {form.images.map((url, i) => (
                  <div key={`${url}-${i}`} className="media-url-item">
                    <span style={{ color: 'var(--text-3)', fontWeight: 600, marginRight: 6 }}>{i + 1}</span>
                    <img src={imageUrl(url)} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)', flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <button className="btn-order" disabled={i === 0} onClick={() => moveGalleryImage(i, -1)} title="Naik" style={{ padding: '3px 7px', fontSize: '.72rem' }}>▲</button>
                    <button className="btn-order" disabled={i === form.images.length - 1} onClick={() => moveGalleryImage(i, 1)} title="Turun" style={{ padding: '3px 7px', fontSize: '.72rem' }}>▼</button>
                    <button className="btn-del" onClick={() => removeGalleryImage(i)} style={{ padding: '3px 8px', fontSize: '.72rem' }}>Hapus</button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
        <label className="toggle-label">
          <input type="checkbox" checked={!form.hidden} onChange={e => setForm(f => ({ ...f, hidden: !e.target.checked }))} />
          <span className="toggle-check" />
          Tampilkan di halaman utama
        </label>
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
