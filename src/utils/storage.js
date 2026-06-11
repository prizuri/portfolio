export const KEYS = {
  about:     'ph_about',
  projects:  'ph_projects',
  experience:'ph_experience',
  skills:    'ph_skills',
  education: 'ph_education',
  hobbies:   'ph_hobbies',
  publications: 'ph_publications',
  sections:  'ph_section_config',
  categories:'ph_categories',
  lang:      'ph_lang_settings',
  session:   'ph_session',
};

export const DEFAULT_CATEGORIES = ['Professional', 'Academic', 'Personal'];

export function readData(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

export function writeData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const DEFAULT_SECTION_CONFIG = [
  { id: 'about',        visible: true  },
  { id: 'projects',     visible: true  },
  { id: 'experience',   visible: true  },
  { id: 'skills',       visible: true  },
  { id: 'education',    visible: true  },
  { id: 'hobbies',      visible: true,  layout: 'chip' },
  { id: 'publications', visible: false, layout: 'list' },
  { id: 'contact',      visible: true  },
];
