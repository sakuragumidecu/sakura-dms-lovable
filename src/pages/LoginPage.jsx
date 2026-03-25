import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, FileCheck, Users, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraPetals from "@/components/sakura/SakuraPetals";

/* ── Floating orbs on left panel ── */
function FloatingOrbs() {
  const orbs = useMemo(() => [
    { w: 320, h: 320, x: "80%", y: "-10%", delay: 0, dur: 18 },
    { w: 220, h: 220, x: "-8%", y: "75%", delay: 2, dur: 22 },
    { w: 160, h: 160, x: "60%", y: "60%", delay: 4, dur: 15 },
    { w: 100, h: 100, x: "30%", y: "20%", delay: 1, dur: 20 },
  ], []);

  return (
    <>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/[0.06]"
          style={{ width: o.w, height: o.h, left: o.x, top: o.y }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 15, -10, 8, 0],
            scale: [1, 1.08, 0.95, 1.04, 1],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
        />
      ))}
    </>
  );
}

/* ── Animated feature cards on left panel ── */
const FEATURES = [
  { icon: FileCheck, title: "Arsip Digital", desc: "Simpan dokumen secara aman" },
  { icon: Shield, title: "Alur Persetujuan", desc: "Proses transparan dan akuntabel" },
  { icon: ScanLine, title: "Scan & Upload", desc: "Digitalisasi dokumen fisik" },
  { icon: Users, title: "Keamanan RBAC", desc: "Kontrol akses berbasis peran" },
];

