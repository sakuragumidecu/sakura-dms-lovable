import { useNavigate } from "react-router-dom";
import { Shield, FileText, CheckCircle, Smartphone, Archive, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";
import heroSchool from "@/assets/hero_school.jpg";

const FEATURES = [
  { icon: FileText, title: "Arsip Digital", desc: "Simpan dan kelola dokumen akademik dalam format digital yang aman dan terstruktur." },
  { icon: CheckCircle, title: "Alur Persetujuan", desc: "Proses persetujuan dokumen yang transparan dengan audit trail dan notifikasi real-time." },
  { icon: Smartphone, title: "Scan Mobile", desc: "Scan dokumen langsung dari perangkat mobile menggunakan kamera." },
  { icon: Shield, title: "Keamanan RBAC", desc: "Sistem keamanan berbasis Role-Based Access Control untuk melindungi data sensitif." },
  { icon: Archive, title: "Pengarsipan Terstruktur", desc: "Struktur folder berdasarkan tahun, kelas, dan jenis dokumen." },
  { icon: Users, title: "Multi-Role", desc: "Dukungan akses untuk Operator/TU, Kepala Sekolah, dan Guru." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-card/80 glass border-b border-border/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src={logoSakura} alt="SAKURA" className="w-9 h-9 rounded-xl" />
            <span className="font-bold text-primary text-lg tracking-wider">SAKURA</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-xl border border-input text-sm font-medium hover:bg-muted transition-all text-foreground">
              Masuk
            </button>
            <button onClick={() => navigate("/signup")} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-soft">
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroSchool} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-7xl mx-auto px-6 py-24 md:py-32"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-sakura-success animate-pulse" />
              <span className="text-primary-foreground/80 text-xs font-medium">Sistem Arsip Digital Terintegrasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground leading-[1.1] mb-6">
              Sistem Arsip Digital<br />SMP Negeri 4<br />Cikarang Barat
            </h1>
            <p className="text-lg text-primary-foreground/75 mb-8 leading-relaxed max-w-xl">
              SAKURA — Sistem manajemen arsip digital yang dirancang untuk pengelolaan dokumen akademik secara aman, terstruktur, dan efisien.
            </p>
            <div className="flex gap-3">
              <button onClick={() => navigate("/login")} className="group px-7 py-3 rounded-xl bg-primary-foreground text-primary font-bold hover:shadow-elevated transition-all flex items-center gap-2">
                Masuk ke Sistem
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate("/signup")} className="px-7 py-3 rounded-xl border-2 border-primary-foreground/25 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all">
                Daftar Akun
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <h2 className="text-3xl font-bold text-foreground mb-4">Tentang SMP Negeri 4 Cikarang Barat</h2>
            <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
              SMP Negeri 4 Cikarang Barat berkomitmen pada digitalisasi administrasi sekolah. SAKURA hadir sebagai solusi modern untuk manajemen dokumen akademik yang selama ini dilakukan secara manual — mendukung transparansi, efisiensi, dan keamanan pengelolaan arsip.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">Fitur Unggulan</h2>
            <p className="text-muted-foreground">Solusi lengkap untuk pengelolaan arsip sekolah</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Siap Memulai?</h2>
          <p className="text-primary-foreground/60 mb-8">Masuk ke sistem SAKURA untuk mengelola arsip dokumen sekolah Anda.</p>
          <button onClick={() => navigate("/login")} className="group px-8 py-3 rounded-xl bg-primary-foreground text-primary font-bold hover:shadow-elevated transition-all inline-flex items-center gap-2">
            Masuk Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 text-center text-[12px] text-muted-foreground/70 font-medium">
          © 2026 SAKURA · SMP Negeri 4 Cikarang Barat · President University Capstone Project
        </div>
      </footer>
    </div>
  );
}
