import { useState } from "react";
import { User, Mail, Shield, Hash, Camera, Upload as UploadIcon, Save } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { currentUser, updateUserAvatar, updateUser } = useApp();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(currentUser.nama);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!fullName.trim()) {
      toast({ title: "Nama tidak boleh kosong", variant: "destructive" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateUser(currentUser.id, { nama: fullName.trim() });
      toast({ title: "Profil disimpan", description: "Nama lengkap berhasil diperbarui." });
      setSaving(false);
    }, 400);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUserAvatar(currentUser.id, reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <AppHeader title="Profil Saya" subtitle="Lihat dan kelola informasi profil Anda" />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto animate-fade-in">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Avatar section */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-foreground">{currentUser.nama}</div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                {currentUser.role}
              </span>
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted transition-colors cursor-pointer">
                <UploadIcon size={16} /> Upload Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          {/* Profile details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <User size={18} className="text-primary" /> Informasi Profil
            </h3>

            {/* Editable: Full Name */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Read-only fields */}
            {[
              { icon: Mail, label: "Email", value: currentUser.email },
              { icon: Shield, label: "Role", value: currentUser.role },
              { icon: Hash, label: "User ID", value: String(currentUser.id) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{label}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                  <Icon size={16} className="text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{value}</span>
                </div>
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
