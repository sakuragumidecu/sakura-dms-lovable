

## Perbaikan Multi-Page PDF & Pratinjau Per-Halaman

### Masalah
1. **`handleConvert`** di `CameraScanModal.jsx` (baris 107-121) hanya mengambil halaman pertama (`pages[0]`) untuk membuat file — halaman lain diabaikan.
2. **Pratinjau layar penuh** di `UploadForm.jsx` (baris 341-357) menampilkan semua halaman scan dalam satu scroll panjang tanpa pemisah yang jelas, sehingga terlihat seperti "gabungan" bukan halaman terpisah.

### Rencana Perubahan

#### 1. Multi-Page PDF Generation (`CameraScanModal.jsx`)
- Ubah `handleConvert` agar menggabungkan **semua halaman** menjadi satu file:
  - Untuk **PDF**: Gunakan canvas untuk menggabungkan semua halaman menjadi satu blob multi-image. Karena tidak ada library PDF (jsPDF dll), buat pendekatan pragmatis: gabungkan semua gambar halaman ke dalam satu canvas vertikal (stacked), lalu export sebagai satu file. Atau lebih baik: pass semua page images ke `onComplete` dan biarkan upload form yang menangani.
  - Untuk **PNG/JPG**: Jika hanya 1 halaman, export langsung. Jika multi-page, tetap kirim halaman pertama sebagai file utama tapi semua gambar tetap dikirim via `pageImages`.
- Perbaiki agar blob file merepresentasikan seluruh konten, bukan hanya halaman 1.

#### 2. Pratinjau Per-Halaman yang Jelas (`UploadForm.jsx`)
- **Inline preview** (baris 276-308): Tambahkan label "Halaman X dari Y" di setiap halaman dan beri jarak/separator yang lebih jelas antar halaman.
- **Full-screen preview** (baris 328-365): Redesign agar setiap halaman tampil dalam kartu terpisah dengan:
  - Header "Halaman X dari Y" di setiap kartu
  - Padding dan shadow yang jelas per halaman
  - Navigasi halaman (indikator halaman aktif)
  - Setiap halaman memiliki ukuran `max-height` yang konsisten sehingga tidak terlihat seperti satu gambar gabungan

#### Detail Teknis

**File: `src/components/scan/CameraScanModal.jsx`**
- `handleConvert`: Iterasi semua `pages`, gabungkan data semua halaman ke satu canvas vertikal untuk file PDF, atau kirim halaman pertama + semua pageImages.

**File: `src/components/upload/UploadForm.jsx`**  
- Inline preview: Selalu tampilkan header halaman (hapus kondisi `file?.name?.endsWith(".pdf")`)
- Full-screen preview: Tambahkan navigasi halaman di toolbar, tampilkan satu halaman pada satu waktu (page-by-page view) dengan tombol Sebelumnya/Berikutnya, bukan scroll panjang semua halaman sekaligus.

