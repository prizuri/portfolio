import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readData, writeData, KEYS, DEFAULT_SECTION_CONFIG, DEFAULT_CATEGORIES } from '../utils/storage';
import { isSupabaseConfigured, fetchContent } from '../utils/supabase';

const ContentContext = createContext(null);

function normalizeSections(value) {
  const input = Array.isArray(value) ? value : [];
  return DEFAULT_SECTION_CONFIG.map(def => {
    const saved = input.find(s => s?.id === def.id);
    return saved ? { ...def, ...saved } : { ...def };
  });
}

export function ContentProvider({ children }) {
  const [about,        setAboutRaw]   = useState(() => readData(KEYS.about));
  const [projects,     setProjectsRaw]= useState(() => readData(KEYS.projects) || []);
  const [experience,   setExpRaw]     = useState(() => readData(KEYS.experience) || []);
  const [skills,       setSkillsRaw]  = useState(() => readData(KEYS.skills) || []);
  const [education,    setEduRaw]     = useState(() => readData(KEYS.education) || []);
  const [hobbies,      setHobbiesRaw] = useState(() => readData(KEYS.hobbies) || []);
  const [publications, setPubsRaw]    = useState(() => readData(KEYS.publications) || []);
  const [sections,     setSectionsRaw]= useState(() => normalizeSections(readData(KEYS.sections)));
  const [categories,   setCategoriesRaw] = useState(() => readData(KEYS.categories) || DEFAULT_CATEGORIES);
  const [langSettings, setLangRaw]    = useState(() => readData(KEYS.lang) || { id_enabled: true });

  const save = useCallback((key, setter, val) => {
    writeData(key, val);
    setter(val);
  }, []);

  const setAbout       = v => save(KEYS.about,        setAboutRaw,   v);
  const setProjects    = v => save(KEYS.projects,     setProjectsRaw, v);
  const setExperience  = v => save(KEYS.experience,   setExpRaw,     v);
  const setSkills      = v => save(KEYS.skills,       setSkillsRaw,  v);
  const setEducation   = v => save(KEYS.education,    setEduRaw,     v);
  const setHobbies     = v => save(KEYS.hobbies,      setHobbiesRaw, v);
  const setPublications= v => save(KEYS.publications, setPubsRaw,    v);
  const setSections    = v => save(KEYS.sections,     setSectionsRaw, normalizeSections(v));
  const setCategories  = v => save(KEYS.categories,   setCategoriesRaw, v);
  const setLangSettings= v => save(KEYS.lang,         setLangRaw,    v);

  // Write a full content object into localStorage + state.
  const applyData = useCallback((data) => {
    if (data.about || data.cv) { const nextAbout = { ...(data.about || {}), cv_url: data.about?.cv_url || data.cv?.cv_url || '' }; writeData(KEYS.about, nextAbout); setAboutRaw(nextAbout); }
    if (data.projects)     { writeData(KEYS.projects,     data.projects);     setProjectsRaw(data.projects); }
    if (data.experience)   { writeData(KEYS.experience,   data.experience);   setExpRaw(data.experience); }
    if (data.skills)       { writeData(KEYS.skills,       data.skills);       setSkillsRaw(data.skills); }
    if (data.education)    { writeData(KEYS.education,    data.education);    setEduRaw(data.education); }
    if (data.hobbies)      { writeData(KEYS.hobbies,      data.hobbies);      setHobbiesRaw(data.hobbies); }
    if (data.publications) { writeData(KEYS.publications, data.publications); setPubsRaw(data.publications); }
    if (data.sections)     { const nextSections = normalizeSections(data.sections); writeData(KEYS.sections, nextSections); setSectionsRaw(nextSections); }
    if (data.categories)   { writeData(KEYS.categories,   data.categories);   setCategoriesRaw(data.categories); }
    if (data.lang_settings){ writeData(KEYS.lang,         data.lang_settings);setLangRaw(data.lang_settings); }
    writeData('ph_data_checksum', JSON.stringify(data));
  }, []);

  // Load the source of truth: Supabase if configured, else the bundled JSON.
  async function loadFromSource() {
    if (isSupabaseConfigured) {
      const remote = await fetchContent();
      // Ignore an empty/seed row so the bundled JSON can still bootstrap the site.
      if (remote && typeof remote === 'object' && Object.keys(remote).length > 0) return remote;
    }
    try {
      const r = await fetch(import.meta.env.BASE_URL + `data/content.json?t=${Date.now()}`, { cache: 'no-cache' });
      if (r.ok) { const j = await r.json(); if (j && typeof j === 'object') return j; }
    } catch {}
    return null;
  }

  const refreshFromSource = useCallback(async () => {
    try {
      const data = await loadFromSource();
      if (!data) return false;
      applyData(data);
      return true;
    } catch (e) {
      console.error('Failed to refresh data:', e);
      return false;
    }
  }, [applyData]);

  useEffect(() => {
    // cleanup old hash key
    if (readData('ph_content_hash') !== null) localStorage.removeItem('ph_content_hash');

    loadFromSource()
      .then(data => {
        if (!data) return;
        const stored  = readData('ph_data_checksum');
        const current = JSON.stringify(data);
        // If unchanged, keep local data (may hold unsaved admin edits).
        if (stored === current) return;
        applyData(data);
      })
      .catch(() => {});
  }, [applyData]);

  function getSectionConfig(id) {
    return sections.find(s => s.id === id) || DEFAULT_SECTION_CONFIG.find(s => s.id === id) || { visible: true };
  }

  function isSectionVisible(id) {
    return getSectionConfig(id).visible !== false;
  }

  return (
    <ContentContext.Provider value={{
      about, setAbout,
      projects, setProjects,
      experience, setExperience,
      skills, setSkills,
      education, setEducation,
      hobbies, setHobbies,
      publications, setPublications,
      sections, setSections,
      categories, setCategories,
      langSettings, setLangSettings,
      getSectionConfig, isSectionVisible,
      refreshFromSource,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
