export function ensureUrl(url) {
  if (!url) return '';
  const value = String(url).trim();
  if (!value) return '';
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(value)) return value;
  // Relative project assets such as images/projects/demo.webp should stay relative.
  if (/^(images|assets|img|data)\//i.test(value)) return value;
  return 'https://' + value;
}

export function googleDriveId(url) {
  if (!url || typeof url !== 'string') return '';
  const value = url.trim();
  const patterns = [
    /\/file\/d\/([^/?#]+)/i,
    /[?&]id=([^&#]+)/i,
    /\/d\/([^/?#]+)/i,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return '';
}

export function googleDriveResourceKey(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url.trim());
    return parsed.searchParams.get('resourcekey') || '';
  } catch {
    const match = url.match(/[?&]resourcekey=([^&#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : '';
  }
}

function driveResourceSuffix(url, separator = '&') {
  const resourceKey = googleDriveResourceKey(url);
  return resourceKey ? `${separator}resourcekey=${encodeURIComponent(resourceKey)}` : '';
}

export function isGoogleDriveFileUrl(url) {
  return Boolean(googleDriveId(url)) && /drive\.google\.com|googleusercontent\.com/i.test(String(url || ''));
}

export function imageUrls(url) {
  if (!url) return [];
  if (Array.isArray(url)) return imageUrls(url[0]);
  if (typeof url !== 'string') return [];
  const value = url.trim();
  if (!value) return [];

  const id = googleDriveId(value);
  if (id && /drive\.google\.com/i.test(value)) {
    const rkAmp = driveResourceSuffix(value, '&');
    const rkQuery = driveResourceSuffix(value, '?');
    return [
      `https://drive.google.com/thumbnail?id=${id}&sz=w2000${rkAmp}`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w1600${rkAmp}`,
      `https://lh3.googleusercontent.com/d/${id}=w2000`,
      `https://lh3.googleusercontent.com/d/${id}=w1600`,
      `https://lh3.googleusercontent.com/d/${id}`,
      `https://drive.google.com/uc?export=view&id=${id}${rkAmp}`,
      `https://drive.google.com/uc?export=download&id=${id}${rkAmp}`,
      `https://drive.google.com/file/d/${id}/preview${rkQuery}`,
      value,
    ];
  }

  return [value];
}

export function imageUrl(url) {
  return imageUrls(url)[0] || '';
}

export function driveDownloadUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const value = url.trim();
  const id = googleDriveId(value);
  if (id && /drive\.google\.com/i.test(value)) {
    return `https://drive.google.com/uc?export=download&id=${id}${driveResourceSuffix(value, '&')}`;
  }
  return value;
}

export function googleDriveEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const value = url.trim();
  const id = googleDriveId(value);
  if (id && /drive\.google\.com/i.test(value)) {
    return `https://drive.google.com/file/d/${id}/preview${driveResourceSuffix(value, '?')}`;
  }
  return '';
}

export function isDirectVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const value = url.trim();
  if (!value || isGoogleDriveFileUrl(value)) return false;
  const clean = value.split('?')[0].toLowerCase();
  return /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(clean) || /^blob:/i.test(value) || /^data:video\//i.test(value);
}

export function mediaUrl(url, kind = 'image') {
  if (!url) return '';
  if (kind === 'video') return driveDownloadUrl(url);
  return imageUrl(url);
}

export function mediaKind(url, explicit = 'auto', context = 'default') {
  if (explicit === 'image' || explicit === 'video') return explicit;
  if (!url || typeof url !== 'string') return 'image';
  const clean = url.split('?')[0].toLowerCase();
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(clean)) return 'video';
  if (/\.(gif|png|jpe?g|webp|avif|svg)$/i.test(clean)) return 'image';

  // Google Drive preview links usually do not expose an extension. In the preview
  // field, a Drive link is commonly a video demo, so auto mode treats it as video.
  if (context === 'preview' && isGoogleDriveFileUrl(url)) return 'video';

  return 'image';
}