function FeatureCards() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(p => (p + 1) % FEATURES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-10 space-y-2">
      {FEATURES.map((f, i) => {
        const Icon = f.icon;
        const isActive = i === activeIdx;
        return (
          <motion.div
            key={f.title}
            initial={false}
            animate={{
              backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
              x: isActive ? 8 : 0,
              scale: isActive ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-default"
            onMouseEnter={() => setActiveIdx(i)}
          >
            <motion.div
              animate={{ rotate: isActive ? 360 : 0, scale: isActive ? 1.2 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon size={16} className="text-white/80" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <span className="text-white font-semibold text-sm">{f.title}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-white/50 text-sm inline-block overflow-hidden whitespace-nowrap"
                  >
                    {" · "}{f.desc}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {isActive && (
              <motion.div
                layoutId="featureIndicator"
                className="w-1.5 h-6 rounded-full bg-white/40"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Animated input field ── */
function AnimatedInput({ icon: Icon, label, type = "text", value, onChange, placeholder, suffix }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <motion.div
      animate={{
        scale: focused ? 1.01 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.label
        className="block text-sm font-semibold mb-1.5"
        animate={{ color: focused ? "hsl(347 55% 49%)" : "hsl(var(--foreground))" }}
      >
        {label}
      </motion.label>
      <div className="relative group">
        <motion.div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10"
          animate={{
            scale: focused ? 1.15 : 1,
            color: focused ? "hsl(347 55% 49%)" : "hsl(var(--muted-foreground))",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Icon size={18} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: focused
              ? "0 0 0 2px hsl(347 55% 49% / 0.25), 0 4px 16px -4px hsl(347 55% 49% / 0.15)"
              : "0 0 0 0px transparent",
          }}
          transition={{ duration: 0.2 }}
        />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
        />
        {suffix}
        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-[2px] rounded-full bg-primary"
          initial={{ width: 0, x: "-50%" }}
          animate={{
            width: focused ? "90%" : filled ? "60%" : "0%",
            x: "-50%",
            opacity: focused ? 1 : filled ? 0.4 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Typing animation for heading ── */
function TypedHeading() {
  const text = "Masuk ke Sistem";
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (chars < text.length) {
      const t = setTimeout(() => setChars(c => c + 1), 60);
      return () => clearTimeout(t);
    }
  }, [chars, text.length]);

  return (
    <h2 className="text-2xl font-bold text-foreground mb-1">
      {text.slice(0, chars)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-6 bg-primary ml-0.5 align-middle"
      />
    </h2>
  );
}

/* ── Main login page ── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) { setError("Masukkan email terlebih dahulu."); return; }
    setIsSubmitting(true);
    // Simulate brief loading
    await new Promise(r => setTimeout(r, 600));
    const result = login(email);
    setIsSubmitting(false);
    if (result === "pending") {
      setError("Akun Anda belum diaktifkan. Silakan tunggu persetujuan dari Operator TU.");
      return;
    }
    if (result) {
      navigate("/dashboard");
    } else {
      setError("Email tidak ditemukan. Gunakan akun demo.");
    }
  };

  const quickLogin = async (userEmail) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* ── Left panel ── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col justify-center w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(340 65% 30%), hsl(340 73% 42%), hsl(340 50% 38%))" }}
      >
        <SakuraPetals count={16} />
        <FloatingOrbs />

        <div className="relative px-12 py-16 z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
              <motion.img
                src={logoSakura}
                alt="SAKURA"
                className="w-11 h-11 rounded-xl"
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="text-left">
                <div className="text-white font-bold text-xl tracking-wider">SAKURA</div>
                <div className="text-white/50 text-xs font-medium">Document Management System</div>
              </div>
            </button>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-4xl font-extrabold text-white leading-[1.15] mb-4"
          >
            Secure Archiving and<br />Keeping of Unified<br />Records for Administration
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white/60 text-base leading-relaxed max-w-lg"
          >
            Sistem manajemen arsip digital untuk SMP Negeri 4 Cikarang Barat
          </motion.p>

          <FeatureCards />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-auto text-white/30 text-[11px] pt-8 font-medium"
          >
            © 2026 SAKURA · Developed by Group 5
          </motion.p>
        </div>
      </motion.div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background relative">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, hsl(347 55% 49%), transparent 70%)", right: "-100px", top: "-100px" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-[0.02]"
            style={{ background: "radial-gradient(circle, hsl(347 55% 49%), transparent 70%)", left: "-80px", bottom: "-80px" }}
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/")}
            className="lg:hidden flex items-center gap-3 mb-8"
          >
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-primary tracking-wider">SAKURA</span>
          </motion.button>

          <motion.div variants={itemVariants}>
            <TypedHeading />
            <p className="text-muted-foreground text-sm mb-8">Autentikasi diperlukan untuk mengakses sistem</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div variants={itemVariants}>
              <AnimatedInput
                icon={Mail}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="nama@sakura.sch.id"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedInput
                icon={Lock}
                label="Kata Sandi"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showPass ? "hide" : "show"}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                }
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-input accent-primary" /> Ingat saya
              </label>
              <button
                type="button"
                onClick={() => alert("Simulasi: Link reset password dikirim ke email")}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Lupa password?
              </button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="text-sm text-destructive font-medium overflow-hidden"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -8px hsl(347 55% 49% / 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="group w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-200%" }}
                  animate={isSubmitting ? {} : { x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Memproses...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      Masuk ke Sistem
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-5">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">Daftar di sini</button>
          </motion.p>

          <motion.div variants={itemVariants} className="mt-6 p-4 rounded-2xl border border-border bg-muted/30">
            <p className="text-[11px] text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Akun Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Operator / TU", email: "admin@sakura.sch.id", color: "hsl(347 55% 49%)" },
                { label: "Kepala Sekolah", email: "principal@sakura.sch.id", color: "hsl(38 92% 50%)" },
                { label: "Guru", email: "teacher@sakura.sch.id", color: "hsl(142 71% 35%)" },
              ].map((a, i) => (
                <motion.button
                  key={a.email}
                  whileHover={{ scale: 1.03, y: -2, boxShadow: `0 6px 20px -6px ${a.color}40` }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  onClick={() => quickLogin(a.email)}
                  disabled={isSubmitting}
                  className="text-left p-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 text-xs transition-all duration-200 relative overflow-hidden group disabled:opacity-60"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${a.color}08, ${a.color}04)` }}
                  />
                  <div className="font-semibold text-foreground relative z-10">{a.label}</div>
                  <div className="text-muted-foreground text-[11px] relative z-10">{a.email}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-center text-[11px] text-muted-foreground/60 mt-6 font-medium">SMP Negeri 4 Cikarang Barat</p>
            <div className="border-t border-border/50 mt-5" />
            <p className="text-center text-[11px] text-muted-foreground/60 py-4 font-medium">© 2026 SAKURA · Developed by Group 5</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
