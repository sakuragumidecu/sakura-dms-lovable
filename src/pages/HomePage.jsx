import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraPetals from "@/components/SakuraPetals";

/* ── node data ── */
const NODES = [
  {
    id: "about",
    label: "Apa itu SAKURA?",
    x: 50, y: 28,
    title: "Tentang SAKURA",
    body: "SAKURA (Secure Archiving and Keeping of Unified Records for Administration) adalah sistem arsip digital yang dirancang untuk membantu sekolah mengelola dokumen akademik dan administrasi secara aman, terstruktur, dan efisien.",
  },
  {
    id: "why",
    label: "Mengapa Arsip Digital?",
    x: 24, y: 44,
    title: "Pentingnya Arsip Digital",
    body: "Digitalisasi arsip mengurangi risiko kehilangan dokumen fisik, mempercepat pencarian data, dan memungkinkan akses terpusat dari mana saja. Arsip digital juga mendukung transparansi dan akuntabilitas administrasi sekolah.",
  },
  {
    id: "workflow",
    label: "Alur Persetujuan",
    x: 74, y: 40,
    title: "Alur Persetujuan Dokumen",
    body: "Dokumen diunggah oleh Operator/TU → menunggu persetujuan Kepala Sekolah → disetujui atau ditolak → jika disetujui, Operator/TU dapat memindahkan ke arsip → QR verifikasi otomatis dibuat setelah diarsipkan.",
  },
  {
    id: "security",
    label: "Keamanan & QR",
    x: 36, y: 68,
    title: "Keamanan & Verifikasi QR",
    body: "SAKURA menggunakan Role-Based Access Control (RBAC) untuk membatasi akses. Setiap dokumen yang diarsipkan dilengkapi QR Code berisi link verifikasi yang ditandatangani secara kriptografis (HMAC-SHA256) untuk mencegah pemalsuan.",
  },
  {
    id: "school",
    label: "SMP Negeri 4",
    x: 62, y: 72,
    title: "SMP Negeri 4 Cikarang Barat",
    body: "Berlokasi di Kp. Kali Jeruk, Desa Kalijaya, Kec. Cikarang Barat, Kab. Bekasi, Jawa Barat. NPSN: 20218452. Sekolah negeri jenjang SMP yang berkomitmen pada digitalisasi administrasi demi transparansi dan efisiensi.",
  },
];

/* ── SVG branch paths ── */
function BranchSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 1 }}
    >
      {/* main trunk */}
      <motion.path
        d="M50 95 C50 75, 48 60, 50 50 C52 40, 45 30, 50 18"
        fill="none"
        stroke="hsl(20 30% 55%)"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* branch left-mid */}
      <motion.path
        d="M49 52 C40 48, 30 46, 24 44"
        fill="none"
        stroke="hsl(20 30% 60%)"
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
      {/* branch right-mid */}
      <motion.path
        d="M51 48 C58 44, 66 42, 74 40"
        fill="none"
        stroke="hsl(20 30% 60%)"
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
      {/* branch down-left */}
      <motion.path
        d="M48 58 C44 62, 40 66, 36 68"
        fill="none"
        stroke="hsl(20 30% 62%)"
        strokeWidth="0.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
      />
      {/* branch down-right */}
      <motion.path
        d="M52 58 C56 62, 58 66, 62 72"
        fill="none"
        stroke="hsl(20 30% 62%)"
        strokeWidth="0.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
      />
      {/* top branch */}
      <motion.path
        d="M50 28 C50 24, 50 22, 50 18"
        fill="none"
        stroke="hsl(20 30% 58%)"
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
    </svg>
  );
}

