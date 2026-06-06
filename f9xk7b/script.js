/* ═══════════════════════════════════════════
   ADMIN PANEL
   ═══════════════════════════════════════════ */

'use strict';

const MASTER_HASH = '44224633aacd52c42bc187876985b0fbcbea3efd00c2d8f7deb975672344541e';

// ─── STORAGE HELPERS ───────────────────────
const KEYS = {
  about:      'ph_about',
  projects:   'ph_projects',
  experience: 'ph_experience',
  skills:     'ph_skills',
  education:  'ph_education',
  settings:   'ph_lang_settings',
  session:    'ph_session'
};

function readData(key)       { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } }
function writeData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function genId()             { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ─── SHA-256 ───────────────────────────────
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── AUTH ──────────────────────────────────
function isLoggedIn() { return sessionStorage.getItem(KEYS.session) === '1'; }
function isSetupMode() { return !MASTER_HASH || MASTER_HASH === 'GANTI_DENGAN_HASH_ANDA'; }

function checkAuth() {
  const setup = isSetupMode();
  document.getElementById('setupBanner').style.display = setup ? '' : 'none';
  document.getElementById('loginSub').textContent = setup
    ? 'Setup diperlukan — generate hash password Anda di bawah.'
    : 'Portfolio Prizuri Hartadi';

  if (!setup && isLoggedIn()) {
    showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminApp').classList.add('hidden');
}

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminApp').classList.remove('hidden');
  loadDashboard();
  loadProjects();
  loadExperience();
  loadSkills();
  loadAbout();
  loadEducation();
  loadSettings();
  checkInitButton();
}

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const inputPass = document.getElementById('loginPassword').value;
  const err = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  err.textContent = '';

  if (isSetupMode()) {
    err.textContent = 'Setup belum selesai. Generate hash password Anda terlebih dahulu (lihat panduan di bawah).';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Memeriksa...';

  try {
    const hash = await sha256(inputPass);
    if (hash === MASTER_HASH) {
      sessionStorage.setItem(KEYS.session, '1');
      showApp();
    } else {
      err.textContent = 'Password salah.';
      btn.disabled = false;
      btn.textContent = 'Masuk';
    }
  } catch {
    err.textContent = 'Terjadi error. Coba lagi.';
    btn.disabled = false;
    btn.textContent = 'Masuk';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(KEYS.session);
  showLogin();
});

window.generateHashFor = async (pass) => sha256(pass);

// ─── HASH GENERATOR ────────────────────────
async function generateHash() {
  const pass = document.getElementById('hashGenInput').value;
  if (pass.length < 8) {
    document.getElementById('hashGenError').textContent = 'Password minimal 8 karakter untuk keamanan.';
    return;
  }
  document.getElementById('hashGenError').textContent = '';
  const hash = await sha256(pass);
  document.getElementById('hashGenResult').value = hash;
  document.getElementById('hashGenWrap').style.display = '';
}

function toggleForgot() {
  const panel = document.getElementById('forgotPanel');
  const btn   = document.getElementById('forgotBtn');
  const show  = panel.style.display === 'none';
  panel.style.display = show ? '' : 'none';
  btn.textContent = show ? 'Tutup' : 'Lupa password?';
}

function copyHash() {
  const el = document.getElementById('hashGenResult');
  el.select();
  navigator.clipboard.writeText(el.value)
    .then(() => {
      const btn = document.getElementById('copyHashBtn');
      btn.textContent = 'Disalin ✓';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    })
    .catch(() => document.execCommand('copy'));
}

// ─── NAVIGATION ────────────────────────────
function navigate(section) {
  document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('section' + capitalize(section)).classList.remove('hidden');
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  if (window.innerWidth <= 768) closeSidebar();
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); navigate(item.dataset.section); });
});
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }

// ─── TOAST ─────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3200);
}

// ─── MODAL HELPERS ─────────────────────────
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }

// ─── DASHBOARD ─────────────────────────────
function storageBytes() {
  let total = 0;
  for (const k in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, k))
      total += (k.length + (localStorage[k] || '').length) * 2;
  }
  return total;
}

function loadDashboard() {
  const projects   = readData(KEYS.projects)   || [];
  const experience = readData(KEYS.experience) || [];
  const skills     = readData(KEYS.skills)     || [];
  document.getElementById('statProjects').textContent   = projects.length;
  document.getElementById('statExperience').textContent = experience.length;
  document.getElementById('statSkills').textContent     = skills.length;

  const LIMIT = 5 * 1024 * 1024;
  const used  = storageBytes();
  const pct   = Math.min(100, (used / LIMIT) * 100).toFixed(1);
  const usedKB = (used / 1024).toFixed(0);
  document.getElementById('storageBar').style.width      = pct + '%';
  document.getElementById('storageBar').style.background = pct > 80 ? '#ef4444' : '';
  document.getElementById('storageText').textContent     = `${usedKB} KB / 5120 KB (${pct}%)`;

  const labels = { ph_projects:'Proyek', ph_experience:'Pengalaman', ph_skills:'Skill',
                   ph_about:'Tentang', ph_education:'Pendidikan', ph_lang_settings:'Pengaturan' };
  const rows = Object.entries(labels).map(([k, label]) => {
    const bytes = ((localStorage.getItem(k) || '').length) * 2;
    const kb = (bytes / 1024).toFixed(1);
    const hasB64 = (localStorage.getItem(k) || '').includes('"data:');
    return `<span>${label}: <strong>${kb} KB</strong>${hasB64 ? ' ⚠ ada gambar base64' : ''}</span>`;
  });
  document.getElementById('storageBreakdown').innerHTML = rows.join(' &nbsp;·&nbsp; ');
}

