# Perbaikan Gambar Experience

- Gambar pada section Experience sekarang memakai fallback berlapis seperti Project.
- URL Google Drive dicoba melalui beberapa format thumbnail/direct image.
- Jika thumbnail Drive gagal, card akan mencoba Google Drive preview iframe agar tidak muncul broken image.
- Jika semua sumber gagal, card menampilkan placeholder rapi.
- Lightbox tetap memakai fallback Google Drive preview.
- Admin Experience diberi hint agar file Google Drive dibuat public.
