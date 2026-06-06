import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readData, writeData, KEYS, DEFAULT_SECTION_CONFIG } from '../utils/storage';

const ContentContext = createContext(null);

function make(key, initial = null) {
  return [readData(key) ?? initial, key];
}

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

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/content.json', { cache: 'no-cache' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !Object.keys(data).length) return;
        if (data.about)        { writeData(KEYS.about,        data.about);        setAboutRaw(data.about); }
        if (data.projects)     { writeData(KEYS.projects,     data.projects);     setProjectsRaw(data.projects); }
        if (data.experience)   { writeData(KEYS.experience,   data.experience);   setExpRaw(data.experience); }
        if (data.skills)       { writeData(KEYS.skills,       data.skills);       setSkillsRaw(data.skills); }
        if (data.education)    { writeData(KEYS.education,    data.education);    setEduRaw(data.education); }
        if (data.hobbies)      { writeData(KEYS.hobbies,      data.hobbies);      setHobbiesRaw(data.hobbies); }
        if (data.publications) { writeData(KEYS.publications, data.publications); setPubsRaw(data.publications); }
        if (data.sections)     { writeData(KEYS.sections,     data.sections);     setSectionsRaw(data.sections); }
        if (data.lang_settings){ writeData(KEYS.lang,         data.lang_settings);setLangRaw(data.lang_settings); }
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
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