function cleanBase64() {
  if (!confirm('Semua gambar yang di-upload langsung (bukan URL) akan dihapus dari data. Lanjutkan?')) return;
  let freedBytes = 0;

  const projects = readData(KEYS.projects) || [];
  const cleanedProjects = projects.map(p => {
    const before = JSON.stringify(p).length;
    if ((p.image_url || '').startsWith('data:'))           p.image_url = '';
    if ((p.image_animated_url || '').startsWith('data:'))  p.image_animated_url = '';
    if (Array.isArray(p.images)) p.images = p.images.filter(u => !u.startsWith('data:'));
    freedBytes += (before - JSON.stringify(p).length) * 2;
    return p;
  });
  writeData(KEYS.projects, cleanedProjects);

  const about = readData(KEYS.about);
  if (about && (about.photo_url || '').startsWith('data:')) {
    freedBytes += about.photo_url.length * 2;
    about.photo_url = '';
    writeData(KEYS.about, about);
  }

  const freedKB = (freedBytes / 1024).toFixed(0);
  toast(`Selesai! ~${freedKB} KB dibebaskan. Isi ulang gambar dengan URL Imgur di masing-masing proyek.`);
  loadDashboard();
  loadProjects();
}

// ─── IMAGE HELPERS ─────────────────────────
function convertGDriveUrl(url) {
  if (!url) return url;
  // Already converted old lh3 format → switch to thumbnail
  const m0 = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m0) return `https://drive.google.com/thumbnail?id=${m0[1]}&sz=w1600`;
  if (!url.includes('drive.google.com')) return url;
  // /file/d/FILE_ID format
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return `https://drive.google.com/thumbnail?id=${m1[1]}&sz=w1600`;
  // ?id= or &id= format
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w1600`;
  return url;
}

async function fileToBase64(file, maxKB = 2048) {
  if (file.size > maxKB * 1024) {
    toast(`File terlalu besar (maks ${maxKB}KB). Gunakan URL saja.`, 'error');
    return null;
  }
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

// ─── ABOUT ─────────────────────────────────
const DEFAULT_BIO = {
  en: [
    "<p class=\"about-bio\">I am a Junior Structural Engineer with a Master's degree in Civil Engineering from <strong>Universitas Gadjah Mada</strong> (GPA 3.80/4.00). My background spans structural design, numerical analysis, and experimental testing — covering steel and reinforced concrete systems, structural assessment, and FEM simulation.</p>",
    "<p class=\"about-bio\">I have contributed to large-scale industrial projects — including a <strong>188 m and 192 m span arc dome steel structure worth IDR 229 billion</strong> — as well as building assessments, laboratory cyclic testing, and finite element modeling using Abaqus. I approach engineering problems by integrating what standards require, what structures actually do, and what practical response makes sense.</p>"
  ].join(""),
  id: [
    "<p class=\"about-bio\">Saya adalah Junior Structural Engineer dengan gelar Master di bidang Teknik Sipil dari <strong>Universitas Gadjah Mada</strong> (IPK 3,80/4,00). Latar belakang saya meliputi desain struktur, analisis numerik, dan pengujian eksperimental — mencakup sistem baja dan beton bertulang, penilaian struktural, dan simulasi FEM.</p>",
    "<p class=\"about-bio\">Saya telah berkontribusi pada proyek industri skala besar — termasuk <strong>struktur kubah baja bentang 188 m dan 192 m senilai Rp 229 miliar</strong> — serta penilaian bangunan, pengujian siklik laboratorium, dan pemodelan elemen hingga menggunakan Abaqus. Saya mendekati masalah teknik dengan mengintegrasikan apa yang disyaratkan standar, apa yang sebenarnya dilakukan struktur, dan respons praktis yang paling masuk akal.</p>"
  ].join("")
};

function resetBio(lang) {
  const id = lang === 'en' ? 'aboutBioEN' : 'aboutBioID';
  setValue(id, DEFAULT_BIO[lang]);
  toast('Teks default dimuat — klik Simpan Perubahan untuk menyimpan.');
}

function loadAbout() {
  const d = readData(KEYS.about);
  if (!d) return;
  setValue('aboutBioEN',    d.bio_en);
  setValue('aboutBioID',    d.bio_id);
  setValue('aboutLocation', d.location);
  setValue('aboutEmail',    d.email);
  setValue('aboutLinkedin', d.linkedin);
  setValue('aboutGithub',   d.github);
  setValue('aboutPhotoUrl', d.photo_url && !d.photo_url.startsWith('data:') ? d.photo_url : '');
  setValue('aboutCvUrl',    d.cv_url);
  if (d.photo_url) showPhotoPreview(d.photo_url);
}

document.getElementById('saveAboutBtn').addEventListener('click', async () => {
  const btn = document.getElementById('saveAboutBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    let photoUrl = getValue('aboutPhotoUrl');
    const photoFile = document.getElementById('photoFile').files[0];
    if (photoFile) {
      const b64 = await fileToBase64(photoFile, 1024);
      if (b64) photoUrl = b64;
    }
    writeData(KEYS.about, {
      bio_en:    getValue('aboutBioEN'),
      bio_id:    getValue('aboutBioID'),
      location:  getValue('aboutLocation'),
      email:     getValue('aboutEmail'),
      linkedin:  getValue('aboutLinkedin'),
      github:    getValue('aboutGithub'),
      photo_url: photoUrl,
      cv_url:    getValue('aboutCvUrl')
    });
    toast('Tentang Saya berhasil disimpan!');
    loadDashboard();
  } catch (err) { toast('Gagal: ' + err.message, 'error'); }
  btn.disabled = false; btn.textContent = 'Simpan Perubahan';
});

document.getElementById('photoFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  showPhotoPreview(URL.createObjectURL(file));
});
document.getElementById('aboutPhotoUrl').addEventListener('change', e => {
  const converted = convertGDriveUrl(e.target.value);
  if (converted !== e.target.value) {
    e.target.value = converted;
    toast('Link Google Drive dikonversi otomatis.', 'success');
  }
  if (converted) showPhotoPreview(converted);
});
function showPhotoPreview(url) {
  document.getElementById('photoPreview').innerHTML =
    `<img src="${url}" alt="Preview" onerror="this.style.display='none'" />`;
}

// ─── MULTI-IMAGE MANAGER ───────────────────
let projectImages = [];

function renderImageGrid() {
  const grid = document.getElementById('projectImagesGrid');
  if (!projectImages.length) {
    grid.innerHTML = '<div class="img-empty">Belum ada gambar</div>';
    return;
  }
  grid.innerHTML = projectImages.map((url, i) => `
    <div class="multi-img-item${i === 0 ? ' is-primary' : ''}">
      <img src="${convertGDriveUrl(url)}" alt="gambar ${i+1}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'"/>
      ${i === 0 ? '<span class="primary-badge">Utama</span>' : `<button class="img-set-primary" onclick="setPrimaryImage(${i})">★ Utama</button>`}
      <button class="img-remove" onclick="removeImage(${i})" title="Hapus gambar ini">×</button>
    </div>
  `).join('');
}


function addImageFromUrl() {
  const raw = document.getElementById('multiImgUrl').value.trim();
  if (!raw) { toast('Masukkan URL gambar', 'error'); return; }
  const url = convertGDriveUrl(raw);
  if (url !== raw) toast('Link Google Drive dikonversi otomatis ke URL gambar langsung.', 'success');
  projectImages.push(url);
  renderImageGrid();
  document.getElementById('multiImgUrl').value = '';
}

function removeImage(i) {
  projectImages.splice(i, 1);
  renderImageGrid();
}

function setPrimaryImage(i) {
  const [img] = projectImages.splice(i, 1);
  projectImages.unshift(img);
  renderImageGrid();
}

// ─── PROJECTS ──────────────────────────────
function loadProjects() {
  const projects = readData(KEYS.projects) || [];
  const list = document.getElementById('projectsList');
  if (!projects.length) {
    list.innerHTML = '<div class="empty-text">Belum ada proyek. Klik "+ Tambah Proyek".</div>';
    return;
  }
  const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  list.innerHTML = sorted.map(p => `
    <div class="item-card">
      ${p.image_url ? `<img src="${p.image_url}" style="width:60px;height:42px;object-fit:cover;border-radius:6px;flex-shrink:0" onerror="this.style.display='none'" />` : ''}
      <div class="item-card-main">
        <div class="item-card-title">${p.title_en || '(tanpa judul)'}</div>
        <div class="item-card-sub">${p.company || ''} ${p.date ? '· ' + p.date : ''}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
        ${p.featured ? '<span class="item-card-badge">Featured</span>' : ''}
        <div class="item-actions">
          <button class="btn-edit" onclick="editProject('${p.id}')">Edit</button>
          <button class="btn-del"  onclick="deleteItem('projects','${p.id}','proyek ini')">Hapus</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openProjectModal() {
  clearProjectForm();
  document.getElementById('projectModalTitle').textContent = 'Tambah Proyek';
  document.getElementById('saveProjectBtnText').textContent = 'Simpan Proyek';
  openModal('projectModal');
}

