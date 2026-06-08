export function ensureUrl(url) {
  if (!url) return '';
  const value = String(url).trim();
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : 'https://' + value;
}

export function imageUrl(url) {
  if (!url) return '';
  if (Array.isArray(url)) return imageUrl(url[0]);
  if (typeof url !== 'string') return '';
  const value = url.trim();
  const m = value.match(/\/file\/d\/([^/?#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  return value;
}

export function driveDownloadUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const value = url.trim();
  const m = value.match(/\/file\/d\/([^/?#]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  return value;
}

export function mediaUrl(url, kind = 'image') {
  if (!url) return '';
  if (kind === 'video') return driveDownloadUrl(url);
  return imageUrl(url);
}

export function mediaKind(url, explicit = 'auto') {
  if (explicit === 'image' || explicit === 'video') return explicit;
  if (!url || typeof url !== 'string') return 'image';
  const clean = url.split('?')[0].toLowerCase();
  return /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(clean) ? 'video' : 'image';
}
