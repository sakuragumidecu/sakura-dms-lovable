import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import OtpPage from "./OtpPage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) { setError("Masukkan email terlebih dahulu."); return; }
    setPendingEmail(email);
    setOtpStep(true);
  };

  const handleOtpVerified = () => {
    if (login(pendingEmail)) { navigate("/dashboard"); }
    else { setError("Email tidak ditemukan. Gunakan akun demo."); setOtpStep(false); }
  };

  const quickLogin = (userEmail) => { setPendingEmail(userEmail); setEmail(userEmail); setOtpStep(true); };

  const handleGoogleLogin = () => { alert("Fitur Masuk dengan Google memerlukan integrasi backend (OAuth). Saat ini hanya tersedia dalam mode simulasi."); };

  if (otpStep) {
    return <OtpPage email={pendingEmail} onVerified={handleOtpVerified} onBack={() => setOtpStep(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-primary px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src={logoSakura} alt="SAKURA" className="w-12 h-12 rounded-full" />
            <div className="text-left">
              <div className="text-primary-foreground font-bold text-xl">SAKURA</div>
              <div className="text-primary-foreground/70 text-sm">Secure Document System</div>
            </div>
          </button>
        </div>
        <h1 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">Secure Archiving and<br />Keeping of Unified<br />Records for Administration</h1>
        <p className="text-primary-foreground/70 text-lg">Sistem manajemen arsip ijazah digital untuk SMP Negeri 4 Cikarang Barat</p>
        <div className="mt-12 space-y-3">
          {[["Upload Ijazah", "Unggah dokumen ijazah dengan mudah"], ["Database Ijazah", "Simpan dan kelola arsip digital"], ["Alur Persetujuan", "Proses persetujuan yang transparan"], ["Arsip Digital", "Arsipkan dokumen secara permanen"]].map(([title, desc]) => (
            <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/5">
              <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <div><span className="text-primary-foreground font-semibold text-sm">{title}</span><span className="text-primary-foreground/60 text-sm"> · {desc}</span></div>
            </div>
          ))}
        </div>
        <p className="mt-auto text-primary-foreground/40 text-xs pt-8">© 2026 SAKURA · President University Capstone Project</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold text-primary">SAKURA</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground mb-1">Masuk ke Sistem</h2>
          <p className="text-muted-foreground mb-8">Autentikasi diperlukan untuk mengakses sistem</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="nama@sakura.sch.id" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-input" /> Ingat saya</label>
              <button type="button" onClick={() => alert("Simulasi: Link reset password dikirim ke email")} className="text-sm text-primary font-medium hover:underline">Lupa password?</button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Masuk ke Sistem →</button>
          </form>

          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">atau</span><div className="flex-1 h-px bg-border" /></div>

          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Masuk dengan Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">Belum punya akun?{" "}<button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">Daftar di sini</button></p>

          <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-3">Akun Demo (Mode Pengembangan):</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Operator / TU", email: "admin@sakura.sch.id" }, { label: "Kepala Sekolah", email: "principal@sakura.sch.id" }, { label: "Guru", email: "teacher@sakura.sch.id" }].map((a) => (
                <button key={a.email} onClick={() => quickLogin(a.email)} className="text-left p-2 rounded-lg border border-border hover:bg-muted text-xs transition-colors">
                  <div className="font-semibold text-foreground">{a.label}</div>
                  <div className="text-muted-foreground">{a.email}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">SMP Negeri 4 Cikarang Barat</p>
          <div className="border-t border-border/50 mt-6" />
          <p className="text-center text-xs text-muted-foreground py-4">© 2026 SAKURA · Developed by Group 5</p>
        </div>
      </div>
    </div>
  );
}