function clearProjectForm() {
  ['projectId','pTitleEN','pTitleID','pDescEN','pDescID','pCompany','pDate','pTools',
   'pDemoUrl','pGithubUrl','pImageAnimUrl','pVideoUrl','multiImgUrl'].forEach(id => setValue(id, ''));
  setValue('pOrder', '0');
  document.getElementById('pFeatured').checked = false;
  document.getElementById('pCategory').value = 'steel';
  document.querySelectorAll('input[name="videoType"]')[0].checked = true;
  document.getElementById('thumbAnimPreview').innerHTML = '<span>Belum ada animasi</span>';
  document.getElementById('videoPreviewWrap').classList.add('hidden');
  document.getElementById('thumbAnimFile').value = '';
  projectImages = [];
  renderImageGrid();
}

function editProject(id) {
  const projects = readData(KEYS.projects) || [];
  const p = projects.find(x => x.id === id);
  if (!p) return;
  clearProjectForm();
  document.getElementById('projectModalTitle').textContent = 'Edit Proyek';
  document.getElementById('saveProjectBtnText').textContent = 'Update Proyek';
  setValue('projectId',     id);
  setValue('pTitleEN',      p.title_en);
  setValue('pTitleID',      p.title_id);
  setValue('pDescEN',       p.desc_en);
  setValue('pDescID',       p.desc_id);
  setValue('pCompany',      p.company);
  setValue('pDate',         p.date);
  setValue('pTools',        (p.tools || []).join(', '));
  setValue('pDemoUrl',      p.demo_url   || '');
  setValue('pGithubUrl',    p.github_url || '');
  setValue('pImageAnimUrl', !p.image_animated_url?.startsWith('data:') ? p.image_animated_url : '');
  setValue('pVideoUrl',     p.video_url);
  setValue('pOrder',        p.order || 0);
  document.getElementById('pFeatured').checked = !!p.featured;
  document.getElementById('pCategory').value = p.category || 'steel';
  if (p.video_type) {
    const r = document.querySelector(`input[name="videoType"][value="${p.video_type}"]`);
    if (r) r.checked = true;
  }
  // Load existing images array, converting any legacy GDrive URLs
  projectImages = (p.images?.length ? [...p.images] : (p.image_url ? [p.image_url] : [])).map(convertGDriveUrl);
  renderImageGrid();
  if (p.image_animated_url) {
    const isVid = /\.(mp4|webm|ogg)$/i.test(p.image_animated_url);
    document.getElementById('thumbAnimPreview').innerHTML = isVid
      ? `<video src="${p.image_animated_url}" autoplay muted loop playsinline></video>`
      : `<img src="${p.image_animated_url}" />`;
  }
  openModal('projectModal');
}

async function saveProject() {
  const btn = document.getElementById('saveProjectBtn');
  btn.disabled = true;
  document.getElementById('saveProjectBtnText').textContent = 'Menyimpan...';
  try {
    let imageAnimUrl = getValue('pImageAnimUrl');
    const animFile = document.getElementById('thumbAnimFile').files[0];
    if (animFile) {
      if (animFile.type.startsWith('video/')) {
        toast('Video animasi harus pakai URL. Gunakan Google Drive atau hosting video.', 'error');
      } else {
        const b64 = await fileToBase64(animFile, 1024);
        if (b64) imageAnimUrl = b64;
      }
    }

    const data = {
      title_en:           getValue('pTitleEN'),
      title_id:           getValue('pTitleID'),
      desc_en:            getValue('pDescEN'),
      desc_id:            getValue('pDescID'),
      company:            getValue('pCompany'),
      date:               getValue('pDate'),
      tools:              getValue('pTools').split(',').map(s => s.trim()).filter(Boolean),
      demo_url:           getValue('pDemoUrl'),
      github_url:         getValue('pGithubUrl'),
      category:           document.getElementById('pCategory').value,
      featured:           document.getElementById('pFeatured').checked,
      order:              parseInt(getValue('pOrder')) || 0,
      images:             [...projectImages],
      image_url:          projectImages[0] || '',     // primary image (backwards compat)
      image_animated_url: imageAnimUrl,
      video_url:          getValue('pVideoUrl'),
      video_type:         document.querySelector('input[name="videoType"]:checked').value,
      updated_at:         Date.now()
    };

    const projects = readData(KEYS.projects) || [];
    const existingId = getValue('projectId');
    if (existingId) {
      const idx = projects.findIndex(p => p.id === existingId);
      if (idx !== -1) projects[idx] = { ...projects[idx], ...data };
      toast('Proyek berhasil diperbarui!');
    } else {
      data.id = genId();
      data.created_at = Date.now();
      projects.push(data);
      toast('Proyek berhasil ditambahkan!');
    }
    writeData(KEYS.projects, projects);
    closeModal('projectModal');
    loadProjects();
    loadDashboard();
  } catch (err) { toast('Gagal: ' + err.message, 'error'); }
  btn.disabled = false;
  document.getElementById('saveProjectBtnText').textContent = 'Simpan Proyek';
}

