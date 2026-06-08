import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readData, writeData, KEYS, DEFAULT_SECTION_CONFIG } from '../utils/storage';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [about,        setAboutRaw]   = useState(() => readData(KEYS.about));
  const [projects,     setProjectsRaw]= useState(() => readData(KEYS.projects) || []);
  const [experience,   setExpRaw]     = useState(() => readData(KEYS.experience) || []);
  const [skills,       setSkillsRaw]  = useState(() => readData(KEYS.skills) || []);
  const [education,    setEduRaw]     = useState(() => readData(KEYS.education) || []);
  const [hobbies,      setHobbiesRaw] = useState(() => readData(KEYS.hobbies) || []);
  const [publications, setPubsRaw]    = useState(() => readData(KEYS.publications) || []);
  const [sections,     setSectionsRaw]= useState(() => readData(KEYS.sections) || DEFAULT_SECTION_CONFIG);
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
  const setSections    = v => save(KEYS.sections,     setSectionsRaw,v);
  const setLangSettings= v => save(KEYS.lang,         setLangRaw,    v);

  const refreshFromSource = useCallback(async () => {
    try {
      const r = await fetch(import.meta.env.BASE_URL + `data/content.json?t=${Date.now()}`, { cache: 'no-cache' });
      if (!r.ok) return;
      const data = await r.json();
      if (!data || typeof data !== 'object') return;

      const current = JSON.stringify(data);
      
      if (data.about)        { writeData(KEYS.about,        data.about);        setAboutRaw(data.about); }
      if (data.projects)     { writeData(KEYS.projects,     data.projects);     setProjectsRaw(data.projects); }
      if (data.experience)   { writeData(KEYS.experience,   data.experience);   setExpRaw(data.experience); }
      if (data.skills)       { writeData(KEYS.skills,       data.skills);       setSkillsRaw(data.skills); }
      if (data.education)    { writeData(KEYS.education,    data.education);    setEduRaw(data.education); }
      if (data.hobbies)      { writeData(KEYS.hobbies,      data.hobbies);      setHobbiesRaw(data.hobbies); }
      if (data.publications) { writeData(KEYS.publications, data.publications); setPubsRaw(data.publications); }
      if (data.sections)     { writeData(KEYS.sections,     data.sections);     setSectionsRaw(data.sections); }
      if (data.lang_settings){ writeData(KEYS.lang,         data.lang_settings);setLangRaw(data.lang_settings); }

      writeData('ph_data_checksum', current);
      return true;
    } catch (e) {
      console.error('Failed to refresh data:', e);
      return false;
    }
  }, []);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + `data/content.json?t=${Date.now()}`, { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || typeof data !== 'object') return;

        // cleanup old hash key
        if (readData('ph_content_hash') !== null) localStorage.removeItem('ph_content_hash');

        const stored = readData('ph_data_checksum');
        const current = JSON.stringify(data);
        
        // If checksum matches, we keep the local data (which might have unsaved admin edits)
        if (stored === current) return;

        // Otherwise, update local storage with server truth
        if (data.about)        { writeData(KEYS.about,        data.about);        setAboutRaw(data.about); }
        if (data.projects)     { writeData(KEYS.projects,     data.projects);     setProjectsRaw(data.projects); }
        if (data.experience)   { writeData(KEYS.experience,   data.experience);   setExpRaw(data.experience); }
        if (data.skills)       { writeData(KEYS.skills,       data.skills);       setSkillsRaw(data.skills); }
        if (data.education)    { writeData(KEYS.education,    data.education);    setEduRaw(data.education); }
        if (data.hobbies)      { writeData(KEYS.hobbies,      data.hobbies);      setHobbiesRaw(data.hobbies); }
        if (data.publications) { writeData(KEYS.publications, data.publications); setPubsRaw(data.publications); }
        if (data.sections)     { writeData(KEYS.sections,     data.sections);     setSectionsRaw(data.sections); }
        if (data.lang_settings){ writeData(KEYS.lang,         data.lang_settings);setLangRaw(data.lang_settings); }

        writeData('ph_data_checksum', current);
      })
      .catch(() => {});
  }, []);

  function getSectionConfig(id) {
    return sections.find(s => s.id === id) || { visible: true };
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
