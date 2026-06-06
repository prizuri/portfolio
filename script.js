/* ═══════════════════════════════════════════
   PRIZURI HARTADI PORTFOLIO — SCRIPT
   ═══════════════════════════════════════════ */

// ─── LOCAL CONTENT LOADER ──────────────────

function loadFirebaseContent() {
  try {
    loadLocalAbout();
    loadLocalProjects();
    loadLocalExperience();
    loadLocalSkills();
    loadLocalEducation();
  } catch (e) { /* static fallback */ }
}

function loadLocalAbout() {
  const d = readLocal('ph_about');
  if (!d) return;

  if (d.photo_url) {
    const frame = document.querySelector('.photo-frame');
    if (frame) frame.innerHTML = `<img src="${d.photo_url}" alt="Prizuri Hartadi" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" />`;
  }
  if (d.bio_en) { const el = document.querySelector('.about-bio .en'); if (el) el.innerHTML = d.bio_en; }
  if (d.bio_id) { const el = document.querySelector('.about-bio .id'); if (el) el.innerHTML = d.bio_id; }
  document.querySelectorAll('a[download]').forEach(a => {
    if (d.cv_url) { a.href = d.cv_url; a.style.display = ''; }
    else a.style.display = 'none';
  });
  document.querySelectorAll('a[href*="linkedin"]').forEach(a => {
    if (d.linkedin) { a.href = d.linkedin; a.style.display = ''; }
    else a.style.display = 'none';
  });

  if (d.email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = `mailto:${d.email}`;
      const val = a.querySelector('.contact-value');
      if (val) val.textContent = d.email;
    });
  }
  if (d.location) {
    const locEl = document.querySelector('.contact-card-location .contact-value');
    if (locEl) locEl.textContent = d.location;
  }
  if (d.github) {
    const ghBtn = document.getElementById('githubBtn');
    if (ghBtn) { ghBtn.href = d.github; ghBtn.style.display = ''; }
  }
}