// Animated thumbnail preview
function previewThumb(type) {
  if (type !== 'anim') return;
  const file = document.getElementById('thumbAnimFile').files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const el  = document.getElementById('thumbAnimPreview');
  el.innerHTML = file.type.startsWith('video/')
    ? `<video src="${url}" autoplay muted loop playsinline></video>`
    : `<img src="${url}" />`;
}
function previewThumbUrl(type) {
  if (type !== 'anim') return;
  const url = getValue('pImageAnimUrl');
  if (!url) return;
  const el = document.getElementById('thumbAnimPreview');
  const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
  el.innerHTML = isVideo
    ? `<video src="${url}" autoplay muted loop playsinline></video>`
    : `<img src="${url}" onerror="this.parentElement.innerHTML='<span>URL tidak valid</span>'" />`;
}

// ─── EXPERIENCE ────────────────────────────
function loadExperience() {
  const list = document.getElementById('experienceList');
  const experience = readData(KEYS.experience) || [];
  if (!experience.length) {
    list.innerHTML = '<div class="empty-text">Belum ada pengalaman. Klik "+ Tambah Pengalaman".</div>';
    return;
  }
  const sorted = [...experience].sort((a, b) => (a.order || 0) - (b.order || 0));
  list.innerHTML = sorted.map(e => `
    <div class="item-card">
      <div class="item-card-main">
        <div class="item-card-title">${e.title_en || '(tanpa judul)'}</div>
        <div class="item-card-sub">${e.company || ''} · ${e.date_start || ''} ${e.date_end ? '– ' + e.date_end : ''}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editExperience('${e.id}')">Edit</button>
        <button class="btn-del"  onclick="deleteItem('experience','${e.id}','pengalaman ini')">Hapus</button>
      </div>
    </div>
  `).join('');
}

function openExpModal() {
  clearExpForm();
  document.getElementById('expModalTitle').textContent = 'Tambah Pengalaman';
  openModal('expModal');
}
function clearExpForm() {
  ['expId','eTitleEN','eTitleID','eCompany','eDateStart','eDateEnd','eBulletsEN','eBulletsID','eTools'].forEach(id => setValue(id, ''));
  setValue('eOrder', '0');
  document.getElementById('eCategory').value = 'steel';
}
function editExperience(id) {
  const experience = readData(KEYS.experience) || [];
  const e = experience.find(x => x.id === id);
  if (!e) return;
  clearExpForm();
  document.getElementById('expModalTitle').textContent = 'Edit Pengalaman';
  setValue('expId',      id);
  setValue('eTitleEN',   e.title_en);
  setValue('eTitleID',   e.title_id);
  setValue('eCompany',   e.company);
  setValue('eDateStart', e.date_start);
  setValue('eDateEnd',   e.date_end);
  setValue('eBulletsEN', (e.bullets_en || []).join('\n'));
  setValue('eBulletsID', (e.bullets_id || []).join('\n'));
  setValue('eTools',     (e.tools || []).join(', '));
  setValue('eOrder',     e.order || 0);
  document.getElementById('eCategory').value = e.category || 'steel';
  openModal('expModal');
}
function saveExperience() {
  try {
    const data = {
      title_en:   getValue('eTitleEN'),
      title_id:   getValue('eTitleID'),
      company:    getValue('eCompany'),
      date_start: getValue('eDateStart'),
      date_end:   getValue('eDateEnd'),
      bullets_en: getValue('eBulletsEN').split('\n').filter(Boolean),
      bullets_id: getValue('eBulletsID').split('\n').filter(Boolean),
      tools:      getValue('eTools').split(',').map(s => s.trim()).filter(Boolean),
      category:   document.getElementById('eCategory').value,
      order:      parseInt(getValue('eOrder')) || 0,
      updated_at: Date.now()
    };
    const experience = readData(KEYS.experience) || [];
    const id = getValue('expId');
    if (id) {
      const idx = experience.findIndex(e => e.id === id);
      if (idx !== -1) experience[idx] = { ...experience[idx], ...data };
      toast('Pengalaman berhasil diperbarui!');
    } else {
      data.id = genId(); data.created_at = Date.now();
      experience.push(data);
      toast('Pengalaman berhasil ditambahkan!');
    }
    writeData(KEYS.experience, experience);
    closeModal('expModal');
    loadExperience();
    loadDashboard();
  } catch (err) { toast('Gagal: ' + err.message, 'error'); }
}

