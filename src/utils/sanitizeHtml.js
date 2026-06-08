const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
  'span', 'a', 'h3', 'h4', 'blockquote'
]);

const ALLOWED_ATTRS = {
  a: new Set(['href', 'target', 'rel']),
};

function isSafeUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeHtml(html = '') {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';
  if (typeof html !== 'string') return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');

  function cleanNode(node) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) continue;

      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        continue;
      }

      const tag = child.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }

      for (const attr of Array.from(child.attributes)) {
        const attrName = attr.name.toLowerCase();
        const allowedForTag = ALLOWED_ATTRS[tag];
        const isAllowed = allowedForTag?.has(attrName);

        if (!isAllowed) {
          child.removeAttribute(attr.name);
          continue;
        }

        if (attrName === 'href' && !isSafeUrl(attr.value)) {
          child.removeAttribute(attr.name);
        }
      }

      if (tag === 'a') {
        child.setAttribute('rel', 'noopener noreferrer');
        if (child.getAttribute('target') === '_blank') {
          child.setAttribute('target', '_blank');
        }
      }

      cleanNode(child);
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