function loadLocalExperience() {
  const raw = readLocal('ph_experience');
  if (!raw || !raw.length) return;
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const catMap = {
    steel:      { en: 'Steel Structure',    id: 'Struktur Baja',        cls: 'tag-steel' },
    assessment: { en: 'Assessment',         id: 'Penilaian',            cls: 'tag-assessment' },
    lab:        { en: 'Laboratory',         id: 'Laboratorium',         cls: 'tag-lab' },
    design:     { en: 'RC Design',          id: 'Desain Beton',         cls: 'tag-design' },
    research:   { en: 'FEM Research',       id: 'Riset FEM',            cls: 'tag-research' },
    web:        { en: 'Web Development',    id: 'Pengembangan Web',     cls: 'tag-web' },
    personal:   { en: 'Personal / Hobby',  id: 'Personal / Hobi',      cls: 'tag-personal' }
  };

  const sorted = [...raw].sort((a, b) => (a.order || 0) - (b.order || 0));

  timeline.innerHTML = sorted.map((e, i) => {
    const cat       = catMap[e.category] || catMap.steel;
    const dateLabel = [e.date_start, e.date_end].filter(Boolean).join(' – ');
    const maxLen    = Math.max((e.bullets_en || []).length, (e.bullets_id || []).length);
    const bullets   = Array.from({ length: maxLen }, (_, j) => {
      const en = e.bullets_en?.[j] || '';
      const id = e.bullets_id?.[j] || '';
      return `<li>${en ? `<span class="en">${en}</span>` : ''}${id ? `<span class="id">${id}</span>` : ''}</li>`;
    }).join('');
    const tools = (e.tools || []).map(t => `<span class="tool-tag">${t}</span>`).join('');
    const isFeatured = i === 0;
    return `
      <div class="timeline-item fade-in">
        <div class="timeline-date">${dateLabel}</div>
        <div class="timeline-dot${isFeatured ? ' featured' : ''}"></div>
        <div class="timeline-card${isFeatured ? ' featured-card' : ''}">
          <span class="exp-tag ${cat.cls}">
            <span class="en">${cat.en}</span>
            <span class="id">${cat.id}</span>
          </span>
          <h3>
            <span class="en">${e.title_en || ''}</span>
            <span class="id">${e.title_id || ''}</span>
          </h3>
          <p class="exp-company">${e.company || ''}</p>
          <ul class="exp-list">${bullets}</ul>
          <div class="exp-tools">${tools}</div>
        </div>
      </div>`;
  }).join('');

  // Re-observe newly injected fade-in elements
  timeline.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function loadLocalSkills() {
  const raw = readLocal('ph_skills');
  if (!raw || !raw.length) return;
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;

  const typeClass = { primary: 'skill-primary', code: 'skill-code', standard: '' };
  const sorted = [...raw].sort((a, b) => (a.order || 0) - (b.order || 0));

  grid.innerHTML = sorted.map(s => {
    const cls  = typeClass[s.type] || '';
    const tags = (s.items || []).map(item => `<span class="skill-tag ${cls}">${item}</span>`).join('');
    return `
      <div class="skill-group">
        <h3 class="skill-group-title">
          <span class="skill-icon">⬛</span>
          <span class="en">${s.group_en || ''}</span>
          <span class="id">${s.group_id || ''}</span>
        </h3>
        <div class="skill-tags">${tags}</div>
      </div>`;
  }).join('');
}

function loadLocalEducation() {
  const raw = readLocal('ph_education');
  if (!raw || !raw.length) return;
  const block = document.getElementById('educationBlock');
  if (!block) return;
  const sorted = [...raw].sort((a, b) => (a.order || 0) - (b.order || 0));
  block.innerHTML = `
    <h3 class="block-title">
      <span class="en">Education</span>
      <span class="id">Pendidikan</span>
    </h3>
    ${sorted.map(e => `
      <div class="edu-item">
        <div class="edu-icon">${e.icon || (e.degree_en || 'E')[0]}</div>
        <div class="edu-info">
          <strong>
            <span class="en">${e.degree_en || ''}</span>
            <span class="id">${e.degree_id || e.degree_en || ''}</span>
          </strong>
          <span>${e.university || ''}${e.gpa ? ' · GPA ' + e.gpa : ''}${e.year_start ? ' · ' + e.year_start + (e.year_end ? '–' + e.year_end : '') : ''}</span>
          ${(e.thesis_en || e.thesis_id) ? `<span class="edu-thesis">
            <span class="en">${e.thesis_en ? '📄 ' + e.thesis_en : ''}</span>
            <span class="id">${e.thesis_id ? '📄 ' + e.thesis_id : (e.thesis_en ? '📄 ' + e.thesis_en : '')}</span>
          </span>` : ''}
        </div>
      </div>`).join('')}
  `;
}

function loadLocalProjects() {
  const raw = readLocal('ph_projects');
  if (!raw || !raw.length) return;
  const projects = [...raw].sort((a, b) => (a.order || 0) - (b.order || 0));
  const featured = projects.filter(p => p.featured);
  const regular  = projects.filter(p => !p.featured);

  if (featured.length) {
    const wrap = document.querySelector('.project-featured');
    if (wrap) renderFeaturedProject(wrap, featured[0]);
  }
  const grid = document.querySelector('.project-grid');
  if (grid && regular.length) {
    grid.innerHTML = regular.slice(0, 3).map(p => renderProjectCard(p)).join('');
    attachHoverAnimations();
  }
}

function readLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}

