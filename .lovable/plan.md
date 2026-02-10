

# Rencana: Pengaturan Sistem + Upload dari Arsip + Home Page Tetap

## Ringkasan

Tiga area perubahan utama:
1. **Halaman Pengaturan Sistem** lengkap dengan semua opsi yang diminta, diakses dari dropdown profil di AppHeader
2. **Upload dari Arsip** menggunakan form upload yang identik dengan UploadPage
3. **Home Page tetap dipertahankan** (tidak ada perubahan pada HomePage)

---

## A. Dropdown Profil + Pengaturan Sistem

### Perubahan pada AppHeader.tsx
- Klik ikon profil sekarang membuka **dropdown menu** (bukan langsung modal profil)
- Dropdown berisi:
  - "Profil Saya" -- membuka UserProfileModal
  - "Pengaturan Sistem" -- navigasi ke `/settings`
  - "Keluar" -- logout
- Dropdown menggunakan background solid `bg-card` dengan `z-50` agar tidak transparan

### File Baru: `src/contexts/SettingsContext.tsx`
- Context baru untuk menyimpan preferensi user
- State yang disimpan ke localStorage (persist per user ID):
  - `theme`: "light" | "dark" | "system"
  - `fontSize`: "small" | "normal" | "large"
  - `language`: "id" | "en"
  - `notifications`: { email, inApp, upload, approve, reject, folderShare, frequency }
  - `viewer`: { floatingPreview, defaultZoom, fullscreenOnClick }
  - `scan`: { autoCrop, compression, autoSaveFolder }
  - `folderMapping`: { enabled, mappings[] }
  - `security`: { twoFactor, sessionTimeout, loginWithGoogle }
- Fungsi `updateSetting`, `resetToDefault`, `exportPreferences` (JSON download)
- Saat theme berubah, langsung toggle class `dark` pada `<html>` element
- Saat fontSize berubah, langsung ubah CSS variable `--base-font-size` pada body

### Perubahan pada `src/index.css`
- Tambah dark mode CSS variables (warna gelap sesuai tema SAKURA maroon)
- Tambah CSS variable untuk font-size scaling (`--base-font-size`)
- Body font-size menggunakan `var(--base-font-size)`

### File Baru: `src/pages/SettingsPage.tsx`
Halaman pengaturan lengkap dengan section-section berikut:

1. **Tema** -- Toggle Terang/Gelap/Ikuti Sistem dengan preview langsung
2. **Ukuran Teks** -- Pilihan Small/Normal/Large, preview langsung
3. **Bahasa UI** -- Dropdown Bahasa Indonesia / English (label berubah, konten tetap bahasa Indonesia untuk MVP)
4. **Notifikasi** -- Toggle Email/In-app, sub-opsi per event, frekuensi
5. **Preferensi Viewer** -- Toggle floating preview, default zoom slider, fullscreen on click
6. **Scan & Upload Settings** -- Auto-crop, compression level, auto-save folder
7. **Default Folder Mapping** -- Tabel mapping jenis dokumen ke folder, toggle auto-mapping
8. **Privacy & Security** -- 2FA toggle (simulasi), session timeout selector, Google login toggle (simulasi)
9. **Reset & Export** -- Tombol export JSON, tombol reset ke default

### Perubahan pada `src/App.tsx`
- Wrap `AppRoutes` dengan `SettingsProvider`
- Tambah route `/settings` dalam protected routes

### Perubahan pada `src/components/layout/AppSidebar.tsx`
- Tidak perlu menambah item sidebar untuk Settings (akses via dropdown profil saja)

---

## B. Upload dari Arsip (Identik dengan UploadPage)

### File Baru: `src/components/upload/UploadForm.tsx`
- Ekstrak seluruh form upload dari `UploadPage.tsx` menjadi komponen reusable
- Props:
  - `targetFolder?: string` -- jika dipanggil dari arsip, field folder target terisi otomatis (readonly)
  - `onSuccess?: () => void` -- callback setelah upload berhasil
  - `onCancel?: () => void` -- untuk menutup modal
- Komponen ini berisi **semua** field dan behavior yang sama persis:
  - Drag & drop area
  - Tombol Scan via Kamera
  - Semua metadata fields (Nomor Dokumen, Nama Dokumen, Jenis, Kategori, Kelas, Nama Siswa, NISN, Tahun Ajaran, Tanggal Upload auto, Catatan)
  - Preview floating + fullscreen (PdfPreviewOverlay)
  - Validasi file types dan size
  - Toast sukses/error

### Perubahan pada `src/pages/UploadPage.tsx`
- Refactor: gunakan `<UploadForm />` sebagai isi halaman (menggantikan form inline)
- Behavior dan tampilan tetap identik

### Perubahan pada `src/pages/ArchivePage.tsx`
- Tambah tombol "Upload Dokumen" di toolbar area filter
- Klik membuka **modal overlay** berisi `<UploadForm targetFolder={selectedFolder} onSuccess={closeModal} onCancel={closeModal} />`
- Jika `targetFolder` terisi, field Tahun Ajaran dan Kelas otomatis terisi berdasarkan path folder (readonly jika user bukan Admin)
- Setelah upload sukses, modal ditutup dan daftar dokumen otomatis refresh (karena state documents di context berubah)

---

## C. Home Page -- Tetap Dipertahankan

- **TIDAK ADA PERUBAHAN** pada `src/pages/HomePage.tsx`
- **TIDAK ADA PERUBAHAN** pada routing di `App.tsx` untuk path `/` (tetap menampilkan HomePage saat belum login)
- Home Page tetap berisi: navbar + logo, hero section, deskripsi sekolah, fitur SAKURA, CTA login/signup, footer

---

## Detail Teknis

### Struktur File Baru
```text
src/
  contexts/
    SettingsContext.tsx        (baru)
  components/
    upload/
      UploadForm.tsx           (baru - reusable upload form)
  pages/
    SettingsPage.tsx            (baru)
```

### SettingsContext - Persistensi
```text
localStorage key: `sakura_prefs_${userId}`
Saat login: load preferensi dari localStorage
Saat logout: preferensi tetap tersimpan
Saat ubah: langsung simpan + apply
```

### Dark Mode CSS Variables
Akan ditambahkan di `src/index.css` di bawah `.dark` selector:
- Background gelap, card gelap, border gelap
- Primary tetap maroon (#6a2730) agar konsisten
- Sidebar tetap gelap (sudah gelap secara default)

### Font Size Scaling
```text
Small: body font-size 13px
Normal: body font-size 15px (default)
Large: body font-size 17px
```

### Folder Mapping Default
```text
Ijazah -> Ijazah
Rapor -> Nilai
Surat Keputusan -> SK
Data Siswa -> Data Siswa
Laporan Keuangan -> Laporan
Sertifikat -> Sertifikat
```

### Upload Modal di Arsip
- Modal full-width (max-w-5xl) dengan scroll
- Layout grid 2 kolom seperti UploadPage
- Header: "Upload Dokumen ke [nama folder]"
- Field folder target: readonly, menampilkan "Masukkan ke folder: [folder] (direkomendasikan)"

