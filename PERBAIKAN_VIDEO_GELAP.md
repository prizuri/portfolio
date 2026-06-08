# Perbaikan Video Preview Gelap

Perubahan:
- Cover image tetap menjadi tampilan utama card project.
- Video Google Drive tidak lagi dipaksa berjalan melalui `<video src=...>` karena sering tampil gelap/blank akibat cara Google Drive menyajikan file.
- Video Google Drive sekarang dibuka di lightbox menggunakan embed preview Google Drive (`/preview`).
- Hover preview video dinonaktifkan khusus untuk Google Drive agar cover tidak tertutup layer gelap.
- Video MP4/WebM lokal/direct tetap bisa tampil sebagai hover preview.
- Video direct diberi poster dari cover image agar tidak tampak hitam saat metadata belum terbaca.
- Modal/lightbox video direct memakai controls, preload auto, poster, dan tidak loop.

Catatan:
- Untuk Google Drive, pastikan sharing file video disetel ke "Anyone with the link".
- Untuk performa terbaik, gunakan file MP4/WebM pendek di folder public/images/projects/ jika ingin hover preview benar-benar berjalan langsung di card.
