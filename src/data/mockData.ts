import avatarPrincipal from "@/assets/avatar_principal.jpg";
import avatarAdmin from "@/assets/avatar_admin.jpg";
import avatarStaff from "@/assets/avatar_staff.jpg";
import avatarTeacher from "@/assets/avatar_teacher.jpg";

export type UserRole = "Operator/TU" | "Kepala Sekolah" | "Guru";

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
  folderTujuan?: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: "upload" | "approval" | "rejection" | "archive";
  docId?: number;
}

export interface FolderNode {
  name: string;
  path: string;
  children: FolderNode[];
}

export const USERS: User[] = [
  { id: 1, nama: "Budi Santoso", email: "admin@sakura.sch.id", role: "Operator/TU", avatar: avatarAdmin, departemen: "Operator / TU" },
  { id: 2, nama: "Dr. Siti Rahayu", email: "principal@sakura.sch.id", role: "Kepala Sekolah", avatar: avatarPrincipal, departemen: "Kepala Sekolah" },
  { id: 3, nama: "Ahmad Fauzi", email: "teacher@sakura.sch.id", role: "Guru", avatar: avatarTeacher, departemen: "Guru Mata Pelajaran" },
];

export const DOCUMENTS: Document[] = [
  {
    id: 1, nomorDokumen: "IJZ-2024-001", judul: "Ijazah - Ahmad Rizki", kategori: "Data Siswa", kelas: "Alumni 2024",
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
    id: 2, nomorDokumen: "NLI-2024-015", judul: "Laporan Nilai Semester Ganjil Kelas 7A", kategori: "Data Siswa", kelas: "Kelas 7A",
    jenisDokumen: "Rekapitulasi Absensi Siswa dan Guru", namaSiswa: "Kelas 7A", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-01T08:24:00Z", tanggalEdit: "2025-09-01T09:54:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf", catatan: "Dokumen sensitif - perlu review",
    auditTrail: [
      { time: "2025-09-01T08:24:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 3, nomorDokumen: "SK-2024-003", judul: "SK Pengangkatan Guru Tetap - Rina Wati", kategori: "Data Guru", kelas: "Guru",
    jenisDokumen: "Surat Keputusan (Arsip Surat)", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-05T10:00:00Z", tanggalEdit: "2025-09-06T14:30:00Z", status: "Disetujui", versi: 2,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-05T10:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-09-06T14:30:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 4, nomorDokumen: "IJZ-2024-002", judul: "Ijazah - Siti Nurhaliza", kategori: "Data Siswa", kelas: "Alumni 2024",
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
    id: 5, nomorDokumen: "ARS-2024-001", judul: "Arsip Data Siswa Kelas 8B", kategori: "Data Siswa", kelas: "Kelas 8B",
    jenisDokumen: "Surat Masuk dan Keluar Siswa", tahunAjaran: "2023/2024",
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
    id: 6, nomorDokumen: "NLI-2024-016", judul: "Laporan Nilai UTS Kelas 9C", kategori: "Data Siswa", kelas: "Kelas 9C",
    jenisDokumen: "Rekapitulasi Absensi Siswa dan Guru", namaSiswa: "Kelas 9C", nisn: "-", tahunAjaran: "2024/2025",
    pengunggah: { id: 4, nama: "Ahmad Fauzi", role: "Guru", avatar: avatarTeacher },
    tanggalUpload: "2025-09-12T07:30:00Z", tanggalEdit: "2025-09-12T07:30:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-12T07:30:00Z", user: { nama: "Ahmad Fauzi", avatar: avatarTeacher, role: "Guru" }, action: "Mengunggah dokumen" },
    ],
  },
  {
    id: 7, nomorDokumen: "SK-2024-004", judul: "SK Mutasi Guru - Andi Prasetyo", kategori: "Data Guru", kelas: "Guru",
    jenisDokumen: "Surat Keputusan (Arsip Surat)", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-08T13:00:00Z", tanggalEdit: "2025-09-09T08:00:00Z", status: "Disetujui", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-08T13:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
      { time: "2025-09-09T08:00:00Z", user: { nama: "Dr. Siti Rahayu", avatar: avatarPrincipal, role: "Kepala Sekolah" }, action: "Menyetujui dokumen" },
    ],
  },
  {
    id: 8, nomorDokumen: "LAP-2024-001", judul: "Laporan Keuangan Semester 1", kategori: "Keuangan", kelas: "Sekolah",
    jenisDokumen: "Laporan Keuangan", tahunAjaran: "2024/2025",
    pengunggah: { id: 1, nama: "Budi Santoso", role: "Operator/TU", avatar: avatarAdmin },
    tanggalUpload: "2025-09-15T10:00:00Z", tanggalEdit: "2025-09-15T10:00:00Z", status: "Menunggu", versi: 1,
    fileUrl: "/mock/sample.pdf",
    auditTrail: [
      { time: "2025-09-15T10:00:00Z", user: { nama: "Budi Santoso", avatar: avatarAdmin, role: "Operator/TU" }, action: "Mengunggah dokumen" },
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
  "Operator/TU": ["dashboard.view", "documents.upload", "documents.archive", "documents.edit", "users.manage", "roles.manage", "audit.view", "audit.addNote", "profile.edit"],
  "Kepala Sekolah": ["dashboard.view", "documents.approve", "documents.reject", "documents.archive", "audit.view", "profile.edit"],
  "Guru": ["dashboard.view", "documents.archive", "profile.edit"],
};

// Kategori & Jenis Dokumen mapping
export const KATEGORI_OPTIONS = [
  "Data Siswa",
  "Data Guru",
  "Sarana Prasarana Sekolah",
  "Surat Menyurat",
  "Keuangan",
  "Lainnya",
];

export const KATEGORI_JENIS_MAP: Record<string, string[]> = {
  "Data Siswa": [
    "Surat Masuk dan Keluar Siswa",
    "Surat Pindah Siswa",
    "Ijazah SMP",
    "Surat Keterangan Hasil Ujian (SKHU)",
    "Rekapitulasi Absensi Siswa dan Guru",
    "Sertifikat Prestasi Siswa",
  ],
  "Data Guru": [
    "Sertifikat Guru",
    "Surat Keputusan (Arsip Surat)",
    "Rekapitulasi Absensi Siswa dan Guru",
  ],
  "Sarana Prasarana Sekolah": [
    "Inventaris Sarana Prasarana",
  ],
  "Surat Menyurat": [
    "Surat Masuk dan Keluar Siswa",
    "Surat Pindah Siswa",
    "Surat Keputusan (Arsip Surat)",
  ],
  "Keuangan": [
    "Laporan Keuangan",
  ],
  "Lainnya": [
    "Sertifikat Prestasi Siswa",
    "Lainnya",
  ],
};

// Detail fields per category (optional)
export const KATEGORI_DETAIL_FIELDS: Record<string, { key: string; label: string; placeholder: string }[]> = {
  "Data Siswa": [
    { key: "nis", label: "NIS", placeholder: "Nomor Induk Siswa" },
    { key: "tempatLahir", label: "Tempat Lahir", placeholder: "Contoh: Bekasi" },
    { key: "tanggalLahir", label: "Tanggal Lahir", placeholder: "DD/MM/YYYY" },
    { key: "namaOrangTua", label: "Nama Orang Tua/Wali", placeholder: "Nama lengkap" },
    { key: "alamat", label: "Alamat", placeholder: "Alamat lengkap" },
  ],
  "Data Guru": [
    { key: "nip", label: "NIP", placeholder: "Nomor Induk Pegawai" },
    { key: "bidangStudi", label: "Bidang Studi", placeholder: "Contoh: Matematika" },
    { key: "jabatan", label: "Jabatan", placeholder: "Contoh: Guru Tetap" },
  ],
  "Sarana Prasarana Sekolah": [
    { key: "kodeBarang", label: "Kode Barang", placeholder: "Contoh: INV-001" },
    { key: "lokasi", label: "Lokasi", placeholder: "Contoh: Ruang Lab IPA" },
    { key: "kondisi", label: "Kondisi", placeholder: "Baik / Rusak Ringan / Rusak Berat" },
  ],
};

export const TAHUN_AJARAN_OPTIONS = ["2023/2024", "2024/2025", "2025/2026"];

export const CHART_MONTHS = [
  { label: "September 2025", value: "2025-09" },
  { label: "Agustus 2025", value: "2025-08" },
  { label: "Juli 2025", value: "2025-07" },
];

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function generateWeeklyData(monthStr: string) {
  const [year, month] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = Math.max(1, daysInMonth - 6);
  const labels: string[] = [];
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month - 1, startDay + i);
    const dayName = HARI[d.getDay()];
    const bulan = BULAN_SHORT[d.getMonth()];
    labels.push(`${dayName}, ${d.getDate()} ${bulan} ${year}`);
    dates.push(`${year}-${String(month).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return {
    labels, dates,
    uploads: [3, 5, 2, 4, 6, 3, 2],
    disetujui: [1, 2, 1, 1, 2, 1, 1],
    ditolak: [0, 1, 1, 0, 0, 1, 0],
    menunggu: [2, 2, 0, 3, 4, 1, 1],
  };
}

function generateMonthlyData(monthStr: string) {
  const [year, month] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const bulan = BULAN_SHORT[month - 1];
  const labels: string[] = [];
  const dates: string[] = [];
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

export function getChartData(period: "weekly" | "monthly", monthStr: string) {
  return period === "weekly" ? generateWeeklyData(monthStr) : generateMonthlyData(monthStr);
}

/** Build dynamic folder tree from documents based on metadata */
export function buildFolderTree(documents: Document[]): FolderNode[] {
  const yearMap = new Map<string, Map<string, boolean>>();
  const standaloneCategories = new Set<string>();

  documents.forEach((doc) => {
    const tahun = doc.tahunAjaran || "";
    const yearMatch = tahun.match(/(\d{4})\/(\d{4})/);
    const year = yearMatch ? yearMatch[2] : tahun || "Lainnya";
    const kelas = doc.kelas || "-";

    if (/^(Kelas|Alumni)/i.test(kelas)) {
      if (!yearMap.has(year)) yearMap.set(year, new Map());
      yearMap.get(year)!.set(kelas, true);
    } else {
      standaloneCategories.add(kelas);
    }
  });

  const tree: FolderNode[] = [];

  const sortedYears = [...yearMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  sortedYears.forEach(([year, classMap]) => {
    const children = [...classMap.keys()]
      .sort()
      .map((cls) => ({ name: cls, path: `${year}/${cls}`, children: [] }));
    tree.push({ name: year, path: year, children });
  });

  [...standaloneCategories].sort().forEach((cat) => {
    tree.push({ name: cat, path: cat, children: [] });
  });

  return tree;
}

/** Check if a document matches a folder path */
export function docMatchesFolder(doc: Document, folderPath: string): boolean {
  const tahun = doc.tahunAjaran || "";
  const yearMatch = tahun.match(/(\d{4})\/(\d{4})/);
  const year = yearMatch ? yearMatch[2] : tahun || "Lainnya";
  const kelas = doc.kelas || "-";

  if (folderPath.includes("/")) {
    const [folderYear, folderKelas] = folderPath.split("/");
    return year === folderYear && kelas === folderKelas;
  }

  if (/^\d{4}$/.test(folderPath)) {
    return year === folderPath && /^(Kelas|Alumni)/i.test(kelas);
  }

  return kelas === folderPath;
}

/** Flatten folder tree to get all paths for folder selector */
export function flattenFolderPaths(nodes: FolderNode[], prefix = ""): string[] {
  const paths: string[] = [];
  nodes.forEach((node) => {
    paths.push(node.path);
    if (node.children.length > 0) {
      paths.push(...flattenFolderPaths(node.children));
    }
  });
  return paths;
}
