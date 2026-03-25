import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";

/* ── 3D Sakura Flower SVG ── */
function SakuraFlowerSVG({ size = 60, opacity = 0.9 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity, filter: "drop-shadow(1px 3px 6px rgba(200,80,100,0.25))" }}>
      <defs>
        <radialGradient id="lpg" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFB7C5" />
          <stop offset="100%" stopColor="#E8607A" />
        </radialGradient>
        <radialGradient id="lcg" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map(r => (
        <g key={r} transform={`rotate(${r}, 50, 50)`}>
          <path d="M50,50 C38,38 30,20 50,10 C70,20 62,38 50,50Z" fill="url(#lpg)" opacity="0.92" />
          <path d="M50,50 C50,35 50,22 50,10" stroke="white" strokeWidth="0.7" opacity="0.35" fill="none" />
        </g>
      ))}
      <circle cx="50" cy="50" r="7" fill="url(#lcg)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45) * Math.PI / 180;
        return (
          <g key={i}>
            <line x1="50" y1="50" x2={50 + Math.cos(a) * 13} y2={50 + Math.sin(a) * 13} stroke="#C23A57" strokeWidth="1.2" opacity="0.6" />
            <circle cx={50 + Math.cos(a) * 13} cy={50 + Math.sin(a) * 13} r="1.8" fill="#FFD700" opacity="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Interactive floating flowers that follow mouse ── */
function FloatingFlowers({ mousePos }) {
  const flowers = useMemo(() => [
    { x: 12, y: 15, size: 55, speed: 0.03, delay: 0, drift: 15 },
    { x: 78, y: 8, size: 45, speed: 0.02, delay: 1, drift: 20 },
    { x: 85, y: 70, size: 50, speed: 0.025, delay: 2, drift: 18 },
    { x: 20, y: 80, size: 40, speed: 0.035, delay: 0.5, drift: 12 },
    { x: 50, y: 5, size: 35, speed: 0.02, delay: 1.5, drift: 16 },
    { x: 92, y: 40, size: 42, speed: 0.03, delay: 0.8, drift: 14 },
    { x: 5, y: 50, size: 38, speed: 0.025, delay: 2.2, drift: 22 },
  ], []);

  return (
    <>
      {flowers.map((f, i) => {
        const parallaxX = (mousePos.x - 0.5) * f.drift;
        const parallaxY = (mousePos.y - 0.5) * f.drift;
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.8, 1, 0.8],
              x: parallaxX,
              y: parallaxY,
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              opacity: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              x: { type: "spring", stiffness: 50, damping: 30 },
              y: { type: "spring", stiffness: 50, damping: 30 },
              rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: f.delay },
            }}
          >
            <SakuraFlowerSVG size={f.size} opacity={0.7} />
          </motion.div>
        );
      })}
    </>
  );
}

