import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FileText, School, Workflow, Sparkles } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraPetals from "@/components/SakuraPetals";

/* ── section data ── */
const SECTIONS = [
  {
    id: "about",
    label: "Apa itu SAKURA?",
    icon: Sparkles,
    title: "Tentang SAKURA",
    body: "SAKURA (Secure Archiving and Keeping of Unified Records for Administration) adalah sistem arsip digital yang dirancang untuk membantu sekolah mengelola dokumen akademik dan administrasi secara aman, terstruktur, dan efisien.",
    color: "from-primary/10 to-accent/5",
  },
  {
    id: "why",
    label: "Arsip Digital",
    icon: FileText,
    title: "Pentingnya Arsip Digital",
    body: "Digitalisasi arsip mengurangi risiko kehilangan dokumen fisik, mempercepat pencarian data, dan memungkinkan akses terpusat dari mana saja. Arsip digital juga mendukung transparansi dan akuntabilitas administrasi sekolah.",
    color: "from-sakura-success/10 to-sakura-success/5",
  },
  {
    id: "workflow",
    label: "Alur Persetujuan",
    icon: Workflow,
    title: "Alur Persetujuan Dokumen",
    body: "Dokumen diunggah oleh Operator/TU → menunggu persetujuan Kepala Sekolah → disetujui atau ditolak → jika disetujui, Operator/TU dapat memindahkan ke arsip → QR verifikasi otomatis dibuat setelah diarsipkan.",
    color: "from-sakura-warning/10 to-sakura-warning/5",
  },
  {
    id: "security",
    label: "Keamanan & QR",
    icon: Shield,
    title: "Keamanan & Verifikasi QR",
    body: "SAKURA menggunakan Role-Based Access Control (RBAC) untuk membatasi akses. Setiap dokumen yang diarsipkan dilengkapi QR Code berisi link verifikasi yang ditandatangani secara kriptografis (HMAC-SHA256) untuk mencegah pemalsuan.",
    color: "from-primary/10 to-sakura-violet/5",
  },
  {
    id: "school",
    label: "SMP Negeri 4",
    icon: School,
    title: "SMP Negeri 4 Cikarang Barat",
    body: "Berlokasi di Kp. Kali Jeruk, Desa Kalijaya, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat. NPSN: 20218452. Sekolah negeri jenjang SMP yang berkomitmen pada digitalisasi administrasi demi transparansi dan efisiensi.",
    color: "from-sakura-pink/10 to-sakura-maroon/5",
  },
];

/* ── blossom positions on horizontal branch (% of hero) ── */
const NODE_POSITIONS = [
  { x: 32, y: 22 },
  { x: 52, y: 36 },
  { x: 42, y: 56 },
  { x: 68, y: 28 },
  { x: 62, y: 62 },
];

/* ── SVG: horizontal branch entering from left ── */
function BranchSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 1 }}
    >
      {/* main trunk from left edge → center */}
      <motion.path
        d="M -2 48 C 8 46, 18 44, 28 42 C 36 40, 44 40, 50 42 C 56 44, 60 46, 65 45"
        fill="none" stroke="hsl(20 30% 50%)" strokeWidth="1.2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {/* thicker base near left edge */}
      <motion.path
        d="M -2 50 C 6 49, 14 47, 22 44"
        fill="none" stroke="hsl(20 25% 45%)" strokeWidth="1.8" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      {/* sub-branch up-left → blossom 1 (32, 22) */}
      <motion.path
        d="M 24 42 C 26 36, 28 30, 32 22"
        fill="none" stroke="hsl(20 30% 55%)" strokeWidth="0.6" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      />
      {/* sub-branch mid → blossom 2 (52, 36) */}
      <motion.path
        d="M 46 41 C 48 39, 50 37, 52 36"
        fill="none" stroke="hsl(20 30% 58%)" strokeWidth="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
      {/* sub-branch down → blossom 3 (42, 56) */}
      <motion.path
        d="M 38 42 C 39 46, 40 50, 42 56"
        fill="none" stroke="hsl(20 30% 58%)" strokeWidth="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
      />
      {/* sub-branch far-right up → blossom 4 (68, 28) */}
      <motion.path
        d="M 60 44 C 62 38, 64 34, 68 28"
        fill="none" stroke="hsl(20 30% 60%)" strokeWidth="0.45" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
      />
      {/* sub-branch far-right down → blossom 5 (62, 62) */}
      <motion.path
        d="M 56 44 C 58 50, 60 56, 62 62"
        fill="none" stroke="hsl(20 30% 60%)" strokeWidth="0.45" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
      />
      {/* small decorative twigs */}
      <motion.path
        d="M 14 45 C 16 40, 18 38, 20 35"
        fill="none" stroke="hsl(20 28% 58%)" strokeWidth="0.35" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      />
      <motion.path
        d="M 30 41 C 32 38, 34 36, 36 34"
        fill="none" stroke="hsl(20 28% 58%)" strokeWidth="0.3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      />
    </svg>
  );
}

