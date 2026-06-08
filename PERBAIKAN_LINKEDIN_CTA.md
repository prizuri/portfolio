# Perbaikan CTA CV / LinkedIn

Perubahan yang dilakukan:

1. Tombol ketiga di Hero sekarang bersifat otomatis:
   - Jika `about.cv_url` diisi, tombol tampil sebagai `Download CV` dan membuka link CV.
   - Jika `about.cv_url` kosong tetapi `about.linkedin` diisi, tombol tampil sebagai `Connect on LinkedIn` dan membuka LinkedIn.
   - Jika keduanya kosong, tombol ketiga tidak ditampilkan.

2. Link LinkedIn tetap dikelola dari menu Admin → Profil & Kontak.

3. Hint pada menu Admin → Situs & Hero → Link CV diperjelas agar admin tahu bahwa CV kosong akan memakai LinkedIn sebagai fallback.

4. Build production sudah berhasil menggunakan `npm run build`.

Validasi:
- `/portfolio/` berhasil dibuka dari preview production.
- `/portfolio/data/content.json` berhasil dibaca.
- `content.json` tetap bersih dari section `cv` standalone.
