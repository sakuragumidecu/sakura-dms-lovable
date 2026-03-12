import avatarPrincipal from "@/assets/avatar_principal.jpg";
import avatarAdmin from "@/assets/avatar_admin.jpg";
import avatarStaff from "@/assets/avatar_staff.jpg";
import avatarTeacher from "@/assets/avatar_teacher.jpg";

export const USERS = [
  { id: 1, nama: "Budi Santoso", email: "admin@sakura.sch.id", role: "Operator/TU", avatar: avatarAdmin, departemen: "Operator / TU" },
  { id: 2, nama: "Dr. Siti Rahayu", email: "principal@sakura.sch.id", role: "Kepala Sekolah", avatar: avatarPrincipal, departemen: "Kepala Sekolah" },
  { id: 3, nama: "Ahmad Fauzi", email: "teacher@sakura.sch.id", role: "Guru", avatar: avatarTeacher, departemen: "Guru Mata Pelajaran" },
];

// ===== Schema-aligned tables (mirrors MySQL) =====

// Mirror of `categories` table
export const CATEGORIES = [
  { category_id: 1, category_name: "Data Siswa" },
  { category_id: 2, category_name: "Data Guru" },
  { category_id: 3, category_name: "Sarana Prasarana" },
  { category_id: 4, category_name: "Surat Menyurat" },
];

// Mirror of `document_types` table
export const DOCUMENT_TYPES = [
  { type_id: 1, category_id: 1, type_name: "Buku Klapper", code_prefix: "BKL" },
  { type_id: 2, category_id: 1, type_name: "Buku Induk Register Peserta Didik", code_prefix: "BIR" },
  { type_id: 3, category_id: 1, type_name: "Surat Keterangan Hasil Ujian (SKHU)", code_prefix: "SKH" },
  { type_id: 4, category_id: 1, type_name: "Ijazah SMP", code_prefix: "IJZ" },
  { type_id: 5, category_id: 2, type_name: "Buku Induk Pegawai", code_prefix: "BIP" },
  { type_id: 6, category_id: 2, type_name: "Sertifikat Pendidik", code_prefix: "SRP" },
  { type_id: 7, category_id: 2, type_name: "Catatan Diklat", code_prefix: "CDK" },
  { type_id: 8, category_id: 3, type_name: "Buku Inventaris Barang dan Penghapusan Barang", code_prefix: "BIB" },
  { type_id: 9, category_id: 3, type_name: "Buku Pemeliharaan & Perbaikan", code_prefix: "BPP" },
  { type_id: 10, category_id: 4, type_name: "Buku Agenda Surat Masuk", code_prefix: "ASM" },
  { type_id: 11, category_id: 4, type_name: "Buku Agenda Surat Keluar", code_prefix: "ASK" },
  { type_id: 12, category_id: 4, type_name: "Kumpulan Surat Keputusan (SK)", code_prefix: "KSK" },
];

// Mirror of `document_counters` table (mutable state managed in AppContext)
export const INITIAL_DOCUMENT_COUNTERS = [];

// Mirror of `folders` table — hierarchical: categories → document types (→ tahun_ajaran for Data Siswa)
export const FOLDERS = [
  // Root category folders
  { folder_id: 1, folder_name: "Data Siswa", parent_id: null, category_id: 1, type_id: null },
  { folder_id: 2, folder_name: "Data Guru", parent_id: null, category_id: 2, type_id: null },
  { folder_id: 3, folder_name: "Sarana Prasarana", parent_id: null, category_id: 3, type_id: null },
  { folder_id: 4, folder_name: "Surat Menyurat", parent_id: null, category_id: 4, type_id: null },
  // Data Siswa sub-folders (document types)
  { folder_id: 10, folder_name: "Buku Klapper", parent_id: 1, category_id: 1, type_id: 1 },
  { folder_id: 11, folder_name: "Buku Induk Register Peserta Didik", parent_id: 1, category_id: 1, type_id: 2 },
  { folder_id: 12, folder_name: "Surat Keterangan Hasil Ujian (SKHU)", parent_id: 1, category_id: 1, type_id: 3 },
  { folder_id: 13, folder_name: "Ijazah SMP", parent_id: 1, category_id: 1, type_id: 4 },
  // Data Guru sub-folders
  { folder_id: 20, folder_name: "Buku Induk Pegawai", parent_id: 2, category_id: 2, type_id: 5 },
  { folder_id: 21, folder_name: "Sertifikat Pendidik", parent_id: 2, category_id: 2, type_id: 6 },
  { folder_id: 22, folder_name: "Catatan Diklat", parent_id: 2, category_id: 2, type_id: 7 },
  // Sarana Prasarana sub-folders
  { folder_id: 30, folder_name: "Buku Inventaris Barang dan Penghapusan Barang", parent_id: 3, category_id: 3, type_id: 8 },
  { folder_id: 31, folder_name: "Buku Pemeliharaan & Perbaikan", parent_id: 3, category_id: 3, type_id: 9 },
  // Surat Menyurat sub-folders
  { folder_id: 40, folder_name: "Buku Agenda Surat Masuk", parent_id: 4, category_id: 4, type_id: 10 },
  { folder_id: 41, folder_name: "Buku Agenda Surat Keluar", parent_id: 4, category_id: 4, type_id: 11 },
  { folder_id: 42, folder_name: "Kumpulan Surat Keputusan (SK)", parent_id: 4, category_id: 4, type_id: 12 },
];