// ─── SKILLS ────────────────────────────────
function loadSkills() {
  const list = document.getElementById('skillsList');
  const skills = readData(KEYS.skills) || [];
  if (!skills.length) {
    list.innerHTML = '<div class="empty-text">Belum ada skill. Klik "+ Tambah Kelompok".</div>';
    return;
  }
  const sorted = [...skills].sort((a, b) => (a.order || 0) - (b.order || 0));
  list.innerHTML = sorted.map(s => `
    <div class="item-card">
      <div class="item-card-main">
        <div class="item-card-title">${s.group_en || '(tanpa nama)'}</div>
        <div class="item-card-sub">${(s.items || []).join(' · ')}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editSkill('${s.id}')">Edit</button>
        <button class="btn-del"  onclick="deleteItem('skills','${s.id}','kelompok skill ini')">Hapus</button>
      </div>
    </div>
  `).join('');
}
function openSkillModal() {
  clearSkillForm();
  document.getElementById('skillModalTitle').textContent = 'Tambah Kelompok Skill';
  openModal('skillModal');
}
function clearSkillForm() {
  ['skillId','sGroupEN','sGroupID','sItems'].forEach(id => setValue(id, ''));
  setValue('sOrder', '0');
  document.getElementById('sType').value = 'standard';
}
function editSkill(id) {
  const skills = readData(KEYS.skills) || [];
  const s = skills.find(x => x.id === id);
  if (!s) return;
  clearSkillForm();
  document.getElementById('skillModalTitle').textContent = 'Edit Kelompok Skill';
  setValue('skillId',  id);
  setValue('sGroupEN', s.group_en);
  setValue('sGroupID', s.group_id);
  setValue('sItems',   (s.items || []).join(', '));
  setValue('sOrder',   s.order || 0);
  document.getElementById('sType').value = s.type || 'standard';
  openModal('skillModal');
}
function saveSkill() {
  try {
    const data = {
      group_en:   getValue('sGroupEN'),
      group_id:   getValue('sGroupID'),
      items:      getValue('sItems').split(',').map(s => s.trim()).filter(Boolean),
      type:       document.getElementById('sType').value,
      order:      parseInt(getValue('sOrder')) || 0,
      updated_at: Date.now()
    };
    const skills = readData(KEYS.skills) || [];
    const id = getValue('skillId');
    if (id) {
      const idx = skills.findIndex(s => s.id === id);
      if (idx !== -1) skills[idx] = { ...skills[idx], ...data };
      toast('Skill berhasil diperbarui!');
    } else {
      data.id = genId(); data.created_at = Date.now();
      skills.push(data);
      toast('Skill berhasil ditambahkan!');
    }
    writeData(KEYS.skills, skills);
    closeModal('skillModal');
    loadSkills();
    loadDashboard();
  } catch (err) { toast('Gagal: ' + err.message, 'error'); }
}

// ─── EDUCATION ─────────────────────────────
function loadEducation() {
  const list = document.getElementById('educationList');
  if (!list) return;
  const education = readData(KEYS.education) || [];
  if (!education.length) {
    list.innerHTML = '<div class="empty-text">Belum ada pendidikan. Klik "+ Tambah Pendidikan".</div>';
    return;
  }
  const sorted = [...education].sort((a, b) => (a.order || 0) - (b.order || 0));
  list.innerHTML = sorted.map(e => `
    <div class="item-card">
      <div class="item-card-main">
        <div class="item-card-title">${e.degree_en || '(tanpa judul)'}</div>
        <div class="item-card-sub">${e.university || ''}${e.year_start ? ' · ' + e.year_start + (e.year_end ? '–' + e.year_end : '') : ''}${e.gpa ? ' · GPA ' + e.gpa : ''}</div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" onclick="editEducation('${e.id}')">Edit</button>
        <button class="btn-del"  onclick="deleteItem('education','${e.id}','pendidikan ini')">Hapus</button>
      </div>
    </div>
  `).join('');
}

function openEduModal() {
  clearEduForm();
  document.getElementById('educationModalTitle').textContent = 'Tambah Pendidikan';
  openModal('educationModal');
}
function clearEduForm() {
  ['eduId','eduDegreeEN','eduDegreeID','eduUniversity','eduGpa','eduYearStart','eduYearEnd','eduIcon','eduThesisEN','eduThesisID'].forEach(id => setValue(id, ''));
  setValue('eduOrder', '0');
}
function editEducation(id) {
  const education = readData(KEYS.education) || [];
  const e = education.find(x => x.id === id);
  if (!e) return;
  clearEduForm();
  document.getElementById('educationModalTitle').textContent = 'Edit Pendidikan';
  setValue('eduId',         id);
  setValue('eduDegreeEN',   e.degree_en);
  setValue('eduDegreeID',   e.degree_id);
  setValue('eduUniversity', e.university);
  setValue('eduGpa',        e.gpa);
  setValue('eduYearStart',  e.year_start);
  setValue('eduYearEnd',    e.year_end);
  setValue('eduIcon',       e.icon);
  setValue('eduThesisEN',   e.thesis_en);
  setValue('eduThesisID',   e.thesis_id);
  setValue('eduOrder',      e.order || 0);
  openModal('educationModal');
}
function saveEducation() {
  try {
    const data = {
      degree_en:  getValue('eduDegreeEN'),
      degree_id:  getValue('eduDegreeID'),
      university: getValue('eduUniversity'),
      gpa:        getValue('eduGpa'),
      year_start: getValue('eduYearStart'),
      year_end:   getValue('eduYearEnd'),
      icon:       getValue('eduIcon'),
      thesis_en:  getValue('eduThesisEN'),
      thesis_id:  getValue('eduThesisID'),
      order:      parseInt(getValue('eduOrder')) || 0,
      updated_at: Date.now()
    };
    const education = readData(KEYS.education) || [];
    const id = getValue('eduId');
    if (id) {
      const idx = education.findIndex(e => e.id === id);
      if (idx !== -1) education[idx] = { ...education[idx], ...data };
      toast('Pendidikan berhasil diperbarui!');
    } else {
      data.id = genId(); data.created_at = Date.now();
      education.push(data);
      toast('Pendidikan berhasil ditambahkan!');
    }
    writeData(KEYS.education, education);
    closeModal('educationModal');
    loadEducation();
  } catch (err) { toast('Gagal: ' + err.message, 'error'); }
}

// ─── DELETE ────────────────────────────────
function deleteItem(collection, id, label) {
  document.getElementById('confirmText').textContent =
    `Yakin ingin menghapus ${label}? Tindakan tidak bisa dibatalkan.`;
  openModal('confirmModal');
  document.getElementById('confirmDeleteBtn').onclick = () => {
    const data = readData(KEYS[collection]) || [];
    writeData(KEYS[collection], data.filter(x => x.id !== id));
    toast('Berhasil dihapus.');
    closeModal('confirmModal');
    if (collection === 'projects')   { loadProjects();   loadDashboard(); }
    if (collection === 'experience') { loadExperience(); loadDashboard(); }
    if (collection === 'skills')     { loadSkills();     loadDashboard(); }
    if (collection === 'education')  { loadEducation(); }
  };
}

