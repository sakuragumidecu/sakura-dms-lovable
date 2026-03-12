import AppHeader from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Folder, FileText, Clock } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import heroSchool from "@/assets/hero_school.jpg";
import { CATEGORIES, DOCUMENT_TYPES, FOLDERS } from "@/data/mockData";

export default function HomeDashboardPage() {
  const { documents } = useApp();

  const totalFolders = FOLDERS?.length || CATEGORIES.length;
  const totalDocs = documents.length;
  const recentDocs = documents
    .slice()
    .sort((a, b) => new Date(b.tanggalUpload) - new Date(a.tanggalUpload))
    .slice(0, 3);

  const stats = [
    { label: "Total Folder", value: totalFolders, icon: Folder, variant: "default" },
    { label: "Total Dokumen", value: totalDocs, icon: FileText, variant: "success" },
    { label: "Dokumen Terbaru", value: recentDocs.length, icon: Clock, variant: "warning" },
  ];

  const ICON_BG = {
    default: "bg-secondary text-primary",
    success: "bg-sakura-success/10 text-sakura-success",
    warning: "bg-sakura-warning/10 text-sakura-warning",
  };

  return (
    <>
      <AppHeader title="Beranda" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Hero / Welcome */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src={heroSchool} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground leading-tight">
              Selamat Datang di SAKURA DMS
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base mt-2 max-w-xl">
              Secure Archiving and Keeping of Unified Records for Administration
            </p>
          </div>
        </div>

        {/* System Description */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Tentang Sistem</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              SAKURA (Secure Archiving and Keeping of Unified Records for Administration) adalah sistem manajemen arsip digital yang digunakan untuk membantu sekolah dalam menyimpan, mengelola, dan mengorganisasi dokumen administrasi secara terpusat, aman, dan terstruktur.
            </p>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Informasi Sekolah</h2>
            <div className="flex items-start gap-5">
              <img src={logoSakura} alt="Logo Sekolah" className="w-20 h-20 rounded-xl object-cover shrink-0 bg-secondary" />
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nama Sekolah:</span>
                  <p className="font-semibold text-foreground">SMP Negeri 4 Cikarang Barat</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Alamat:</span>
                  <p className="font-semibold text-foreground">Jl. Raya Cikarang–Cibarusah, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Deskripsi:</span>
                  <p className="text-foreground">SMP Negeri 4 Cikarang Barat merupakan institusi pendidikan menengah pertama yang berkomitmen pada digitalisasi administrasi sekolah demi transparansi, efisiensi, dan keamanan pengelolaan dokumen akademik.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Ringkasan Sistem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon: Icon, variant }) => (
              <Card key={label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${ICON_BG[variant]}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-foreground">{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
