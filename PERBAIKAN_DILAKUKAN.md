# Perbaikan Portfolio

Tanggal validasi: 8 Juni 2026

## Ringkasan Perbaikan

1. Admin routing disinkronkan dengan URL:
   - Direct URL seperti `#/f9xk7b/projects` sekarang membuka section admin yang benar.
   - Route admin yang tidak valid otomatis kembali ke dashboard admin.

2. Bug `SectionManager.jsx` diperbaiki:
   - `useNavigate()` sudah dideklarasikan.
   - Tombol Edit setiap section diarahkan ke halaman admin yang valid.
   - Section `contact` diarahkan ke `Situs & Hero`, bukan ke route invalid.
   - Ditambahkan label CV dan tombol reset default section.

3. Data CV diperbaiki:
   - `cvData` sekarang ikut `publish`, `download content.json`, `export backup`, dan `import backup`.
   - `public/data/content.json` sudah memiliki key `cv`.
   - Section CV punya fallback default dan tidak kosong saat belum ada data.

4. Konfigurasi section dinormalisasi:
   - Data section lama otomatis digabung dengan `DEFAULT_SECTION_CONFIG`.
   - CV tetap mengikuti default `visible: false`, sehingga tidak muncul tiba-tiba karena fallback lama.

5. Dashboard publik diperbaiki:
   - Navbar sekarang bisa menampilkan CV jika section CV diaktifkan.
   - Skills tidak menampilkan section kosong jika semua skill di-hidden.
   - Tombol CTA Hero punya fallback scroll dan fallback teks jika target section disembunyikan.

6. GitHub Pages/base path diperbaiki:
   - Link “Lihat Website” memakai `import.meta.env.BASE_URL`.
   - `404.html` diarahkan ke `/portfolio/`.
   - `public/404.html` ditambahkan agar ikut masuk ke hasil build.

## Validasi

- `npm run build` berhasil.
- Vite preview berhasil melayani `/portfolio/` dengan HTTP 200.
- `data/content.json` hasil build berisi key `cv` dan konfigurasi section lengkap.
- `404.html` hasil build redirect ke `/portfolio/`.

## Catatan

ZIP ini tidak menyertakan `node_modules` agar ukuran file tetap ringan. Jalankan `npm install` terlebih dahulu jika membuka proyek di komputer baru.
