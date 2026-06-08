# Perbaikan Gambar Cover & Preview Video

Perubahan pada versi ini:

- Cover image project kembali diprioritaskan sebagai tampilan default card.
- Preview video/GIF hanya muncul saat hover dan tidak lagi menutupi cover jika preview gagal dimuat.
- Jika preview media gagal dimuat, overlay preview otomatis disembunyikan sehingga cover tetap terlihat.
- Auto detect untuk link Google Drive pada field Preview sekarang lebih aman: link Google Drive di field preview dianggap video secara default, karena URL Google Drive tidak menampilkan ekstensi .mp4/.webm.
- Jika cover image gagal dimuat, card menampilkan placeholder yang rapi, bukan area rusak/blank.
- Hint admin pada Jenis Preview diperjelas: untuk Google Drive MP4, pilih Video MP4/WebM agar lebih aman.

Validasi:

- `npm run build` berhasil.
- Preview production `/portfolio/` HTTP 200.
- `/portfolio/data/content.json` HTTP 200.