function fixGDriveUrl(url) {
  if (!url) return url;
  const m0 = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (m0) return `https://drive.google.com/thumbnail?id=${m0[1]}&sz=w1600`;
  if (!url.includes('drive.google.com')) return url;
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return `https://drive.google.com/thumbnail?id=${m1[1]}&sz=w1600`;
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w1600`;
  return url;
}

function renderFeaturedProject(el, p) {
  const tagEN = { steel:'Steel Structure', assessment:'Assessment', lab:'Lab Testing', design:'RC Design', research:'FEM Research', web:'Web Development', personal:'Personal / Hobby' };
  const tagID = { steel:'Struktur Baja', assessment:'Penilaian', lab:'Pengujian Lab', design:'Desain RC', research:'Riset FEM', web:'Pengembangan Web', personal:'Personal / Hobi' };
  const imgClassMap = { steel:'project-img-dome', lab:'project-img-lab', research:'project-img-fem', assessment:'project-img-slf', web:'project-img-web', personal:'project-img-web' };
  const tagClass  = `tag-${p.category || 'steel'}`;
  const imgClass  = imgClassMap[p.category] || 'project-img-dome';
  const hasVideo  = p.video_url && p.video_type;
  const rawImages = p.images?.length ? p.images : (p.image_url ? [p.image_url] : []);
  const images    = rawImages.map(fixGDriveUrl);
  const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
  const hasMulti  = images.length > 1;
  const titleEN   = p.title_en || '';
  const titleID   = p.title_id || titleEN;
  const noImgOverlay = !images.length ? `
    <div class="no-img-overlay">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <div class="no-img-overlay-title">
        <span class="en">${titleEN}</span><span class="id">${titleID}</span>
      </div>
    </div>` : '';

  el.innerHTML = `
    <div class="project-img-wrap">
      <div class="project-img ${imgClass}" style="min-height:280px;cursor:${images.length?'pointer':'default'}"
           onclick="${images.length ? `openLightbox(JSON.parse(this.dataset.images),0)` : ''}"
           data-images="${imagesJson}">
        ${noImgOverlay}
        ${images[0] ? `<img class="thumb-static" src="${images[0]}" alt="${titleEN}" />` : ''}
        ${p.image_animated_url ? (p.image_animated_url.match(/\.(mp4|webm)$/i)
          ? `<video class="thumb-anim" src="${p.image_animated_url}" muted loop playsinline></video>`
          : `<img class="thumb-anim" src="${p.image_animated_url}" alt="${titleEN} animated" />`) : ''}
        ${p.image_animated_url ? '<span class="play-badge">▶ Preview</span>' : ''}
        ${hasMulti ? `<span class="gallery-count">${images.length} foto</span>` : ''}
        ${images.length ? `<div class="img-overlay-text">${p.date || ''} · ${(p.tools || []).slice(0,3).join(', ')}</div>` : ''}
      </div>
    </div>
    <div class="project-info">
      <span class="project-tag ${tagClass}">
        <span class="en">Featured · ${tagEN[p.category]||''}</span>
        <span class="id">Unggulan · ${tagID[p.category]||''}</span>
      </span>
      <h3>
        <span class="en">${titleEN}</span>
        <span class="id">${titleID}</span>
      </h3>
      <p>
        <span class="en">${p.desc_en || ''}</span>
        <span class="id">${p.desc_id || p.desc_en || ''}</span>
      </p>
      <div class="project-meta-row">
        <span class="meta-chip">${p.company || ''} ${p.date ? '· ' + p.date : ''}</span>
      </div>
      <div class="exp-tools">${(p.tools||[]).map(t=>`<span class="tool-tag">${t}</span>`).join('')}</div>
      ${hasVideo ? `<button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="openVideoModal('${p.video_url}','${p.video_type}','${titleEN.replace(/'/g,"\\'")}')">
        ▶ <span class="en">Watch Video</span><span class="id">Tonton Video</span>
      </button>` : ''}
    </div>
  `;
}

function renderProjectCard(p) {
  const tagEN = { steel:'Steel Structure', assessment:'Assessment', lab:'Lab Testing', design:'RC Design', research:'FEM Research', web:'Web Development', personal:'Personal / Hobby' };
  const tagID = { steel:'Struktur Baja', assessment:'Penilaian', lab:'Pengujian Lab', design:'Desain RC', research:'Riset FEM', web:'Pengembangan Web', personal:'Personal / Hobi' };
  const tagClass = `tag-${p.category || 'steel'}`;
  const hasVideo = p.video_url && p.video_type;
  const imgClass = { steel:'project-img-dome', lab:'project-img-lab', research:'project-img-fem', assessment:'project-img-slf', web:'project-img-web', personal:'project-img-web' }[p.category] || 'project-img-lab';
  const images    = (p.images?.length ? p.images : (p.image_url ? [p.image_url] : [])).map(fixGDriveUrl);
  const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
  const hasMulti  = images.length > 1;
  const titleEN   = p.title_en || '';
  const titleID   = p.title_id || titleEN;
  const noImgOverlay = !images.length ? `
    <div class="no-img-overlay">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <div class="no-img-overlay-title">
        <span class="en">${titleEN}</span><span class="id">${titleID}</span>
      </div>
    </div>` : '';

  const dots = hasMulti
    ? `<div class="gallery-dots">${images.map((_,i) =>
        `<button class="gallery-dot${i===0?' active':''}" onclick="event.stopPropagation();openLightbox(JSON.parse(this.closest('[data-images]').dataset.images),${i})"></button>`
      ).join('')}</div>`
    : '';

  return `
    <div class="project-card">
      <div class="project-card-img ${imgClass}"
           style="cursor:${images.length?'pointer':'default'}"
           data-images="${imagesJson}"
           onclick="${images.length ? `openLightbox(JSON.parse(this.dataset.images),0)` : ''}">
        ${noImgOverlay}
        ${images[0] ? `<img class="thumb-static" src="${images[0]}" alt="${titleEN}" />` : ''}
        ${p.image_animated_url ? (p.image_animated_url.match(/\.(mp4|webm)$/i)
          ? `<video class="thumb-anim" src="${p.image_animated_url}" muted loop playsinline></video>`
          : `<img class="thumb-anim" src="${p.image_animated_url}" alt="${titleEN} animated" />`) : ''}
        ${p.image_animated_url ? '<span class="play-badge">▶</span>' : ''}
        ${hasMulti ? `<span class="gallery-count">${images.length}</span>` : ''}
        ${dots}
      </div>
      <div class="project-card-body">
        <span class="project-tag ${tagClass}">
          <span class="en">${tagEN[p.category] || p.category}</span>
          <span class="id">${tagID[p.category] || p.category}</span>
        </span>
        <h3>
          <span class="en">${titleEN}</span>
          <span class="id">${titleID}</span>
        </h3>
        <p>
          <span class="en">${p.desc_en || ''}</span>
          <span class="id">${p.desc_id || p.desc_en || ''}</span>
        </p>
        <div class="exp-tools">${(p.tools||[]).map(t=>`<span class="tool-tag">${t}</span>`).join('')}</div>
        ${hasVideo ? `<button class="project-link" style="background:none;border:none;cursor:pointer;padding:0;text-align:left"
          onclick="openVideoModal('${p.video_url}','${p.video_type}','${titleEN.replace(/'/g,"\\'")}')">
          ▶ <span class="en">Watch Video</span><span class="id">Tonton Video</span>
        </button>` : ''}
      </div>
    </div>
  `;
}

// ─── ANIMATED THUMBNAIL HOVER ──────────────
function attachHoverAnimations() {
  document.querySelectorAll('.project-card, .project-featured').forEach(card => {
    const vid = card.querySelector('video.thumb-anim');
    if (!vid) return;
    card.addEventListener('mouseenter', () => { vid.play().catch(()=>{}); });
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  });
}

// ─── VIDEO MODAL ───────────────────────────
function openVideoModal(url, type, title) {
  const embedUrl = getPortfolioEmbedUrl(url, type);
  if (!embedUrl) return;
  const modal = document.getElementById('videoModal');
  document.getElementById('videoModalTitle').textContent = title || 'Video';
  document.getElementById('videoModalFrame').src = embedUrl;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  modal.classList.remove('open');
  document.getElementById('videoModalFrame').src = '';
  document.body.style.overflow = '';
}

function getPortfolioEmbedUrl(url, type) {
  if (type === 'gdrive') {
    const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return `https://drive.google.com/file/d/${m2[1]}/preview`;
  }
  if (type === 'youtube') {
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
  }
  return null;
}