// Backward-compatible derived exports
export const KATEGORI_OPTIONS = CATEGORIES.map((c) => c.category_name);

// Dynamic form field definitions per category (maps to separate DB tables)
// category_id → fields definition
export const CATEGORY_FORM_FIELDS = {
  // Data Siswa → student_records table
  1: [
    { key: "namaSiswa", label: "Nama Siswa", placeholder: "Nama lengkap siswa", required: true },
    { key: "nis", label: "NIS", placeholder: "Nomor Induk Siswa" },
    { key: "nisn", label: "NISN", placeholder: "00xxxxxxxx" },
    { key: "kelas", label: "Kelas", placeholder: "Contoh: Kelas 7A / Alumni 2024" },
    { key: "tahunAjaran", label: "Tahun Ajaran", type: "tahun_ajaran" },
    { key: "tempatLahir", label: "Tempat Lahir", placeholder: "Contoh: Bekasi" },
    { key: "tanggalLahir", label: "Tanggal Lahir", placeholder: "DD/MM/YYYY", type: "date" },
    { key: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
    { key: "namaOrangTua", label: "Nama Orang Tua", placeholder: "Nama lengkap orang tua/wali" },
    { key: "noHpOrangTua", label: "No HP Orang Tua", placeholder: "08xxxxxxxxxx" },
  ],
  // Data Guru → teacher_records table
  2: [
    { key: "namaGuru", label: "Nama Guru", placeholder: "Nama lengkap guru", required: true },
    { key: "nip", label: "NIP", placeholder: "Nomor Induk Pegawai" },
    { key: "nuptk", label: "NUPTK", placeholder: "Nomor Unik Pendidik" },
    { key: "mataPelajaran", label: "Mata Pelajaran", placeholder: "Contoh: Matematika" },
    { key: "pendidikanTerakhir", label: "Pendidikan Terakhir", placeholder: "Contoh: S1 Pendidikan" },
    { key: "statusKepegawaian", label: "Status Kepegawaian", type: "select", options: ["PNS", "PPPK", "Honorer", "GTT"] },
  ],
  // Sarana Prasarana → inventory_items table
  3: [
    { key: "kodeBarang", label: "Kode Barang", placeholder: "Contoh: INV-001", required: true },
    { key: "namaBarang", label: "Nama Barang", placeholder: "Contoh: Meja Guru" },
    { key: "jumlah", label: "Jumlah", placeholder: "Contoh: 10", type: "number" },
    { key: "tahunPengadaan", label: "Tahun Pengadaan", placeholder: "Contoh: 2024" },
    { key: "kondisi", label: "Kondisi", type: "select", options: ["Baik", "Rusak Ringan", "Rusak Berat"] },
    { key: "lokasi", label: "Lokasi", placeholder: "Contoh: Ruang Lab IPA" },
  ],
};

// Surat Menyurat has sub-type specific fields (maps to different tables per type)
export const SURAT_TYPE_FORM_FIELDS = {
  // Buku Agenda Surat Masuk (type_id: 10) → incoming_letters table
  10: [
    { key: "nomorAgenda", label: "Nomor Agenda", placeholder: "Contoh: 001/SM/2026", required: true },
    { key: "nomorSurat", label: "Nomor Surat", placeholder: "Nomor surat masuk" },
    { key: "tanggalSurat", label: "Tanggal Surat", placeholder: "DD/MM/YYYY", type: "date" },
    { key: "tanggalDiterima", label: "Tanggal Diterima", placeholder: "DD/MM/YYYY", type: "date" },
    { key: "pengirim", label: "Pengirim", placeholder: "Contoh: Dinas Pendidikan" },
    { key: "perihal", label: "Perihal", placeholder: "Perihal surat" },
  ],
  // Buku Agenda Surat Keluar (type_id: 11) → outgoing_letters table
  11: [
    { key: "nomorAgenda", label: "Nomor Agenda", placeholder: "Contoh: 001/SK/2026", required: true },
    { key: "nomorSurat", label: "Nomor Surat", placeholder: "Nomor surat keluar" },
    { key: "tanggalSurat", label: "Tanggal Surat", placeholder: "DD/MM/YYYY", type: "date" },
    { key: "tujuan", label: "Tujuan", placeholder: "Contoh: Dinas Pendidikan Kab. Bekasi" },
    { key: "perihal", label: "Perihal", placeholder: "Perihal surat" },
    { key: "penandatangan", label: "Penandatangan", placeholder: "Nama penandatangan" },
  ],
  // Kumpulan Surat Keputusan (type_id: 12) → sk_records table
  12: [
    { key: "nomorSK", label: "Nomor SK", placeholder: "Contoh: 001/SK/2026", required: true },
    { key: "tanggalSK", label: "Tanggal SK", placeholder: "DD/MM/YYYY", type: "date" },
    { key: "tentang", label: "Tentang", placeholder: "Contoh: Pengangkatan Guru Tetap" },
    { key: "penandatangan", label: "Penandatangan", placeholder: "Nama penandatangan" },
  ],
};

// Keep backward compat
export const KATEGORI_DETAIL_FIELDS = {};

export const TAHUN_AJARAN_OPTIONS = ["2023/2024", "2024/2025", "2025/2026"];

// Mock documents with schema-aligned fields
export const DOCUMENTS = [
  {
    id: 1, nomorDokumen: "IJZ/2024/001", judul: "Ijazah - Ahmad Rizki",
    kategori: "Data Siswa", category_id: 1, type_id: 4, folder_id: 13,
    kelas: "Alumni 2024", class_info: "Alumni 2024",
    jenisDokumen: "Ijazah SMP", namaSiswa: "Ahmad Rizki", nisn: "0012345678", tahunAjaran: "2023/2024",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-08-22T15:49:05Z", tanggalEdit: "2025-08-23T10:12:00Z", status: "Disetujui", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-08-22T15:49:05Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-08-23T09:59:10Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Melihat dokumen" },
      { time: "2025-08-23T10:12:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 2, nomorDokumen: "BKL/2024/001", judul: "Buku Klapper Kelas 7A",
    kategori: "Data Siswa", category_id: 1, type_id: 1, folder_id: 10,
    kelas: "Kelas 7A", class_info: "Kelas 7A",
    jenisDokumen: "Buku Klapper", namaSiswa: "Kelas 7A", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-01T08:24:00Z", tanggalEdit: "2025-09-01T09:54:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf", catatan: "Dokumen sensitif - perlu review",
    auditTrail: [
      { time: "2025-09-01T08:24:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 3, nomorDokumen: "BIP/2024/001", judul: "Data Pegawai - Rina Wati",
    kategori: "Data Guru", category_id: 2, type_id: 5, folder_id: 20,
    kelas: "-", class_info: "-",
    jenisDokumen: "Buku Induk Pegawai", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-05T10:00:00Z", tanggalEdit: "2025-09-06T14:30:00Z", status: "Disetujui", versi: 2,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-05T10:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-09-06T14:30:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 4, nomorDokumen: "IJZ/2024/002", judul: "Ijazah - Siti Nurhaliza",
    kategori: "Data Siswa", category_id: 1, type_id: 4, folder_id: 13,
    kelas: "Alumni 2024", class_info: "Alumni 2024",
    jenisDokumen: "Ijazah SMP", namaSiswa: "Siti Nurhaliza", nisn: "0012345679", tahunAjaran: "2023/2024",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-10T11:00:00Z", tanggalEdit: "2025-09-10T15:00:00Z", status: "Ditolak", versi: 1,
    fileUrl: "/mock/sample.pdf", catatan: "Format tidak sesuai standar",
    auditTrail: [
      { time: "2025-09-10T11:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-09-10T15:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menolak dokumen: Format tidak sesuai standar" },
    ],
  },
  {
    id: 5, nomorDokumen: "BIR/2024/001", judul: "Buku Induk Register Kelas 8B",
    kategori: "Data Siswa", category_id: 1, type_id: 2, folder_id: 11,
    kelas: "Kelas 8B", class_info: "Kelas 8B",
    jenisDokumen: "Buku Induk Register Peserta Didik", tahunAjaran: "2023/2024",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-07-15T09:00:00Z", tanggalEdit: "2025-08-01T10:00:00Z", status: "Diarsipkan", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-07-15T09:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-07-20T10:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
      { time: "2025-08-01T10:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengarsipkan dokumen" },
    ],
  },
  {
    id: 6, nomorDokumen: "SKH/2024/001", judul: "SKHU Kelas 9C",
    kategori: "Data Siswa", category_id: 1, type_id: 3, folder_id: 12,
    kelas: "Kelas 9C", class_info: "Kelas 9C",
    jenisDokumen: "Surat Keterangan Hasil Ujian (SKHU)", namaSiswa: "Kelas 9C", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-12T07:30:00Z", tanggalEdit: "2025-09-12T07:30:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-12T07:30:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 7, nomorDokumen: "SRP/2024/001", judul: "Sertifikat Pendidik - Andi Prasetyo",
    kategori: "Data Guru", category_id: 2, type_id: 6, folder_id: 21,
    kelas: "-", class_info: "-",
    jenisDokumen: "Sertifikat Pendidik", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-08T13:00:00Z", tanggalEdit: "2025-09-09T08:00:00Z", status: "Disetujui", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-08T13:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-09-09T08:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 8, nomorDokumen: "ASM/2024/001", judul: "Surat Masuk Dinas Pendidikan",
    kategori: "Surat Menyurat", category_id: 4, type_id: 10, folder_id: 40,
    kelas: "-", class_info: "-",
    jenisDokumen: "Buku Agenda Surat Masuk", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-15T10:00:00Z", tanggalEdit: "2025-09-15T10:00:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-15T10:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
    ],
  },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, message: "Dokumen 'SKHU Kelas 9C' menunggu persetujuan", time: "2025-09-12T07:30:00Z", read: false, type: "upload", docId: 6 },
  { id: 2, message: "Dokumen 'Surat Masuk Dinas Pendidikan' menunggu persetujuan", time: "2025-09-15T10:00:00Z", read: false, type: "upload", docId: 8 },
  { id: 3, message: "Dokumen 'Ijazah - Siti Nurhaliza' telah ditolak", time: "2025-09-10T15:00:00Z", read: true, type: "rejection", docId: 4 },
];

