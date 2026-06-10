import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, getSession, signOut } from '../utils/supabase';
import AdminLogin from '../components/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import SectionAbout from '../components/admin/SectionAbout';
import SectionProjects from '../components/admin/SectionProjects';
import SectionExperience from '../components/admin/SectionExperience';
import SectionSkills from '../components/admin/SectionSkills';
import SectionEducation from '../components/admin/SectionEducation';
import SectionHobbies from '../components/admin/SectionHobbies';
import SectionPublications from '../components/admin/SectionPublications';
import SectionSite from '../components/admin/SectionSite';
import SectionManager from '../components/admin/SectionManager';
import SectionSettings from '../components/admin/SectionSettings';

const SECTIONS = {
  dashboard:    Dashboard,
  site:         SectionSite,
  about:        SectionAbout,
  projects:     SectionProjects,
  experience:   SectionExperience,
  skills:       SectionSkills,
  education:    SectionEducation,
  hobbies:      SectionHobbies,
  publications: SectionPublications,
  sections:     SectionManager,
  settings:     SectionSettings,
};

function getSectionFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const section = parts[1] || 'dashboard';
  return SECTIONS[section] ? section : 'dashboard';
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() =>
    isSupabaseConfigured ? false : sessionStorage.getItem('ph_session') === '1'
  );
  const location = useLocation();
  const navigate = useNavigate();

  // With Supabase, trust the persisted auth session instead of sessionStorage.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getSession().then(s => setLoggedIn(!!s));
  }, []);

  const active = useMemo(() => getSectionFromPath(location.pathname), [location.pathname]);
  const Section = SECTIONS[active] || Dashboard;

  useEffect(() => {
    if (!loggedIn) return;
    const parts = location.pathname.split('/').filter(Boolean);
    const requested = parts[1];
    if (requested && !SECTIONS[requested]) navigate('/f9xk7b', { replace: true });
  }, [loggedIn, location.pathname, navigate]);

  function handleLogin() {
    if (!isSupabaseConfigured) sessionStorage.setItem('ph_session', '1');
    setLoggedIn(true);
  }

  function handleNavigate(sectionId) {
    navigate(sectionId === 'dashboard' ? '/f9xk7b' : `/f9xk7b/${sectionId}`);
  }

  function logout() {
    sessionStorage.removeItem('ph_session');
    if (isSupabaseConfigured) signOut();
    setLoggedIn(false);
    navigate('/f9xk7b', { replace: true });
  }

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;

  return (
    <AdminLayout active={active} onNavigate={handleNavigate} onLogout={logout}>
      <Section />
    </AdminLayout>
  );
}