function attachVideoButtons() { /* video buttons are inline onclick */ }

// ─── LIGHTBOX ──────────────────────────────
let _lbImages = [], _lbIdx = 0;

function openLightbox(images, startIndex = 0) {
  if (!images?.length) return;
  _lbImages = images;
  _lbIdx    = startIndex;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  document.getElementById('lightboxImg').src = _lbImages[_lbIdx];
  document.getElementById('lightboxCounter').textContent =
    _lbImages.length > 1 ? `${_lbIdx + 1} / ${_lbImages.length}` : '';
  const thumbs = document.getElementById('lightboxThumbs');
  if (_lbImages.length > 1) {
    thumbs.innerHTML = _lbImages.map((url, i) =>
      `<img class="lightbox-thumb${i === _lbIdx ? ' active' : ''}" src="${url}"
            onclick="lightboxGoTo(${i})" alt="thumb ${i+1}" />`
    ).join('');
  } else {
    thumbs.innerHTML = '';
  }
  // show/hide arrows
  const showArrows = _lbImages.length > 1;
  document.querySelector('.lightbox-prev').style.display = showArrows ? '' : 'none';
  document.querySelector('.lightbox-next').style.display = showArrows ? '' : 'none';
}

function lightboxNav(dir) {
  _lbIdx = (_lbIdx + dir + _lbImages.length) % _lbImages.length;
  renderLightbox();
}

