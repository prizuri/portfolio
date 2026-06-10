import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When env vars are missing (e.g. before setup), the app falls back to the
// legacy content.json + password-hash flow so nothing breaks.
export const isSupabaseConfigured = Boolean(url && anon);

export const supabase = isSupabaseConfigured ? createClient(url, anon) : null;

export const CONTENT_ROW_ID = 1;
export const IMAGE_BUCKET   = 'portfolio-images';

// --- Content ---------------------------------------------------------------

export async function fetchContent() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', CONTENT_ROW_ID)
    .maybeSingle();
  if (error) { console.error('Supabase fetchContent:', error.message); return null; }
  return data?.data ?? null;
}

export async function saveContent(payload) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: CONTENT_ROW_ID, data: payload, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  return true;
}

// --- Image upload ----------------------------------------------------------

export async function uploadImage(file) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `uploads/${name}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// --- Auth ------------------------------------------------------------------

export async function signIn(email, password) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data.session;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
