import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Building, Hash } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-sakura-success/20 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✓</span></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground mb-6">Akun Anda telah didaftarkan. Role akan ditentukan oleh Administrator. Silakan tunggu konfirmasi atau hubungi Admin.</p>
          <button onClick={() => navigate("/login")} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Ke Halaman Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center"><img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full" /><span className="text-xl font-bold text-primary">SAKURA</span></div>
        <h2 className="text-2xl font-bold text-foreground mb-1 text-center">Daftar Akun Baru</h2>
        <p className="text-muted-foreground mb-8 text-center text-sm">Role akan ditentukan oleh Administrator setelah pendaftaran</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label><div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="text" placeholder="Masukkan nama lengkap" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="email" placeholder="nama@sakura.sch.id" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Departemen</label><div className="relative"><Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><select required className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"><option value="">Pilih departemen</option><option>Tata Usaha</option><option>Guru</option><option>Kepala Sekolah</option><option>Operator/TU</option></select></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Kata Sandi</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type={showPass ? "text" : "password"} placeholder="Minimal 8 karakter" className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Konfirmasi Kata Sandi</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input required type="password" placeholder="Ulangi kata sandi" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">NIP <span className="text-muted-foreground font-normal">(untuk akun Guru)</span></label><div className="relative"><Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Nomor Induk Pegawai" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Daftar Akun</button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">Sudah punya akun?{" "}<button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">Masuk di sini</button></p>
        <div className="border-t border-border/50 mt-6" />
        <p className="text-center text-xs text-muted-foreground py-4">© 2026 SAKURA · Developed by Group 5</p>
      </div>
    </div>
  );
}
