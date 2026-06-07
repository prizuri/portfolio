export function ensureUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : 'https://' + url;
}

export function imageUrl(url) {
  if (!url) return '';
  if (Array.isArray(url)) return imageUrl(url[0]);
  if (typeof url !== 'string') return '';
  const m = url.match(/\/file\/d\/([^/?#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  return url;
}