/* ── single blossom node ── */
function BlossomNode({ node, index, onClick }) {
  const pos = NODE_POSITIONS[index];
  return (
    <motion.button
      onClick={onClick}
      className="absolute z-10 blossom-3d group flex flex-col items-center gap-1"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.8 + index * 0.18 }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute -inset-3 rounded-full transition-all duration-500 bg-transparent group-hover:bg-[hsl(340_80%_70%/0.15)]" />
      <span
        className="blossom-circle relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg shadow-md transition-all duration-500 border bg-[hsl(340_60%_88%)] border-[hsl(340_50%_82%)] group-hover:bg-[hsl(340_65%_78%)] group-hover:shadow-[0_0_18px_hsl(340_80%_70%/0.35)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        🌸
      </span>
      <span className="text-[10px] md:text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full transition-colors duration-300 text-[hsl(350_20%_40%)] group-hover:text-primary">
        {node.label}
      </span>
    </motion.button>
  );
}

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
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: cx * 14, y: cy * 10 });
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FFF7FA 0%, #FFEFF5 40%, #FFF0F5 100%)" }}
    >
      {/* nav */}
      <nav className="relative z-40 flex items-center justify-between px-6 md:px-10 py-4">
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

      {/* Hero */}
      <div
        className="relative w-full"
        style={{ height: "calc(100vh - 64px)" }}
        onMouseMove={handleMouseMove}
      >
        {/* ambient blobs */}
        <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[10%] w-56 h-56 bg-accent/8 rounded-full blur-3xl" />

        {/* 3D branch container — perspective + parallax */}
        <div
          className="absolute inset-0"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "30% 50%",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(6deg) rotateX(-2deg) translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* Petals originating from blossom positions */}
            <SakuraPetals count={14} blossomPositions={NODE_POSITIONS} />
            <BranchSVG />
            {SECTIONS.map((section, i) => (
              <BlossomNode
                key={section.id}
                node={section}
                index={i}
                onClick={() => scrollToSection(section.id)}
              />
            ))}
          </motion.div>
        </div>

        {/* Right-side text overlay */}
        <motion.div
          className="absolute z-20 right-6 md:right-[8%] top-1/2 -translate-y-1/2 max-w-xs md:max-w-sm text-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
            SAKURA
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-1">
            Secure Archiving and Keeping of<br />Unified Records for Administration
          </p>
          <p className="text-[11px] text-muted-foreground/70 mb-5">
            SMP Negeri 4 Cikarang Barat · Kab. Bekasi
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
          >
            Masuk ke Sistem
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* hint */}
        <motion.p
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[11px] text-muted-foreground tracking-wide font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
        >
          Klik bunga 🌸 untuk menjelajahi SAKURA
        </motion.p>
      </div>

      {/* ── Scroll sections ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24 space-y-20">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>
    </div>
  );
}
