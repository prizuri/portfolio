# Perbaikan Gallery Image ke-4

Perbaikan ini dibuat untuk kasus gambar gallery urutan ke-4 yang kadang tidak muncul, terutama ketika sumber gambar berasal dari Google Drive.

Yang diperbaiki:
- Menambahkan dukungan `resourcekey` pada URL Google Drive.
- Menambahkan beberapa fallback thumbnail Google Drive dengan ukuran berbeda.
- Menambahkan fallback `uc?export=view` dan `uc?export=download`.
- Jika semua URL gambar gagal, lightbox akan memakai Google Drive preview iframe sebagai fallback.
- Jika file non-Google Drive tetap gagal, lightbox menampilkan pesan fallback dan tombol untuk membuka file asli.

Catatan:
- Pastikan file Google Drive diatur ke **Anyone with the link / Siapa saja yang memiliki link**.
- Jika salah satu gambar tetap tidak muncul, kemungkinan file tersebut belum public, bukan format gambar umum, atau Google Drive belum menghasilkan thumbnail.
