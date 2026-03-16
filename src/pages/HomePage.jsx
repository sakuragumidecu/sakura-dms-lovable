import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FileText, School, Workflow, Sparkles } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraBranch from "@/components/SakuraBranch";
import SakuraPetalsFalling from "@/components/SakuraPetalsFalling";
import FloatingParticles from "@/components/FloatingParticles";

/* ── section data ── */
const SECTIONS = [
  {
    id: "about",
    icon: Sparkles,
    title: "Tentang SAKURA",
    body: "SAKURA (Secure Archiving and Keeping of Unified Records for Administration) adalah sistem arsip digital yang dirancang untuk membantu sekolah mengelola dokumen akademik dan administrasi secara aman, terstruktur, dan efisien.",
    color: "from-primary/10 to-accent/5",
  },
  {
    id: "why",
    icon: FileText,
    title: "Pentingnya Arsip Digital",
    body: "Digitalisasi arsip mengurangi risiko kehilangan dokumen fisik, mempercepat pencarian data, dan memungkinkan akses terpusat dari mana saja. Arsip digital juga mendukung transparansi dan akuntabilitas administrasi sekolah.",
    color: "from-sakura-success/10 to-sakura-success/5",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Alur Persetujuan Dokumen",
    body: "Dokumen diunggah oleh Operator/TU → menunggu persetujuan Kepala Sekolah → disetujui atau ditolak → jika disetujui, Operator/TU dapat memindahkan ke arsip → QR verifikasi otomatis dibuat setelah diarsipkan.",
    color: "from-sakura-warning/10 to-sakura-warning/5",
  },
  {
    id: "security",
    icon: Shield,
    title: "Keamanan & Verifikasi QR",
    body: "SAKURA menggunakan Role-Based Access Control (RBAC) untuk membatasi akses. Setiap dokumen yang diarsipkan dilengkapi QR Code berisi link verifikasi yang ditandatangani secara kriptografis (HMAC-SHA256) untuk mencegah pemalsuan.",
    color: "from-primary/10 to-sakura-violet/5",
  },
  {
    id: "school",
    icon: School,
    title: "SMP Negeri 4 Cikarang Barat",
    body: "Berlokasi di Kp. Kali Jeruk, Desa Kalijaya, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat. NPSN: 20218452. Sekolah negeri jenjang SMP yang berkomitmen pada digitalisasi administrasi demi transparansi dan efisiensi.",
    color: "from-sakura-pink/10 to-sakura-maroon/5",
  },
];

/* ── section card ── */
function SectionCard({ section, index }) {
  const Icon = section.icon;
  const isEven = index % 2 === 0;
  return (
    <motion.div
      id={`section-${section.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
    >
      <div className={`flex-1 p-8 rounded-3xl bg-gradient-to-br ${section.color} border border-border/50`}>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon size={24} className="text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{section.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{section.body}</p>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
          <Icon size={64} className="text-primary/30" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── main page ── */
export default function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* nav — transparent, blur on scroll */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(194,58,87,0.08)" : "1px solid transparent",
        }}
      >
        <div className="flex items-center gap-2.5">
          <img src={logoSakura} alt="SAKURA" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-foreground tracking-wider text-sm">SAKURA</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative w-full"
        style={{
          minHeight: "100vh",
          overflowX: "hidden",
          overflowY: "visible",
          background: "radial-gradient(ellipse at 50% 40%, #FFF0F3 0%, #FFE4EC 60%, #FFEFF5 100%)",
        }}
      >
        {/* Atmospheric particles */}
        <FloatingParticles count={25} />

        {/* Cherry blossom branch SVG */}
        <SakuraBranch />

        {/* Falling petals */}
        <SakuraPetalsFalling />

        {/* Hero text — right side */}
        <motion.div
          className="absolute z-20 right-6 md:right-[10%] top-1/2 -translate-y-1/2 max-w-sm md:max-w-md text-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        >
          <motion.span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-medium tracking-wide mb-4"
            style={{ background: "rgba(194, 24, 91, 0.08)", color: "#C2185B" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            SMP Negeri 4 Cikarang Barat
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-none mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A0A0F" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            SAKURA
          </motion.h1>

          <motion.p
            className="text-xs md:text-sm leading-relaxed mb-1"
            style={{ color: "#6B4C5A" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            Secure Archiving and Keeping of
            <br />
            Unified Records for Administration
          </motion.p>

          <motion.p
            className="text-[11px] mb-6"
            style={{ color: "#9B7A8A" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            SMP Negeri 4 Cikarang Barat · Kab. Bekasi
          </motion.p>

          <motion.button
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              background: "#C23A57",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(194, 24, 91, 0.25)",
            }}
            whileHover={{
              boxShadow: "0 6px 30px rgba(194, 24, 91, 0.45)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            Masuk ke Sistem
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <span className="text-[11px] tracking-wide font-medium" style={{ color: "#C2185B" }}>
            🌸 Klik bunga untuk menjelajahi
          </span>
          <motion.div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "#D4A0B0" }}
          >
            <motion.div
              className="w-1 h-2 rounded-full"
              style={{ background: "#C2185B" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Scroll sections ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-20">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>
    </div>
  );
}
