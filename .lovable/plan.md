
# Rencana Revisi & Perbaikan Sistem SAKURA DMS

## Ringkasan

10 area perubahan besar mencakup sidebar, dashboard, upload dokumen, arsip, detail dokumen, manajemen user, login, pengaturan, dan alur persetujuan.

---

## 1. Sidebar - Collapse Button di Atas

**File**: `src/components/layout/AppSidebar.tsx`

- Pindahkan tombol collapse/expand dari bagian bawah sidebar ke bagian **atas** (di samping logo SAKURA)
- Arah panah tetap jelas: `PanelLeftClose` untuk collapse, `PanelLeft` untuk expand

---

## 2. Dashboard - Filter Aktivitas & Grafik Interaktif

### a. Filter Mingguan/Bulanan

**File**: `src/components/dashboard/ActivityChart.tsx`

- Tambah toggle button "Mingguan" / "Bulanan" di header chart
- Untuk bulanan, generate data 30 hari dari mock data
- Chart title berubah sesuai filter yang aktif

### b. Grafik Status (Disetujui/Ditolak/Menunggu)

- Tambah 3 line baru pada grafik: Disetujui, Ditolak, Menunggu (selain Upload dan Persetujuan yang sudah ada)
- Atau ganti line yang ada menjadi 3 status tersebut

### c. Klik Titik Grafik

- Sudah ada `onDateClick` handler, perbaiki agar benar-benar menampilkan daftar dokumen sesuai tanggal yang diklik

### d. Klik Status

- Klik pada status di legend grafik menampilkan daftar dokumen dengan filter status tersebut

**File**: `src/data/mockData.ts` - Tambah data chart bulanan

---

## 3. Upload Dokumen - Redesign Form dengan Kategori Dinamis

**File**: `src/components/upload/UploadForm.tsx`

### a. Filter Dropdown Jenis Dokumen Baru

Ganti opsi jenis dokumen menjadi:
- Surat Masuk dan Keluar Siswa
- Surat Pindah Siswa
- Sertifikat Guru
- Sertifikat Prestasi Siswa
- Ijazah SMP
- Surat Keterangan Hasil Ujian (SKHU)
- Rekapitulasi Absensi Siswa dan Guru
- Surat Keputusan (Arsip Surat)
- Inventaris Sarana Prasarana
- Lainnya (input text manual jika dipilih)

### b. Kategori di Atas Jenis Dokumen

- Pindahkan **Kategori** di atas **Jenis Dokumen**
- Opsi kategori: Data Siswa, Data Guru, Sarana Prasarana Sekolah, Surat Menyurat, Keuangan, Lainnya
- Setiap kategori memiliki jenis dokumen yang relevan (filter cascade)

### c. Data Detail Opsional (Next Page)

- Setelah metadata utama, tambah tombol "Tambah Data Detail (Opsional)" yang expand/collapse
- Berisi field tambahan sesuai kategori (mis. untuk Data Siswa: NIS, Tempat Lahir, dll.)
- Tidak wajib diisi

### d. Filter Folder Tujuan

- Tambah dropdown "Masukkan ke Folder" yang menampilkan folder dari arsip dokumen
- Auto-mapping berdasarkan jenis dokumen tetap berjalan

### e. Tanggal dengan Date Picker

- Tanggal Upload: tambah icon kalender yang bisa diklik untuk memilih tanggal
- Tahun Ajaran: ubah jadi dropdown dengan opsi 2023/2024, 2024/2025, 2025/2026, dan "Lainnya" (input manual)

### f. Konfirmasi Upload

- Saat klik Upload: tampilkan dialog konfirmasi "Apakah Anda yakin data sudah benar?"
- Setelah submit berhasil: toast notifikasi dengan tombol "Lihat di Arsip Dokumen" yang navigasi ke `/archive`

### g. Preview Sesuai File

- Preview menampilkan file yang benar-benar di-upload (untuk image: sudah ada, untuk PDF: tampilkan nama file, bukan dummy)

---

## 4. Arsip Dokumen

**File**: `src/pages/ArchivePage.tsx`

- Hapus field "Tambah catatan admin..." dari panel preview samping (tidak perlu catatan di setiap dokumen di semua role)

---

## 5. Detail Dokumen - Perbaikan UI

**File**: `src/components/modals/DocumentDetailModal.tsx`

- Role pengunggah: ganti tanda hubung (--) menjadi **badge/border** dengan warna khusus (misal: bg-primary/10 text-primary rounded-full px-2)
- Status aksi (Mengunggah, Menyetujui, dll.): tampilkan dalam **badge bordered** dengan warna khusus sesuai aksi
- Hapus penggunaan tanda "—" sebagai pemisah, ganti dengan border/badge styling

---

## 6. Manajemen User - CRUD Lengkap

**File**: `src/pages/UserManagementPage.tsx`

