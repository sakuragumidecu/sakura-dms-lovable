import avatarPrincipal from "@/assets/avatar_principal.jpg";
import avatarAdmin from "@/assets/avatar_admin.jpg";
import avatarStaff from "@/assets/avatar_staff.jpg";
import avatarTeacher from "@/assets/avatar_teacher.jpg";

export type UserRole = "Administrator IT" | "Kepala Sekolah" | "Staff Administrasi" | "Guru";

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  avatar: string;
  departemen: string;
}

export interface AuditEntry {
  time: string;
  user: { nama: string; avatar: string; role: string };
  action: string;
  note?: string;
}

export interface Document {
  id: number;
  nomorDokumen: string;
  judul: string;
  kategori: string;
  kelas: string;
  jenisDokumen?: string;
  namaSiswa?: string;
  nisn?: string;
  tahunAjaran?: string;
  pengunggah: { id: number; nama: string; role: string; avatar: string };
  tanggalUpload: string;
  tanggalEdit: string;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "Diarsipkan";
  versi: number;
  fileUrl: string;
  catatan?: string;
  auditTrail: AuditEntry[];
  favorite?: boolean;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: "upload" | "approval" | "rejection" | "archive";
  docId?: number;
}

export const USERS: User[] = [
  { id: 1, nama: "Budi Santoso", email: "admin@sakura.sch.id", role: "Administrator IT", avatar: avatarAdmin, departemen: "Operator / TU" },
  { id: 2, nama: "Dr. Siti Rahayu", email: "principal@sakura.sch.id", role: "Kepala Sekolah", avatar: avatarPrincipal, departemen: "Kepala Sekolah" },
  { id: 3, nama: "Dewi Kartika", email: "staff@sakura.sch.id", role: "Staff Administrasi", avatar: avatarStaff, departemen: "Tata Usaha" },
  { id: 4, nama: "Ahmad Fauzi", email: "teacher@sakura.sch.id", role: "Guru", avatar: avatarTeacher, departemen: "Guru Mata Pelajaran" },
];