export const PERMISSIONS = [
  { key: "dashboard.view", label: "Dashboard" },
  { key: "documents.upload", label: "Upload Dokumen" },
  { key: "documents.approve", label: "Setujui Dokumen" },
  { key: "documents.reject", label: "Tolak Dokumen" },
  { key: "documents.archive", label: "Akses Arsip" },
  { key: "documents.edit", label: "Edit Dokumen" },
  { key: "users.manage", label: "Kelola User" },
  { key: "roles.manage", label: "Kelola Role" },
  { key: "audit.view", label: "Log Sistem" },
  { key: "audit.addNote", label: "Tambah Catatan Jejak Aktivitas" },
  { key: "profile.edit", label: "Pengaturan Profil" },
];

export const ROLE_PERMISSIONS = {
  "Operator/TU": ["dashboard.view", "documents.upload", "documents.archive", "documents.edit", "users.manage", "roles.manage", "audit.view", "audit.addNote", "profile.edit"],
  "Kepala Sekolah": ["dashboard.view", "documents.approve", "documents.reject", "documents.archive", "audit.view", "profile.edit"],
  "Guru": ["dashboard.view", "documents.archive", "profile.edit"],
};

export const CHART_MONTHS = [
  { label: "September 2025", value: "2025-09" },
  { label: "Agustus 2025", value: "2025-08" },
  { label: "Juli 2025", value: "2025-07" },
];

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function generateWeeklyData(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = Math.max(1, daysInMonth - 6);
  const labels = [];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month - 1, startDay + i);
    const dayName = HARI[d.getDay()];
    const bulan = BULAN_SHORT[d.getMonth()];
    labels.push(`${dayName}, ${d.getDate()} ${bulan} ${year}`);
    dates.push(`${year}-${String(month).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return { labels, dates, uploads: [3, 5, 2, 4, 6, 3, 2], disetujui: [1, 2, 1, 1, 2, 1, 1], ditolak: [0, 1, 1, 0, 0, 1, 0], menunggu: [2, 2, 0, 3, 4, 1, 1] };
}

function generateMonthlyData(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const bulan = BULAN_SHORT[month - 1];
  const labels = [];
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    labels.push(`${i} ${bulan} ${year}`);
    dates.push(`${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
  }
  return {
    labels, dates,
    uploads: Array.from({ length: daysInMonth }, (_, i) => [3,5,2,4,6,3,2,4,1,3,5,2,6,3,4,2,5,3,1,4,6,2,3,5,4,2,3,1,4,5,2][i] ?? 2),
    disetujui: Array.from({ length: daysInMonth }, (_, i) => [1,2,1,1,2,1,1,2,0,1,2,1,3,1,2,1,2,1,0,1,3,1,1,2,2,1,1,0,2,2,1][i] ?? 1),
    ditolak: Array.from({ length: daysInMonth }, (_, i) => [0,1,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0][i] ?? 0),
    menunggu: Array.from({ length: daysInMonth }, (_, i) => [2,2,0,3,4,1,1,2,0,2,2,1,3,1,2,0,3,2,0,3,3,0,2,3,1,1,1,1,2,2,1][i] ?? 1),
  };
}

