// Backward compatible: old data uses a single `category` string,
// new data uses a `categories` array.
export function getProjectCategories(p) {
  if (Array.isArray(p?.categories) && p.categories.length) return p.categories;
  if (p?.category) return [p.category];
  return [];
}