function lightboxGoTo(i) {
  _lbIdx = i;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// expose globally
window.openLightbox    = openLightbox;
window.closeLightbox   = closeLightbox;
window.lightboxNav     = lightboxNav;
window.lightboxGoTo    = lightboxGoTo;
window.openVideoModal  = openVideoModal;
window.closeVideoModal = closeVideoModal;

// ─── Language Toggle ───────────────────────
const html    = document.documentElement;
const btnEN   = document.getElementById('btnEN');
const btnID   = document.getElementById('btnID');
const toggle  = document.getElementById('langToggle');

(function initLang() {
  let settings = null;
  try { settings = JSON.parse(localStorage.getItem('ph_lang_settings')); } catch {}
  const idEnabled = settings && settings.id_enabled === true;

  if (!idEnabled) {
    toggle.style.display = 'none';
    setLang('en');
    return;
  }

  toggle.style.display = '';
  const savedLang = localStorage.getItem('ph_lang') || 'en';
  setLang(savedLang);

  toggle.addEventListener('click', () => {
    const next = html.lang === 'en' ? 'id' : 'en';
    setLang(next);
  });
})();

function setLang(lang) {
  html.lang = lang;
  localStorage.setItem('ph_lang', lang);
  btnEN.classList.toggle('active', lang === 'en');
  btnID.classList.toggle('active', lang === 'id');
}

// ─── Navbar scroll effect ──────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Mobile hamburger ──────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── Fade-in on scroll ─────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for elements in same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 300);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// ─── Active nav link on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── Smooth scroll for anchor links ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Hero name entrance animation ──────────
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero-content')?.classList.add('visible');
  setTimeout(() => {
    document.querySelector('.hero-badge')?.style.setProperty('opacity', '1');
  }, 100);

  // Load Firebase dynamic content (non-blocking)
  loadFirebaseContent();
  // Attach hover animations to static cards too
  attachHoverAnimations();
});

// Close modals on overlay click / Escape
document.addEventListener('click', e => {
  if (e.target === document.getElementById('videoModal'))  closeVideoModal();
  if (e.target === document.getElementById('lightbox'))    closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')      { closeVideoModal(); closeLightbox(); }
  if (e.key === 'ArrowLeft')   lightboxNav(-1);
  if (e.key === 'ArrowRight')  lightboxNav(1);
});

// ─── ANIMATED STATS COUNTER ───────────────
function animateCounter(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return;
  const prefix    = match[1] || '';
  const target    = parseFloat(match[2]);
  const suffix    = match[3] || '';
  const isDecimal = match[2].includes('.');
  const decimals  = isDecimal ? (match[2].split('.')[1] || '').length : 0;
  const duration  = 1600;
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current  = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(decimals) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  }
  requestAnimationFrame(tick);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        }, 400);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });
  counterObserver.observe(heroStats);
}

// ─── CONTACT FORM (Formspree) ─────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn    = contactForm.querySelector('.form-btn-submit');
    const status = document.getElementById('formStatus');
    const lang   = document.documentElement.lang || 'en';

    btn.disabled = true;
    btn.textContent = lang === 'id' ? 'Mengirim...' : 'Sending...';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = lang === 'id'
          ? '✓ Pesan terkirim! Saya akan segera membalas.'
          : '✓ Message sent! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Server error');
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = lang === 'id'
        ? '✕ Gagal mengirim. Silakan email langsung ke prizurihartadi10@gmail.com'
        : '✕ Failed to send. Please email me directly at prizurihartadi10@gmail.com';
    } finally {
      btn.disabled = false;
      btn.innerHTML = lang === 'id'
        ? '<span class="en">Send Message</span><span class="id">Kirim Pesan</span>'
        : '<span class="en">Send Message</span><span class="id">Kirim Pesan</span>';
    }
  });
}

// ─── Content protection ────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart',   e => e.preventDefault());