export function getChartData(period, monthStr) {
  return period === "weekly" ? generateWeeklyData(monthStr) : generateMonthlyData(monthStr);
}

// Build folder tree from FOLDERS table (schema-aligned) + academic year nodes for Data Siswa
export function buildFolderTree(documents) {
  const tree = [];

  // Build from FOLDERS table hierarchy
  const rootFolders = FOLDERS.filter((f) => f.parent_id === null);

  rootFolders.forEach((root) => {
    const children = FOLDERS.filter((f) => f.parent_id === root.folder_id);
    const childNodes = children.map((child) => {
      // For Data Siswa category, add tahun_ajaran sub-folders
      if (root.category_id === 1) {
        const yearSet = new Set();
        documents.forEach((doc) => {
          if (doc.type_id === child.type_id && doc.tahunAjaran) {
            yearSet.add(doc.tahunAjaran);
          }
        });
        const yearChildren = [...yearSet].sort().reverse().map((year) => ({
          name: year,
          path: `cat:${root.category_id}/type:${child.type_id}/year:${year}`,
          folder_id: child.folder_id,
          category_id: root.category_id,
          type_id: child.type_id,
          tahunAjaran: year,
          children: [],
        }));
        return {
          name: child.folder_name,
          path: `cat:${root.category_id}/type:${child.type_id}`,
          folder_id: child.folder_id,
          category_id: root.category_id,
          type_id: child.type_id,
          children: yearChildren,
        };
      }
      return {
        name: child.folder_name,
        path: `cat:${root.category_id}/type:${child.type_id}`,
        folder_id: child.folder_id,
        category_id: root.category_id,
        type_id: child.type_id,
        children: [],
      };
    });

    tree.push({
      name: root.folder_name,
      path: `cat:${root.category_id}`,
      folder_id: root.folder_id,
      category_id: root.category_id,
      children: childNodes,
    });
  });

  return tree;
}

