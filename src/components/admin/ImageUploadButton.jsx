import { useRef, useState } from 'react';
import { isSupabaseConfigured, uploadImage } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';

// Renders an "Upload" button that pushes a file to Supabase Storage and returns
// the public URL via onUploaded(url). Hidden when Supabase is not configured.
export default function ImageUploadButton({ onUploaded, label = '⬆ Upload' }) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) return null;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('File harus berupa gambar.', 'error'); return; }
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
      toast('Gambar berhasil diupload!');
    } catch (err) {
      toast(`Gagal upload: ${err.message}`, 'error');
    }
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        className="btn-outline btn-sm"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        style={{ padding: '9px 14px', fontSize: '.8rem', whiteSpace: 'nowrap' }}
      >
        {busy ? 'Mengupload...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </>
  );
}
