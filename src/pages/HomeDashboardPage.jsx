import AppHeader from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import logoSakura from "@/assets/logo_sakura.png";
import schoolBuilding from "@/assets/school_building.jpg";

export default function HomeDashboardPage() {
  return (
    <>
      <AppHeader title="Beranda" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Section 1 — System Information */}
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <img src={logoSakura} alt="Logo SAKURA" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-secondary" />
              <div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-wide">SAKURA</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Secure Archiving and Keeping of Unified Records for Administration
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">Tentang Sistem</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SAKURA (Secure Archiving and Keeping of Unified Records for Administration) adalah sistem manajemen arsip digital
                yang dikembangkan untuk membantu SMP Negeri 4 Cikarang Barat dalam menyimpan, mengelola, dan mengorganisasi
                dokumen administrasi secara terpusat, aman, dan terstruktur.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sistem ini dirancang sebagai bagian dari proyek Capstone Design di bidang Ilmu Komputer, dengan tujuan
                mendigitalisasi proses administrasi sekolah yang sebelumnya masih dilakukan secara manual. SAKURA menyediakan
                fitur pengelolaan dokumen, arsip digital, manajemen pengguna, serta alur persetujuan dokumen yang efisien
                dan transparan.
              </p>
            </div>

            {/* Developer Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">Pengembang Sistem</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sistem SAKURA dikembangkan oleh mahasiswa Faculty of Computer Science, President University,
                sebagai bagian dari proyek Capstone Design.
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">No.</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">Nama</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">NIM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">1</td>
                      <td className="px-4 py-2.5 text-foreground font-medium">Aroliani Munte</td>
                      <td className="px-4 py-2.5 text-muted-foreground">001202300098</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">2</td>
                      <td className="px-4 py-2.5 text-foreground font-medium">Alfina Hilma Zein</td>
                      <td className="px-4 py-2.5 text-muted-foreground">001202300136</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-muted-foreground">3</td>
                      <td className="px-4 py-2.5 text-foreground font-medium">Satwika Zahrani Putri</td>
                      <td className="px-4 py-2.5 text-muted-foreground">001202300099</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-foreground">Dosen Pembimbing:</span>{" "}
                Mrs. Rosalina, S.Kom., M.Kom.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 — School Information */}
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="relative">
              <img
                src={schoolBuilding}
                alt="Gedung SMP Negeri 4 Cikarang Barat"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-4">
                <img src={logoSakura} alt="Logo Sekolah" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-secondary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">SMP Negeri 4 Cikarang Barat</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">Kab. Bekasi, Jawa Barat</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Alamat:</span>
                  <p className="font-medium text-foreground">Kp. Kali Jeruk, Desa Kalijaya, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat</p>
                </div>
                <div>
                  <span className="text-muted-foreground">NPSN:</span>
                  <p className="font-medium text-foreground">20218452</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium text-foreground">Sekolah Negeri — Jenjang SMP</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Deskripsi:</span>
                  <p className="text-foreground leading-relaxed">
                    SMP Negeri 4 Cikarang Barat merupakan institusi pendidikan menengah pertama yang berlokasi di Kecamatan Cikarang Barat,
                    Kabupaten Bekasi. Sekolah ini berkomitmen pada digitalisasi administrasi sekolah demi transparansi,
                    efisiensi, dan keamanan pengelolaan dokumen akademik.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
