# Catatan Perbaikan

Perbaikan yang dilakukan:

1. Memperbaiki struktur `@media (max-width: 768px)` di `src/index.css`.
   - Sebelumnya blok media query tertutup terlalu cepat sehingga muncul warning `Unexpected "}"` saat build.
   - Setelah diperbaiki, build Vite berjalan bersih tanpa warning CSS.

2. Merapikan tampilan dan animasi status hijau di Hero.
   - `hero-badge-green` sekarang memiliki warna hijau yang konsisten.
   - Animasi pulse pada titik status dibuat lebih halus.
   - Ditambahkan fallback `prefers-reduced-motion` agar animasi tetap ramah aksesibilitas.

3. Mencegah data Hero/Site terhapus saat menyimpan bagian Tentang Saya.
   - `SectionAbout.jsx` sekarang memakai `...about` saat menyimpan.
   - Field seperti `status_color`, role, CTA, lokasi, Formspree, dan logo tidak akan hilang ketika bio/status disimpan.

4. Merapikan cleanup animasi Framer Motion.
   - `Hero.jsx` dan `Dashboard.jsx` sekarang menghentikan animasi dengan fungsi cleanup yang aman.

5. Menambahkan validasi warna status Hero.
   - Hanya `green`, `blue`, atau `none` yang dipakai sebagai class status.

Validasi:

- `npm ci` berhasil.
- `npm run build` berhasil tanpa warning/error.

## Pemeriksaan tambahan keamanan/kode aneh
- Tidak ditemukan pola kode seperti `eval`, `new Function`, `document.write`, script tersembunyi, atau dependency tidak dikenal.
- External request yang terdeteksi hanya untuk Google Fonts, Formspree, Google Drive image URL, DOI/Scholar link, dan file data lokal portfolio.
- Bio yang sebelumnya memakai raw HTML sekarang melewati `sanitizeHtml()` agar tag/atribut berbahaya tidak ikut dirender.