/* ── single blossom node ── */
function BlossomNode({ node, isActive, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(node.id)}
      className="absolute z-10 group flex flex-col items-center gap-1"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 + NODES.indexOf(node) * 0.15 }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* glow ring */}
      <span className={`
        absolute -inset-3 rounded-full transition-all duration-500
        ${isActive ? "bg-[hsl(340_80%_70%/0.25)] scale-110" : "bg-transparent group-hover:bg-[hsl(340_80%_70%/0.12)]"}
      `} />
      {/* blossom circle */}
      <span className={`
        relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg
        shadow-md transition-all duration-300 border
        ${isActive
          ? "bg-[hsl(340_70%_65%)] border-[hsl(340_80%_75%)] shadow-[0_0_20px_hsl(340_80%_70%/0.4)]"
          : "bg-[hsl(340_60%_88%)] border-[hsl(340_50%_82%)] group-hover:bg-[hsl(340_65%_78%)] group-hover:shadow-[0_0_14px_hsl(340_80%_70%/0.25)]"
        }
      `}>
        🌸
      </span>
      {/* label */}
      <span className={`
        text-[10px] md:text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full transition-colors duration-300
        ${isActive ? "text-[hsl(340_70%_35%)] bg-[hsl(340_60%_92%)]" : "text-[hsl(350_20%_40%)] group-hover:text-[hsl(340_70%_35%)]"}
      `}>
        {node.label}
      </span>
    </motion.button>
  );
}

/* ── info card ── */
function InfoCard({ node, onClose }) {
  if (!node) return null;
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="
        absolute bottom-6 left-1/2 -translate-x-1/2 z-30
        w-[90%] max-w-md
        bg-white/90 backdrop-blur-xl border border-[hsl(340_40%_88%)]
        rounded-2xl shadow-xl p-6
      "
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-[hsl(350_20%_50%)] hover:bg-[hsl(340_40%_92%)] transition-colors"
      >
        <X size={14} />
      </button>
      <h3 className="text-lg font-semibold text-[hsl(350_30%_25%)] mb-2">{node.title}</h3>
      <p className="text-sm leading-relaxed text-[hsl(220_10%_35%)]">{node.body}</p>
    </motion.div>
  );
}

/* ── main page ── */
export default function HomePage() {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(null);

  const handleNodeClick = (id) => {
    setActiveNode((prev) => (prev === id ? null : id));
  };

  const activeData = NODES.find((n) => n.id === activeNode) || null;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #FFF7FA 0%, #FFEFF5 40%, #FFF0F5 100%)" }}>
      {/* petals */}
      <SakuraPetals count={22} />

      {/* nav */}
      <nav className="relative z-40 flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-2.5">
          <img src={logoSakura} alt="SAKURA" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-[hsl(350_30%_25%)] tracking-wider text-sm">SAKURA</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[hsl(350_30%_30%)] hover:bg-[hsl(340_40%_92%)] transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-xl bg-[hsl(340_70%_45%)] text-white text-sm font-semibold hover:bg-[hsl(340_70%_40%)] transition-colors shadow-sm"
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* hero area — the interactive branch */}
      <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
        {/* decorative blurs */}
        <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-[hsl(340_60%_85%/0.3)] rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[8%] w-48 h-48 bg-[hsl(330_50%_90%/0.4)] rounded-full blur-3xl" />

        {/* branch + nodes container */}
        <div className="absolute inset-0 mx-auto" style={{ maxWidth: "800px" }}>
          <BranchSVG />
          {NODES.map((node) => (
            <BlossomNode
              key={node.id}
              node={node}
              isActive={activeNode === node.id}
              onClick={handleNodeClick}
            />
          ))}

          <AnimatePresence mode="wait">
            {activeData && <InfoCard node={activeData} onClose={() => setActiveNode(null)} />}
          </AnimatePresence>
        </div>

        {/* bottom CTA */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <p className="text-xs text-[hsl(350_20%_50%)] tracking-wide font-light">
            SMP Negeri 4 Cikarang Barat · Kab. Bekasi
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-[hsl(340_70%_45%)] text-white text-sm font-semibold hover:bg-[hsl(340_70%_40%)] shadow-lg hover:shadow-xl transition-all"
          >
            Masuk ke Sistem
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* instruction hint */}
        <motion.p
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-[11px] text-[hsl(350_15%_55%)] tracking-wide font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          Klik bunga 🌸 untuk menjelajahi SAKURA
        </motion.p>
      </div>
    </div>
  );
}
