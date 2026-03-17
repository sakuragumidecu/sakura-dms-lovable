import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraPetals from "@/components/SakuraPetals";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) { setError("Masukkan email terlebih dahulu."); return; }
    const result = login(email);
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

  const quickLogin = (userEmail) => {
    const result = login(userEmail);
    if (result === "pending") {
      setError("Akun Anda belum diaktifkan. Silakan tunggu persetujuan dari Operator TU.");
      return;
    }
    if (result) navigate("/dashboard");
    else setError("Email tidak ditemukan.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(340 65% 30%), hsl(340 73% 42%), hsl(340 50% 38%))" }}>
        <SakuraPetals count={12} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative px-12 py-16">
          <div className="flex items-center gap-3 mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
              <img src={logoSakura} alt="SAKURA" className="w-11 h-11 rounded-xl" />
              <div className="text-left">
                <div className="text-white font-bold text-xl tracking-wider">SAKURA</div>
                <div className="text-white/50 text-xs font-medium">Document Management System</div>
              </div>
            </button>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-[1.15] mb-4">
            Secure Archiving and<br />Keeping of Unified<br />Records for Administration
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-lg">
            Sistem manajemen arsip digital untuk SMP Negeri 4 Cikarang Barat
          </p>
          <div className="mt-12 space-y-2.5">
            {[["Arsip Digital", "Simpan dokumen secara aman"], ["Alur Persetujuan", "Proses transparan dan akuntabel"], ["Scan & Upload", "Digitalisasi dokumen fisik"], ["Keamanan RBAC", "Kontrol akses berbasis peran"]].map(([title, desc]) => (
              <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                <div>
                  <span className="text-white font-semibold text-sm">{title}</span>
                  <span className="text-white/50 text-sm"> · {desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-auto text-white/30 text-[11px] pt-8 font-medium">© 2026 SAKURA · Developed by Group 5</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-primary tracking-wider">SAKURA</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground mb-1">Masuk ke Sistem</h2>
          <p className="text-muted-foreground text-sm mb-8">Autentikasi diperlukan untuk mengakses sistem</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="nama@sakura.sch.id" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Kata Sandi</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-input accent-primary" /> Ingat saya</label>
              <button type="button" onClick={() => alert("Simulasi: Link reset password dikirim ke email")} className="text-sm text-primary font-semibold hover:underline">Lupa password?</button>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="group w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-soft hover:shadow-elevated flex items-center justify-center gap-2">
              Masuk ke Sistem
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">Daftar di sini</button>
          </p>

          <div className="mt-6 p-4 rounded-2xl border border-border bg-muted/30">
            <p className="text-[11px] text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Akun Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Operator / TU", email: "admin@sakura.sch.id" }, { label: "Kepala Sekolah", email: "principal@sakura.sch.id" }, { label: "Guru", email: "teacher@sakura.sch.id" }].map((a) => (
                <motion.button key={a.email} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => quickLogin(a.email)} className="text-left p-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 text-xs transition-all duration-200">
                  <div className="font-semibold text-foreground">{a.label}</div>
                  <div className="text-muted-foreground text-[11px]">{a.email}</div>
                </motion.button>
              ))}
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground/60 mt-6 font-medium">SMP Negeri 4 Cikarang Barat</p>
          <div className="border-t border-border/50 mt-5" />
          <p className="text-center text-[11px] text-muted-foreground/60 py-4 font-medium">© 2026 SAKURA · Developed by Group 5</p>
        </motion.div>
      </div>
    </div>
  );
}