- **Create**: Tambah tombol "Tambah User" yang membuka modal form (Nama, Email, Role, Departemen)
- **Read**: Sudah ada (tabel user)
- **Update**: Tambah tombol "Edit" yang membuka modal edit semua field user
- **Delete**: Tambah tombol "Hapus" dengan konfirmasi dialog
- Semua aksi CRUD hanya bisa dilakukan oleh Admin/TU
- Tambah kolom Aksi yang lebih lengkap

**File**: `src/contexts/AppContext.tsx` - Tambah fungsi `addUser`, `updateUser`, `deleteUser`

---

## 7. Login - Tambah Google Login

**File**: `src/pages/LoginPage.tsx`

- Tambah tombol "Masuk dengan Google" di bawah form login (dengan ikon Google)
- Tombol ini simulasi saja (alert bahwa fitur memerlukan backend)
- Styling: border button dengan logo Google, teks "Masuk dengan Google"
- Tambah divider "atau" antara form login dan tombol Google

---

## 8. Pengaturan Sistem - Simplifikasi

**File**: `src/pages/SettingsPage.tsx`

- Hapus section "Export JSON" dari Reset & Export
- Hapus pengaturan frekuensi notifikasi
- Section "Reset & Export" diganti menjadi "Reset Sistem" saja
- Tombol: "Reset ke Default" saja

---

## 9. Alur Persetujuan - Simplifikasi

**File**: `src/pages/ApprovalPage.tsx`

- Hapus step "Review & Annotate" dan "Verifikasi & Tanda Tangan" dari workflow visual
- Workflow menjadi: Staff/Guru Upload -> Antrian Persetujuan -> Disetujui/Ditolak
- Tombol "Approve" diganti teks menjadi **"Setujui"**
- Modal konfirmasi: ganti dari biometrik menjadi konfirmasi sederhana "Apakah Anda yakin ingin menyetujui dokumen ini?"
- Hapus ikon Fingerprint dan referensi tanda tangan digital
- Hapus tombol "Review & Annotate" dari card actions
- Approval by system: setelah disetujui, dokumen otomatis masuk arsip (status langsung "Diarsipkan")

**File**: `src/pages/DashboardPage.tsx` (tab Persetujuan)
- Sama: ganti "Approve" menjadi "Setujui", simplifikasi modal konfirmasi

---

## 10. Pratinjau Dokumen

**File**: `src/components/modals/PdfPreviewOverlay.tsx`

- Pastikan preview bisa fullscreen (overlay/ngambang)
- Tetap ada tombol close
- Preview harus sesuai file yang di-upload (bukan dummy)

---

## Detail Teknis

### File yang Diubah

```text
src/components/layout/AppSidebar.tsx          - Collapse button ke atas
src/components/dashboard/ActivityChart.tsx     - Filter + status lines
src/components/upload/UploadForm.tsx           - Redesign form upload
src/components/modals/DocumentDetailModal.tsx  - Badge styling
src/pages/ArchivePage.tsx                      - Hapus catatan
src/pages/UserManagementPage.tsx               - CRUD user
src/pages/LoginPage.tsx                        - Google login button
src/pages/SettingsPage.tsx                     - Simplifikasi
src/pages/ApprovalPage.tsx                     - Simplifikasi workflow
src/pages/DashboardPage.tsx                    - Tab persetujuan update
src/contexts/AppContext.tsx                    - addUser, updateUser, deleteUser
src/data/mockData.ts                           - Chart data + kategori baru
```

### Kategori & Jenis Dokumen Mapping

```text
Data Siswa:
  - Surat Masuk dan Keluar Siswa
  - Surat Pindah Siswa
  - Ijazah SMP
  - SKHU
  - Rekapitulasi Absensi Siswa dan Guru

Data Guru:
  - Sertifikat Guru
  - Surat Keputusan (Arsip Surat)

Sarana Prasarana Sekolah:
  - Inventaris Sarana Prasarana

Surat Menyurat:
  - Surat Masuk dan Keluar Siswa
  - Surat Pindah Siswa

Keuangan:
  - (field manual)

Lainnya:
  - Sertifikat Prestasi Siswa
  - Lainnya (input manual)
```

### Workflow Persetujuan Baru (3 Step)

```text
1. Staff/Guru Upload
2. Antrian Persetujuan
3. Disetujui / Ditolak
```

### User CRUD Functions

```text
addUser(user: Omit<User, "id">)      - Generate ID, tambah ke state
updateUser(id, partial)                - Update field user
deleteUser(id)                         - Hapus dari state (tidak bisa hapus diri sendiri)
```

## 11. Website Responsive
- Website bisa responsif dengan baik dan tidak hancur baik itu dekstop maupun di mobile. Karena nantinya akan dipakai juga di MOBILE, terlebih untuk scan mobile.
