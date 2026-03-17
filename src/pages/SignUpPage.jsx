import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building, Hash, Clock } from "lucide-react";
import { motion } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";
import SakuraPetals from "@/components/SakuraPetals";
import { useApp } from "@/contexts/AppContext";

const DEPARTEMEN_OPTIONS = [
  "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA", "IPS",
  "Pendidikan Agama", "PKN", "Seni Budaya", "PJOK", "Informatika",
  "BK (Bimbingan Konseling)", "Tata Usaha", "Lainnya",
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { registerUser } = useApp();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama: "", nip: "", email: "", departemen: "", password: "", confirmPassword: "",
  });

  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nama || !formData.nip || !formData.email || !formData.departemen || !formData.password || !formData.confirmPassword) {
      setError("Semua field wajib diisi."); return;
    }
    if (!/^\d{18}$/.test(formData.nip)) {
      setError("NIP harus 18 digit angka."); return;
    }
    if (formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter."); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok."); return;
    }

    registerUser({
      nama: formData.nama,
      nip: formData.nip,
      email: formData.email,
      departemen: formData.departemen,
      password: formData.password,
      role: "Guru",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground mb-6">
            Akun Anda sedang menunggu persetujuan dari Operator TU. Anda akan mendapat notifikasi setelah akun diaktifkan.
          </p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/")} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Kembali ke Beranda
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-5/12 relative overflow-hidden px-12 py-16" style={{ background: "linear-gradient(135deg, hsl(340 65% 30%), hsl(340 73% 42%), hsl(340 50% 38%))" }}>
        <SakuraPetals count={10} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
              <img src={logoSakura} alt="SAKURA" className="w-11 h-11 rounded-xl" />
              <div className="text-left">
                <div className="text-white font-bold text-xl tracking-wider">SAKURA</div>
                <div className="text-white/50 text-xs font-medium">Document Management System</div>
              </div>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-[1.15] mb-4">Daftar Akun Baru</h1>
          <p className="text-white/60 text-base leading-relaxed max-w-lg">
            Bergabung dengan SAKURA untuk mengelola dokumen administrasi sekolah secara digital.
          </p>
          <p className="mt-auto text-white/30 text-[11px] pt-12 font-medium">© 2026 SAKURA · Developed by Group 5</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <button onClick={() => navigate("/")} className="lg:hidden flex items-center gap-3 mb-6">
            <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-primary tracking-wider">SAKURA</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground mb-1 lg:text-left text-center">Daftar Akun Guru</h2>
          <p className="text-muted-foreground mb-6 text-sm lg:text-left text-center">Akun akan diaktifkan oleh Operator TU setelah pendaftaran</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap *</label>
              <div className="relative group">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input required value={formData.nama} onChange={(e) => update("nama", e.target.value)} type="text" placeholder="Masukkan nama lengkap" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">NIP (Nomor Induk Pegawai) *</label>
              <div className="relative group">
                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input required value={formData.nip} onChange={(e) => update("nip", e.target.value.replace(/\D/g, "").slice(0, 18))} type="text" placeholder="18 digit angka" maxLength={18} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">NIP digunakan untuk mengakses dokumen pribadi Anda</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Institusi *</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input required value={formData.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="nama@sakura.sch.id" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Departemen / Mata Pelajaran *</label>
              <div className="relative group">
                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <select required value={formData.departemen} onChange={(e) => update("departemen", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all appearance-none">
                  <option value="">Pilih departemen</option>
                  {DEPARTEMEN_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Kata Sandi *</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input required value={formData.password} onChange={(e) => update("password", e.target.value)} type={showPass ? "text" : "password"} placeholder="Minimal 8 karakter" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Konfirmasi Kata Sandi *</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input required value={formData.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} type="password" placeholder="Ulangi kata sandi" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all" />
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Daftar Akun
            </motion.button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">Sudah punya akun?{" "}<button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">Masuk di sini</button></p>
          <div className="border-t border-border/50 mt-6" />
          <p className="text-center text-xs text-muted-foreground py-4">© 2026 SAKURA · Developed by Group 5</p>
        </motion.div>
      </div>
    </div>
  );
}
