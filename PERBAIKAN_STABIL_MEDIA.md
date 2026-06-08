# Perbaikan Stabil Media Project

Perbaikan ini menstabilkan tampilan gambar/video di card project.

## Yang diperbaiki

- Cover image selalu diprioritaskan sebagai tampilan default card.
- Preview video/GIF hanya menjadi layer tambahan saat hover, tidak lagi menutupi/menghilangkan cover saat gagal dimuat.
- Jika cover kosong tetapi preview video tersedia, card tetap menampilkan thumbnail video sederhana.
- Link Google Drive gambar sekarang memakai beberapa fallback otomatis:
  1. `drive.google.com/thumbnail`
  2. `lh3.googleusercontent.com`
  3. `drive.google.com/uc?export=view`
  4. link asli
- Lightbox juga memakai fallback image yang sama.
- Jika semua fallback gagal, tampil placeholder rapi, bukan card kosong.

## Catatan penting

Agar gambar/video Google Drive tampil di website publik, file harus diatur ke **Anyone with the link / Siapa saja yang memiliki link**.