/* ── Falling petals across the whole login page ── */
function LoginPetals() {
  const COLORS = ["#FFB7C5", "#FF9EB5", "#FFC8D5", "#FFD0DC", "#FFAABF"];
  const petals = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 12,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 12,
      sway: (Math.random() - 0.5) * 120,
      rotation: 300 + Math.random() * 500,
      color: COLORS[i % COLORS.length],
      opacity: 0.3 + Math.random() * 0.5,
    }))
  , []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size * 1.3,
            borderRadius: "50% 50% 50% 0",
            background: p.color,
            opacity: p.opacity,
            animation: `loginPetalFall ${p.duration}s ${p.delay}s linear infinite`,
            "--sway": `${p.sway}px`,
            "--rot": `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ripple on click anywhere ── */
function ClickRipple({ ripples }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            className="absolute rounded-full border-2 border-primary/30"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 150, height: 150, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Petal burst on button click ── */
function PetalBurst({ bursts }) {
  const COLORS = ["#FFB7C5", "#FF9EB5", "#FFC8D5", "#E8607A"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      <AnimatePresence>
        {bursts.map(b => (
          <span key={b.id}>
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i / 12) * 360;
              const dist = 60 + Math.random() * 80;
              const rad = angle * Math.PI / 180;
              return (
                <motion.div
                  key={`${b.id}-${i}`}
                  className="absolute"
                  style={{
                    left: b.x, top: b.y,
                    width: 8 + Math.random() * 6,
                    height: 10 + Math.random() * 6,
                    borderRadius: "50% 50% 50% 0",
                    background: COLORS[i % COLORS.length],
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  animate={{
                    x: Math.cos(rad) * dist,
                    y: Math.sin(rad) * dist + 200,
                    opacity: 0,
                    scale: 0.3,
                    rotate: 360 + Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                />
              );
            })}
          </span>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Login Page ── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [ripples, setRipples] = useState([]);
  const [bursts, setBursts] = useState([]);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const r = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples(prev => [...prev, r]);
    setTimeout(() => setRipples(prev => prev.filter(p => p.id !== r.id)), 1000);
  }, []);

  const triggerBurst = useCallback((e) => {
    const rect = e.currentTarget.closest(".login-page").getBoundingClientRect();
    const b = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setBursts(prev => [...prev, b]);
    setTimeout(() => setBursts(prev => prev.filter(p => p.id !== b.id)), 2500);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    triggerBurst(e);
    if (!email) { setError("Masukkan email terlebih dahulu."); return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email);
    setIsSubmitting(false);
    if (result === "pending") {
      setError("Akun Anda belum diaktifkan. Silakan tunggu persetujuan dari Operator TU.");
      return;
    }
    if (result) navigate("/dashboard");
    else setError("Email tidak ditemukan. Gunakan akun demo.");
  };

  const quickLogin = async (userEmail, e) => {
    if (e) triggerBurst(e);
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(userEmail);
    setIsSubmitting(false);
    if (result === "pending") {
      setError("Akun Anda belum diaktifkan. Silakan tunggu persetujuan dari Operator TU.");
      return;
    }
    if (result) navigate("/dashboard");
    else setError("Email tidak ditemukan.");
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18, filter: "blur(3px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
  };

  return (
    <div
      className="login-page min-h-screen flex flex-col lg:flex-row relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <LoginPetals />
      <ClickRipple ripples={ripples} />
      <PetalBurst bursts={bursts} />
      <FloatingFlowers mousePos={mousePos} />

      {/* ── Left panel ── */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col justify-center w-1/2 relative overflow-hidden z-[3]"
        style={{ background: "linear-gradient(135deg, hsl(340 65% 30%), hsl(340 73% 42%), hsl(340 50% 38%))" }}
      >
        {/* Animated light beams */}
        <motion.div
          className="absolute inset-0 opacity-[0.07]"
          style={{ background: "conic-gradient(from 0deg at 30% 40%, transparent 0deg, white 15deg, transparent 30deg, transparent 90deg, white 105deg, transparent 120deg, transparent 180deg, white 195deg, transparent 210deg, transparent 270deg, white 285deg, transparent 300deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative px-12 py-16 z-10">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button onClick={() => navigate("/")} className="flex items-center gap-3 group mb-10">
              <motion.img
                src={logoSakura} alt="SAKURA" className="w-11 h-11 rounded-xl"
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="text-left">
                <div className="text-white font-bold text-xl tracking-wider">SAKURA</div>
                <div className="text-white/50 text-xs font-medium">Document Management System</div>
              </div>
            </button>
          </motion.div>

          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl font-extrabold text-white leading-[1.15] mb-4"
          >
            Secure Archiving and<br />Keeping of Unified<br />Records for Administration
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/60 text-base leading-relaxed max-w-lg"
          >
            Sistem manajemen arsip digital untuk SMP Negeri 4 Cikarang Barat
          </motion.p>

          {/* Animated feature list with sakura icons */}
          <div className="mt-10 space-y-2.5">
            {[
              ["Arsip Digital", "Simpan dokumen secara aman"],
              ["Alur Persetujuan", "Proses transparan dan akuntabel"],
              ["Scan & Upload", "Digitalisasi dokumen fisik"],
              ["Keamanan RBAC", "Kontrol akses berbasis peran"],
            ].map(([title, desc], i) => (
              <motion.div
                key={title}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.12 }}
                whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 transition-colors cursor-default"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="shrink-0"
                >
                  <SakuraFlowerSVG size={18} opacity={0.8} />
                </motion.div>
                <div>
                  <span className="text-white font-semibold text-sm">{title}</span>
                  <span className="text-white/50 text-sm"> · {desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-auto text-white/30 text-[11px] pt-8 font-medium">© 2026 SAKURA · Developed by Group 5</p>
        </div>
      </motion.div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background relative z-[4]">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.button variants={fadeUp} onClick={() => navigate("/")} className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-primary tracking-wider">SAKURA</span>
          </motion.button>

          <motion.div variants={fadeUp}>
            <h2 className="text-2xl font-bold text-foreground mb-1">Masuk ke Sistem</h2>
            <p className="text-muted-foreground text-sm mb-8">Autentikasi diperlukan untuk mengakses sistem</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="nama@sakura.sch.id" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Kata Sandi</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-input accent-primary" /> Ingat saya</label>
              <button type="button" onClick={() => alert("Simulasi: Link reset password dikirim ke email")} className="text-sm text-primary font-semibold hover:underline">Lupa password?</button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }} className="text-sm text-destructive font-medium overflow-hidden">{error}</motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -8px hsl(347 55% 49% / 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="group w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                      <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                      Memproses...
                    </motion.div>
                  ) : (
                    <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                      Masuk ke Sistem
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} className="text-center text-sm text-muted-foreground mt-5">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">Daftar di sini</button>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 p-4 rounded-2xl border border-border bg-muted/30">
            <p className="text-[11px] text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Akun Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Operator / TU", email: "admin@sakura.sch.id" },
                { label: "Kepala Sekolah", email: "principal@sakura.sch.id" },
                { label: "Guru", email: "teacher@sakura.sch.id" },
              ].map((a) => (
                <motion.button
                  key={a.email}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => quickLogin(a.email, e)}
                  disabled={isSubmitting}
                  className="text-left p-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 text-xs transition-all duration-200 disabled:opacity-60"
                >
                  <div className="font-semibold text-foreground">{a.label}</div>
                  <div className="text-muted-foreground text-[11px]">{a.email}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="text-center text-[11px] text-muted-foreground/60 mt-6 font-medium">SMP Negeri 4 Cikarang Barat</p>
            <div className="border-t border-border/50 mt-5" />
            <p className="text-center text-[11px] text-muted-foreground/60 py-4 font-medium">© 2026 SAKURA · Developed by Group 5</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
