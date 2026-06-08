# Perbaikan Media Project

Perubahan yang ditambahkan:

1. Project sekarang mendukung tiga jenis media:
   - `cover_image_url`: gambar utama/statis untuk card project.
   - `preview_media_url`: GIF atau video pendek yang muncul saat card di-hover.
   - `images`: galeri screenshot tambahan yang muncul saat gambar project diklik.

2. Tampilan card project dibuat lebih profesional:
   - halaman utama tetap memakai cover statis agar tidak ramai dan lebih ringan;
   - preview GIF/video hanya aktif saat hover;
   - galeri screenshot tetap tersedia melalui lightbox.

3. Admin panel bagian project sudah diperbarui:
   - input `Cover Image / Gambar Utama`;
   - input `Preview GIF / Video`;
   - pilihan `Jenis Preview`: Auto detect, GIF/Gambar, atau Video MP4/WebM;
   - input `Gallery Images / Screenshot Tambahan`.

4. Backward compatibility:
   - data lama `image_url` tetap disimpan agar aman dengan struktur lama;
   - data lama `images` tetap bisa dibaca.

Catatan penggunaan:
- Untuk halaman utama, gunakan screenshot statis WebP/JPG/PNG sebagai cover.
- Untuk preview animasi, MP4/WebM pendek lebih disarankan daripada GIF karena biasanya lebih ringan.
- Jika memakai video dari Google Drive, pilih jenis preview `Video MP4/WebM` secara manual karena URL Google Drive sering tidak memiliki ekstensi file.