// ─── VIDEO PREVIEW ─────────────────────────
function previewVideo() {
  const url  = getValue('pVideoUrl');
  const type = document.querySelector('input[name="videoType"]:checked').value;
  if (!url || !type) return;
  const embedUrl = getEmbedUrl(url, type);
  if (!embedUrl) { toast('URL tidak valid', 'error'); return; }
  document.getElementById('videoPreviewFrame').src = embedUrl;
  document.getElementById('videoPreviewWrap').classList.remove('hidden');
}
function getEmbedUrl(url, type) {
  if (type === 'gdrive') {
    const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return `https://drive.google.com/file/d/${m2[1]}/preview`;
  }
  if (type === 'youtube') {
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

// ─── SETTINGS ──────────────────────────────
function loadSettings() {
  const s = readData(KEYS.settings) || { id_enabled: false };
  const cb = document.getElementById('settingIdEnabled');
  const st = document.getElementById('settingIdStatus');
  if (!cb) return;
  cb.checked = !!s.id_enabled;
  st.textContent = s.id_enabled ? 'Aktif' : 'Nonaktif';
}

function saveSettings() {
  const cb = document.getElementById('settingIdEnabled');
  const st = document.getElementById('settingIdStatus');
  const val = cb.checked;
  writeData(KEYS.settings, { id_enabled: val });
  st.textContent = val ? 'Aktif' : 'Nonaktif';
  toast(val ? 'Bahasa Indonesia diaktifkan.' : 'Bahasa Indonesia dinonaktifkan — website hanya tampil dalam Bahasa Inggris.');
}

// ─── EXPORT / IMPORT BACKUP ────────────────
document.getElementById('exportBtn').addEventListener('click', () => {
  const backup = {
    about:      readData(KEYS.about),
    projects:   readData(KEYS.projects),
    experience: readData(KEYS.experience),
    skills:     readData(KEYS.skills),
    education:  readData(KEYS.education),
    exported_at: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  toast('Backup berhasil diunduh!');
});

document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.projects)   writeData(KEYS.projects, data.projects);
      if (data.experience) writeData(KEYS.experience, data.experience);
      if (data.skills)     writeData(KEYS.skills, data.skills);
      if (data.about)      writeData(KEYS.about, data.about);
      if (data.education)  writeData(KEYS.education, data.education);
      loadDashboard(); loadProjects(); loadExperience(); loadSkills(); loadAbout(); loadEducation();
      toast('Backup berhasil diimpor!');
    } catch { toast('File tidak valid.', 'error'); }
    e.target.value = '';
  };
  reader.readAsText(file);
});

// Password tidak lagi dikelola dari dashboard.
// Untuk ganti password: generate hash baru di halaman login → update MASTER_HASH di admin/script.js → deploy ulang.

// ─── MODAL OVERLAY CLOSE ───────────────────
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay && overlay.id !== 'confirmModal') closeModal(overlay.id);
  });
});

