# Perbaikan Final

Perbaikan yang dilakukan:

1. Menghapus output `cv` standalone dari publish/export/download `content.json`.
2. Membersihkan `public/data/content.json` dan `dist/data/content.json` dari key `cv` lama.
3. CV tetap kompatibel dengan backup lama: jika import file lama memiliki `cv.cv_url`, nilainya otomatis masuk ke `about.cv_url`.
4. Tombol publish admin diperjelas menjadi `Simpan ke File Lokal (Dev)` dan diberi guard agar tidak membingungkan saat production/static hosting.
5. URL publikasi dinormalisasi dengan `ensureUrl()` supaya link tanpa `https://` tidak menjadi relative path.
6. Link CV di Hero juga dinormalisasi dengan `ensureUrl()`.
7. Pengaturan bahasa sekarang reaktif: perubahan toggle EN/ID di admin langsung terbaca oleh navbar/website tanpa refresh manual.
8. Area info pada baris admin Proyek, Pengalaman, Keahlian, Pendidikan, Hobi, dan Publikasi bisa diklik untuk edit.
9. Build production berhasil dengan `npm run build`.
10. Preview production sudah dicek: `/portfolio/` dan `/portfolio/data/content.json` return HTTP 200.