// Match document to folder path using schema-aligned path format
export function docMatchesFolder(doc, folderPath) {
  // Parse the structured path: cat:X, cat:X/type:Y, cat:X/type:Y/year:Z
  const parts = folderPath.split("/");
  const catPart = parts.find((p) => p.startsWith("cat:"));
  const typePart = parts.find((p) => p.startsWith("type:"));
  const yearPart = parts.find((p) => p.startsWith("year:"));

  const catId = catPart ? Number(catPart.split(":")[1]) : null;
  const typeId = typePart ? Number(typePart.split(":")[1]) : null;
  const year = yearPart ? yearPart.split(":")[1] : null;

  if (catId && doc.category_id !== catId) return false;
  if (typeId && doc.type_id !== typeId) return false;
  if (year && doc.tahunAjaran !== year) return false;

  // If only category specified, match all docs in that category
  if (catId && !typeId) return doc.category_id === catId;
  // If category+type, match docs with that type
  if (catId && typeId && !year) return doc.category_id === catId && doc.type_id === typeId;
  // If all three, exact match
  return true;
}

// Helper: get auto-mapped folder path for upload
export function getAutoFolderPath(categoryId, typeId, tahunAjaran) {
  const cat = CATEGORIES.find((c) => c.category_id === categoryId);
  const docType = DOCUMENT_TYPES.find((t) => t.type_id === typeId);
  if (!cat || !docType) return "";

  let path = `${cat.category_name} / ${docType.type_name}`;
  // For Data Siswa, include tahun ajaran
  if (categoryId === 1 && tahunAjaran) {
    path += ` / ${tahunAjaran}`;
  }
  return path;
}

// Helper: get folder_id for a document based on category and type
export function getFolderIdForDocument(categoryId, typeId) {
  const folder = FOLDERS.find((f) => f.category_id === categoryId && f.type_id === typeId);
  return folder ? folder.folder_id : null;
}
