import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      navigate("/dashboard");
    } else {
      setError("Email tidak ditemukan. Gunakan akun demo.");
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    if (login(userEmail)) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-primary px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <img src={logoSakura} alt="SAKURA" className="w-12 h-12 rounded-full" />
          <div>
            <div className="text-primary-foreground font-bold text-xl">SAKURA</div>
            <div className="text-primary-foreground/70 text-sm">Secure Document System</div>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
          Secure Archiving and<br />Keeping of Unified<br />Records for Administration
        </h1>
        <p className="text-primary-foreground/70 text-lg">
          Sistem manajemen arsip ijazah digital untuk SMP Negeri 4 Cikarang Barat
        </p>
        <div className="mt-12 space-y-3">
          {["Upload Ijazah — Unggah dokumen ijazah dengan mudah", "Database Ijazah — Simpan dan kelola arsip digital", "Alur Persetujuan — Proses persetujuan yang transparan", "Arsip Digital — Arsipkan dokumen secara permanen"].map((t) => {
            const [title, desc] = t.split(" — ");
            return (
              <div key={title} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/5">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <div>
                  <span className="text-primary-foreground font-semibold text-sm">{title}</span>
                  <span className="text-primary-foreground/60 text-sm"> — {desc}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-auto text-primary-foreground/40 text-xs pt-8">© 2026 SAKURA — President University Capstone Project</p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold text-primary">SAKURA</span>
          </div>
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
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Masuk ke Sistem →
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">Daftar di sini</button>
          </p>

          <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-3">Akun Demo (Mode Pengembangan):</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Operator / TU", email: "admin@sakura.sch.id" },
                { label: "Kepala Sekolah", email: "principal@sakura.sch.id" },
                { label: "Staff Administrasi", email: "staff@sakura.sch.id" },
                { label: "Guru", email: "teacher@sakura.sch.id" },
              ].map((a) => (
                <button key={a.email} onClick={() => quickLogin(a.email)} className="text-left p-2 rounded-lg border border-border hover:bg-muted text-xs transition-colors">
                  <div className="font-semibold text-foreground">{a.label}</div>
                  <div className="text-muted-foreground">{a.email}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">SMP Negeri 4 Cikarang Barat</p>
        </div>
      </div>
    </div>
  );
}