// ─── DOM HELPERS ───────────────────────────
function getValue(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

// ─── DEFAULT DATA INITIALIZER ──────────────
function getDefaultData() {
  const now = Date.now();
  return {
    about: {
      bio_en: DEFAULT_BIO.en,
      bio_id: DEFAULT_BIO.id,
      location: "Medan, Indonesia",
      email: "prizurihartadi10@gmail.com",
      linkedin: "https://linkedin.com/in/prizurih/",
      github: "",
      photo_url: "",
      cv_url: ""
    },
    projects: [
      { id:'def_p1', title_en:'Coal Shed Arc Dome Structure', title_id:'Struktur Kubah Arc Dome Coal Shed',
        desc_en:'Design and analysis of 188 m and 192 m span arc dome steel structure. Analyzed global stability, load paths, member capacities, and soil-structure interaction (SSI) effects using SAP2000 with both fixed-support and SSI models.',
        desc_id:'Desain dan analisis struktur kubah baja bentang 188 m dan 192 m. Menganalisis stabilitas global, jalur beban, kapasitas elemen, dan efek interaksi tanah-struktur (SSI) menggunakan SAP2000 dengan model tumpuan tetap dan SSI.',
        company:'LKFT Universitas Gadjah Mada', date:'Nov 2025 – Apr 2026',
        tools:['SAP2000','SpColumn','SAFE','Python','AISC 360-16','AISC 341-16'],
        category:'steel', featured:true, order:0, images:[], image_url:'', image_animated_url:'', video_url:'', video_type:'gdrive', created_at:now, updated_at:now },
      { id:'def_p2', title_en:'Experimental Structural Testing', title_id:'Pengujian Struktural Eksperimental',
        desc_en:'Cyclic and monotonic testing of beam-column connections, portal frames, and full-scale modular steel housing. Generated hysteresis curves and analyzed structural performance per AISC 341-22.',
        desc_id:'Pengujian siklik dan monotonis sambungan beam-column, rangka portal, dan perumahan baja modular skala penuh. Menghasilkan kurva histeresis dan menganalisis kinerja struktural sesuai AISC 341-22.',
        company:'Universitas Gadjah Mada', date:'Dec 2023 – Jul 2025',
        tools:['DewesoftX','AISC 341-22','Excel'],
        category:'lab', featured:false, order:1, images:[], image_url:'', image_animated_url:'', video_url:'', video_type:'gdrive', created_at:now, updated_at:now },
      { id:'def_p3', title_en:'Numerical Modeling – Abaqus FEM', title_id:'Pemodelan Numerik – Abaqus FEM',
        desc_en:'Finite element models for cyclic and axial loading of steel connections (blind rivet, beam-column). Nonlinear static pushover and simulation validation against experimental results. Published on ResearchGate.',
        desc_id:'Model elemen hingga untuk pembebanan siklik dan aksial pada sambungan baja. Pushover statik nonlinier dan validasi simulasi terhadap hasil eksperimen. Dipublikasikan di ResearchGate.',
        company:'Universitas Gadjah Mada', date:'2024 – 2025',
        tools:['Abaqus','SAP2000','Python'],
        category:'research', featured:false, order:2, images:[], image_url:'', image_animated_url:'', video_url:'', video_type:'gdrive', created_at:now, updated_at:now },
      { id:'def_p4', title_en:'SLF Assessment – 29-Story Building', title_id:'Penilaian SLF – Gedung 29 Lantai',
        desc_en:'Structural evaluation supporting SLF (Occupancy Permit) certification. Field surveys, element measurements, deficiency identification, and technical recommendations for a high-rise hotel & office building.',
        desc_id:'Evaluasi struktural untuk sertifikasi SLF. Survei lapangan, pengukuran elemen, identifikasi kekurangan, dan rekomendasi teknis untuk gedung hotel & kantor bertingkat tinggi.',
        company:'CV Prasetyo', date:'Nov – Dec 2025',
        tools:['Site Survey','ETABS','Google Docs'],
        category:'assessment', featured:false, order:3, images:[], image_url:'', image_animated_url:'', video_url:'', video_type:'gdrive', created_at:now, updated_at:now }
    ],
    experience: [
      { id:'def_e1', title_en:'Structural Engineer – Coal Shed Arc Dome Structure Project',
        title_id:'Structural Engineer – Proyek Struktur Kubah Arc Dome Coal Shed',
        company:'LKFT Universitas Gadjah Mada · Pangkalan Susu, Indonesia',
        date_start:'Nov 2025', date_end:'Apr 2026',
        bullets_en:['Designed and analyzed a 188 m and 192 m span arc dome steel structure per SNI 1727:2020, SNI 1726:2019, SNI 2847:2019, AISC 360-16 and AISC 341-16.',
          'Evaluated global stability and load distribution using SAP2000.',
          'Conducted structural member verification: slenderness checks, deflection control, and capacity ratio.',
          'Coordinated with geotechnical, survey, and project management teams on constructability and compliance.',
          'Prepared structural calculation reports and technical documentation.'],
        bullets_id:['Merancang dan menganalisis struktur kubah baja bentang 188 m dan 192 m sesuai SNI 1727:2020, SNI 1726:2019, SNI 2847:2019, AISC 360-16 dan AISC 341-16.',
          'Mengevaluasi stabilitas global dan distribusi beban menggunakan SAP2000.',
          'Melakukan verifikasi elemen struktural: pengecekan kelangsingan, kontrol lendutan, dan rasio kapasitas.',
          'Berkoordinasi dengan tim geoteknik, survei, dan manajemen proyek.',
          'Menyiapkan laporan perhitungan struktural dan dokumentasi teknis.'],
        tools:['SAP2000','SpColumn','SAFE','Python','SNI 1726:2019','AISC 360-16','AISC 341-16'],
        category:'steel', order:0, created_at:now, updated_at:now },
      { id:'def_e2', title_en:'Assistant Structural Engineer – SLF / Occupancy Permit Assessment',
        title_id:'Asisten Structural Engineer – Penilaian SLF / Sertifikat Laik Fungsi',
        company:'CV Prasetyo · Medan, Indonesia',
        date_start:'Nov 2025', date_end:'Dec 2025',
        bullets_en:['Conducted structural evaluation supporting SLF certification of a 29-story building.',
          'Performed structural surveys, element measurements, and condition assessments.',
          'Identified structural deficiencies and prepared technical recommendations for structural safety.'],
        bullets_id:['Melakukan evaluasi struktural untuk sertifikasi SLF gedung 29 lantai.',
          'Melakukan survei struktur, pengukuran elemen, dan penilaian kondisi.',
          'Mengidentifikasi kekurangan struktural dan menyiapkan rekomendasi teknis.'],
        tools:['ETABS','Google Docs','Site Survey'],
        category:'assessment', order:1, created_at:now, updated_at:now },
      { id:'def_e3', title_en:'Laboratory Assistant – RISBA Beam–Column Cyclic Testing',
        title_id:'Asisten Laboratorium – Pengujian Siklik Beam–Column RISBA',
        company:'Universitas Gadjah Mada · Yogyakarta',
        date_start:'Jan 2025', date_end:'Jul 2025',
        bullets_en:['Developed riveted beam-column connection designs for modular steel housing systems.',
          'Conducted cyclic testing on four beam-column connection specimens per AISC 341-22.',
          'Developed finite element models using Abaqus to simulate behavior under cyclic loading.'],
        bullets_id:['Mengembangkan desain sambungan beam-column dengan rivet untuk perumahan baja modular.',
          'Melakukan pengujian siklik pada empat spesimen sambungan sesuai AISC 341-22.',
          'Mengembangkan model elemen hingga di Abaqus untuk mensimulasikan perilaku di bawah beban siklik.'],
        tools:['Abaqus','DewesoftX','AISC 341-22'],
        category:'lab', order:2, created_at:now, updated_at:now },
      { id:'def_e4', title_en:'Assistant Structural Engineer – Mosque Structural Evaluation',
        title_id:'Asisten Structural Engineer – Evaluasi Struktural Masjid',
        company:'Independent Project · Yogyakarta',
        date_start:'Nov 2024', date_end:'',
        bullets_en:['Conducted structural evaluation of a mosque building under construction per SNI 1726:2019, SNI 1727:2020, and SNI 2847:2019.',
          'Identified more than 20% of structural columns as non-compliant with design standards.',
          'Proposed structural retrofit strategy using reinforced concrete jacketing.'],
        bullets_id:['Melakukan evaluasi struktural masjid yang sedang konstruksi sesuai SNI 1726:2019, SNI 1727:2020, dan SNI 2847:2019.',
          'Mengidentifikasi lebih dari 20% kolom struktural tidak memenuhi standar desain.',
          'Mengusulkan strategi perkuatan menggunakan selimut beton bertulang (RC jacketing).'],
        tools:['ETABS','Excel','SNI 2847:2019'],
        category:'assessment', order:3, created_at:now, updated_at:now },
      { id:'def_e5', title_en:'Assistant Structural Engineer – Regional Health Laboratory Building',
        title_id:'Asisten Structural Engineer – Gedung Lab Kesehatan Daerah',
        company:'Independent Project · Remote',
        date_start:'Jul 2024', date_end:'',
        bullets_en:['Designed a two-story reinforced concrete laboratory building per SNI 1726:2019, SNI 1727:2020, and SNI 2847:2019.',
          'Performed structural analysis and prepared structural calculation report.'],
        bullets_id:['Merancang gedung laboratorium beton bertulang dua lantai sesuai SNI 1726:2019, SNI 1727:2020, dan SNI 2847:2019.',
          'Melakukan analisis struktural dan menyiapkan laporan perhitungan struktural.'],
        tools:['ETABS','Excel','SNI 1726:2019'],
        category:'design', order:4, created_at:now, updated_at:now },
      { id:'def_e6', title_en:'Laboratory Assistant – RISBA Portal Frame Cyclic Testing',
        title_id:'Asisten Laboratorium – Pengujian Siklik Rangka Portal RISBA',
        company:'Universitas Gadjah Mada · Yogyakarta',
        date_start:'Jan 2024', date_end:'Feb 2024',
        bullets_en:['Conducted cyclic testing of four portal frame configurations.',
          'Generated hysteresis curves and analyzed structural performance per AISC 341-22.'],
        bullets_id:['Melakukan pengujian siklik pada empat konfigurasi rangka portal.',
          'Menghasilkan kurva histeresis dan menganalisis kinerja struktural sesuai AISC 341-22.'],
        tools:['DewesoftX','Excel','AISC 341-22'],
        category:'lab', order:5, created_at:now, updated_at:now },
      { id:'def_e7', title_en:'Laboratory Assistant – Full-Scale RISBA Modular Steel Housing Test',
        title_id:'Asisten Laboratorium – Pengujian Skala Penuh Perumahan Baja Modular RISBA',
        company:'Universitas Gadjah Mada · Yogyakarta',
        date_start:'Dec 2023', date_end:'',
        bullets_en:['Supported instrumentation and monitoring of a full-scale modular steel housing test under cyclic and monotonic loading per AISC 341-22.',
          'Analyzed data for three wall configurations to evaluate global structural behavior.'],
        bullets_id:['Mendukung instrumentasi dan pemantauan pengujian skala penuh perumahan baja modular sesuai AISC 341-22.',
          'Menganalisis data untuk tiga konfigurasi dinding untuk mengevaluasi perilaku struktural global.'],
        tools:['DewesoftX','Excel','AISC 341-22'],
        category:'lab', order:6, created_at:now, updated_at:now },
      { id:'def_e8', title_en:'Assistant Structural Engineer – Office Building Structural Assessment',
        title_id:'Asisten Structural Engineer – Penilaian Struktural Gedung Kantor',
        company:'PT PLN UPDK Pandan · Central Tapanuli, Indonesia',
        date_start:'Dec 2020', date_end:'Jan 2021',
        bullets_en:['Evaluated performance of a 36-year-old office building per ASCE 41-17.',
          'Identified foundation settlement causing cracks in more than 50% of structural elements.',
          'Recommended retrofit strategies using steel bracing systems.'],
        bullets_id:['Mengevaluasi kinerja gedung kantor berusia 36 tahun sesuai ASCE 41-17.',
          'Mengidentifikasi penurunan pondasi yang menyebabkan retak pada lebih dari 50% elemen struktural.',
          'Merekomendasikan strategi perkuatan menggunakan sistem bresing baja.'],
        tools:['ETABS','ASCE 41-17','Excel'],
        category:'assessment', order:7, created_at:now, updated_at:now }
    ],
    skills: [
      { id:'def_s1', group_en:'Structural Analysis Software', group_id:'Software Analisis Struktur',
        items:['SAP2000','ETABS','Abaqus','SAFE','SpColumn'], type:'primary', order:0, created_at:now, updated_at:now },
      { id:'def_s2', group_en:'Design Standards', group_id:'Standar Desain',
        items:['SNI 1726:2019','SNI 1727:2020','SNI 2847:2019','AISC 360-16','AISC 341-16/22','ASCE 41-17'], type:'standard', order:1, created_at:now, updated_at:now },
      { id:'def_s3', group_en:'Programming & Tools', group_id:'Pemrograman & Alat',
        items:['Python','AutoCAD','MS Excel','MS Word','MS PowerPoint','DewesoftX'], type:'code', order:2, created_at:now, updated_at:now },
      { id:'def_s4', group_en:'Engineering Expertise', group_id:'Keahlian Teknik',
        items:['Structural Design','FEM Modeling','Experimental Testing','Structural Assessment','Retrofit Design','Technical Reporting'], type:'standard', order:3, created_at:now, updated_at:now }
    ],
    education: [
      { id:'def_ed1', degree_en:'Master of Civil Engineering', degree_id:'Magister Teknik Sipil',
        university:'Universitas Gadjah Mada', gpa:'3.80/4.00', year_start:'2023', year_end:'2025',
        icon:'M', thesis_en:'', thesis_id:'', order:0, created_at:now, updated_at:now },
      { id:'def_ed2', degree_en:'Bachelor of Civil Engineering', degree_id:'Sarjana Teknik Sipil',
        university:'Universitas Sumatera Utara', gpa:'3.53/4.00', year_start:'2018', year_end:'2022',
        icon:'B', thesis_en:'', thesis_id:'', order:1, created_at:now, updated_at:now }
    ]
  };
}

function initDefaultData() {
  const hasData = (readData(KEYS.projects)||[]).length + (readData(KEYS.experience)||[]).length + (readData(KEYS.skills)||[]).length;
  if (hasData && !confirm('Data sudah ada. Inisialisasi akan MENGGANTI semua data proyek, pengalaman, skill, dan pendidikan. Lanjutkan?')) return;
  const d = getDefaultData();
  writeData(KEYS.projects,   d.projects);
  writeData(KEYS.experience, d.experience);
  writeData(KEYS.skills,     d.skills);
  writeData(KEYS.education,  d.education);
  if (!readData(KEYS.about)) { writeData(KEYS.about, d.about); loadAbout(); }
  loadDashboard(); loadProjects(); loadExperience(); loadSkills(); loadEducation();
  toast('Data berhasil diinisialisasi! Sekarang tambahkan foto dan gambar proyek dari menu Edit.');
  checkInitButton();
}

function checkInitButton() {
  const hasData = (readData(KEYS.projects)||[]).length;
  const banner = document.getElementById('initBanner');
  if (banner) banner.style.display = hasData ? 'none' : '';
}

// ─── DOM HELPERS ───────────────────────────
function getValue(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

// ─── INIT ──────────────────────────────────
checkAuth();