export const DOCUMENTS: Document[] = [
  {
    id: 1, nomorDokumen: "IJZ-2024-001", judul: "Ijazah - Ahmad Rizki", kategori: "Ijazah", kelas: "Alumni 2024",
    jenisDokumen: "Ijazah", namaSiswa: "Ahmad Rizki", nisn: "0012345678", tahunAjaran: "2023/2024",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-08-22T15:49:05Z", tanggalEdit: "2025-08-23T10:12:00Z", status: "Disetujui", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-08-22T15:49:05Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
      { time: "2025-08-23T09:59:10Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Melihat dokumen" },
      { time: "2025-08-23T10:12:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 2, nomorDokumen: "NLI-2024-015", judul: "Laporan Nilai Semester Ganjil Kelas 7A", kategori: "Nilai", kelas: "Kelas 7A",
    jenisDokumen: "Rapor", namaSiswa: "Kelas 7A", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-01T08:24:00Z", tanggalEdit: "2025-09-01T09:54:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf", catatan: "Dokumen sensitif - perlu review",
    auditTrail: [
      { time: "2025-09-01T08:24:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 3, nomorDokumen: "SK-2024-003", judul: "SK Pengangkatan Guru Tetap - Rina Wati", kategori: "SK", kelas: "Guru",
    jenisDokumen: "Surat Keputusan", tahunAjaran: "2024/2025",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-09-05T10:00:00Z", tanggalEdit: "2025-09-06T14:30:00Z", status: "Disetujui", versi: 2,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-05T10:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
      { time: "2025-09-06T14:30:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 4, nomorDokumen: "IJZ-2024-002", judul: "Ijazah - Siti Nurhaliza", kategori: "Ijazah", kelas: "Alumni 2024",
    jenisDokumen: "Ijazah", namaSiswa: "Siti Nurhaliza", nisn: "0012345679", tahunAjaran: "2023/2024",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-09-10T11:00:00Z", tanggalEdit: "2025-09-10T15:00:00Z", status: "Ditolak", versi: 1,
    fileUrl: "/mock/sample.pdf", catatan: "Format tidak sesuai standar",
    auditTrail: [
      { time: "2025-09-10T11:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
      { time: "2025-09-10T15:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menolak dokumen — Format tidak sesuai standar" },
    ],
  },
  {
    id: 5, nomorDokumen: "ARS-2024-001", judul: "Arsip Data Siswa Kelas 8B", kategori: "Data Siswa", kelas: "Kelas 8B",
    jenisDokumen: "Data Siswa", tahunAjaran: "2023/2024",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-07-15T09:00:00Z", tanggalEdit: "2025-08-01T10:00:00Z", status: "Diarsipkan", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-07-15T09:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
      { time: "2025-07-20T10:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
      { time: "2025-08-01T10:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengarsipkan dokumen" },
    ],
  },
  {
    id: 6, nomorDokumen: "NLI-2024-016", judul: "Laporan Nilai UTS Kelas 9C", kategori: "Nilai", kelas: "Kelas 9C",
    jenisDokumen: "Rapor", namaSiswa: "Kelas 9C", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-12T07:30:00Z", tanggalEdit: "2025-09-12T07:30:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-12T07:30:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 7, nomorDokumen: "SK-2024-004", judul: "SK Mutasi Guru - Andi Prasetyo", kategori: "SK", kelas: "Guru",
    jenisDokumen: "Surat Keputusan", tahunAjaran: "2024/2025",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-09-08T13:00:00Z", tanggalEdit: "2025-09-09T08:00:00Z", status: "Disetujui", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-08T13:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
      { time: "2025-09-09T08:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 8, nomorDokumen: "LAP-2024-001", judul: "Laporan Keuangan Semester 1", kategori: "Laporan", kelas: "Sekolah",
    jenisDokumen: "Laporan Keuangan", tahunAjaran: "2024/2025",
    pengunggah: { id: 3, nama: "Dewi Kartika", role: "Staff Administrasi", avatar: avatarStaff },
    tanggalUpload: "2025-09-15T10:00:00Z", tanggalEdit: "2025-09-15T10:00:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-15T10:00:00Z", user: { nama: "Dewi Kartika", avatar: avatarStaff, role: "Staff Administrasi" }, action: "Mengunggah dokumen" },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, message: "Dokumen 'Laporan Nilai UTS Kelas 9C' menunggu persetujuan", time: "2025-09-12T07:30:00Z", read: false, type: "upload", docId: 6 },
  { id: 2, message: "Dokumen 'Laporan Keuangan Semester 1' menunggu persetujuan", time: "2025-09-15T10:00:00Z", read: false, type: "upload", docId: 8 },
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

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  "Administrator IT": ["dashboard.view", "documents.upload", "documents.archive", "documents.edit", "users.manage", "roles.manage", "audit.view", "audit.addNote", "profile.edit"],
  "Kepala Sekolah": ["dashboard.view", "documents.approve", "documents.reject", "audit.view", "profile.edit"],
  "Staff Administrasi": ["dashboard.view", "documents.upload", "documents.archive", "profile.edit"],
  "Guru": ["dashboard.view", "documents.upload", "documents.archive", "profile.edit"],
};

export const CHART_DATA = {
  labels: ["Sab, 3", "Min, 4", "Sen, 5", "Sel, 6", "Rab, 7", "Kam, 8", "Jum, 9"],
  dates: ["2025-09-03", "2025-09-04", "2025-09-05", "2025-09-06", "2025-09-07", "2025-09-08", "2025-09-09"],
  uploads: [3, 5, 2, 4, 6, 3, 2],
  approvals: [1, 3, 2, 1, 2, 2, 1],
};

export const FOLDER_STRUCTURE = [
  {
    name: "2025", children: [
      { name: "Kelas 7A" }, { name: "Kelas 7B" }, { name: "Kelas 8A" },
      { name: "Kelas 8B" }, { name: "Kelas 9A" }, { name: "Kelas 9C" },
    ],
  },
  {
    name: "2024", children: [
      { name: "Alumni 2024" }, { name: "Kelas 7A" }, { name: "Kelas 8B" },
    ],
  },
  { name: "Guru", children: [] },
  { name: "Sekolah", children: [] },
];
