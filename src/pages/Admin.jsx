import { useState } from 'react';
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
import SectionManager from '../components/admin/SectionManager';
import SectionSettings from '../components/admin/SectionSettings';

const SECTIONS = {
  dashboard:    Dashboard,
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

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('ph_session') === '1');
  const [active, setActive] = useState('dashboard');

  function logout() {
    sessionStorage.removeItem('ph_session');
    setLoggedIn(false);
  }

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const Section = SECTIONS[active] || Dashboard;

  return (
    <AdminLayout active={active} onNavigate={setActive} onLogout={logout}>
      <Section />
    </AdminLayout>
  );
}
