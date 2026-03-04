import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp } from "@/contexts/AppContext";
import type { UserRole } from "@/data/mockData";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import avatarAdmin from "@/assets/avatar_admin.jpg";

const ALL_ROLES: UserRole[] = ["Operator/TU", "Kepala Sekolah", "Guru"];

interface UserFormData {
  nama: string;
  email: string;
  role: UserRole;
  departemen: string;
}

const EMPTY_FORM: UserFormData = { nama: "", email: "", role: "Guru", departemen: "" };

export default function UserManagementPage() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useApp();
  const [profileUser, setProfileUser] = useState<typeof users[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);

  const isAdmin = currentUser.role === "Operator/TU";

  const handleCreate = () => {
    if (!formData.nama.trim() || !formData.email.trim()) return;
    addUser({ ...formData, avatar: avatarAdmin });
    setShowCreateModal(false);
    setFormData(EMPTY_FORM);
  };

  const handleEdit = () => {
    if (!editUserId || !formData.nama.trim() || !formData.email.trim()) return;
    updateUser(editUserId, formData);
    setEditUserId(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = () => {
    if (!deleteUserId) return;
    deleteUser(deleteUserId);
    setDeleteUserId(null);
  };

  const openEdit = (u: typeof users[0]) => {
    setFormData({ nama: u.nama, email: u.email, role: u.role, departemen: u.departemen });
    setEditUserId(u.id);
  };

  const UserFormModal = ({ title, onSubmit, submitLabel, onClose }: { title: string; onSubmit: () => void; submitLabel: string; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap *</label>
            <input value={formData.nama} onChange={(e) => setFormData((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama lengkap" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
            <input value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="email@sakura.sch.id" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Role</label>
            <select value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value as UserRole }))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Departemen</label>
            <input value={formData.departemen} onChange={(e) => setFormData((p) => ({ ...p, departemen: e.target.value }))} placeholder="Contoh: Tata Usaha" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Batal</button>
            <button onClick={onSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">{submitLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AppHeader title="Manajemen User" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="p-4 sm:p-8 animate-fade-in">
        {/* Header with add button */}
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setFormData(EMPTY_FORM); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Tambah User
            </button>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold">Pengguna</th>
                <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Departemen</th>
                <th className="text-center py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-foreground">{u.nama}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{u.departemen}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {isAdmin && (
                        <>
                          <button onClick={() => openEdit(u)} className="text-xs px-3 py-1 rounded-lg border border-input hover:bg-muted transition-colors flex items-center gap-1">
                            <Pencil size={12} /> Edit
                          </button>
                          {u.id !== currentUser.id && (
                            <button onClick={() => setDeleteUserId(u.id)} className="text-xs px-3 py-1 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1">
                              <Trash2 size={12} /> Hapus
                            </button>
                          )}
                        </>
                      )}
                      <button onClick={() => setProfileUser(u)} className="text-xs px-3 py-1 rounded-lg border border-input hover:bg-muted transition-colors">Profil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <UserFormModal title="Tambah User Baru" onSubmit={handleCreate} submitLabel="Tambah" onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit modal */}
      {editUserId && (
        <UserFormModal title="Edit User" onSubmit={handleEdit} submitLabel="Simpan" onClose={() => { setEditUserId(null); setFormData(EMPTY_FORM); }} />
      )}

      {/* Delete confirmation */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setDeleteUserId(null)}>
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground mb-2">Hapus User</h3>
            <p className="text-sm text-muted-foreground mb-4">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteUserId(null)} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {profileUser && <UserProfileModal user={profileUser} onClose={() => setProfileUser(null)} />}
    </>
  );
}
