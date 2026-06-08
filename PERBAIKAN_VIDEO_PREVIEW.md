# Perbaikan Video Preview Project

Perubahan yang dilakukan:

1. Preview video di card tetap berjalan sebagai hover preview pendek, tetapi sekarang ada indikator play dan teks bahwa video dapat dibuka dalam ukuran besar.
2. Saat gambar/card media project diklik, preview video akan dibuka di lightbox/modal besar dengan kontrol video bawaan browser.
3. Video di modal tidak dibuat `loop`, sehingga MP4 dapat diputar sampai selesai.
4. Gallery project tetap bisa dibuka setelah video melalui tombol panah lightbox.
5. Lightbox sekarang mendukung media campuran: video dan gambar.
6. Ukuran lightbox disesuaikan agar video tidak terlihat kecil di desktop maupun mobile.
7. Akses keyboard ditambahkan pada cover project: Enter/Space dapat membuka preview.
8. CSS kecil yang sebelumnya double pada `.item-info-clickable` juga dirapikan.

Validasi:

- `npm run build` berhasil.
- Preview production `/portfolio/` berhasil HTTP 200.
- `/portfolio/data/content.json` berhasil HTTP 200.
