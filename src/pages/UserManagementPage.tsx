import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp } from "@/contexts/AppContext";
import type { UserRole } from "@/data/mockData";
import UserProfileModal from "@/components/modals/UserProfileModal";

const ALL_ROLES: UserRole[] = ["Admin/TU", "Kepala Sekolah", "Staff Administrasi", "Guru"];

export default function UserManagementPage() {
  const { users, updateUserRole } = useApp();
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [profileUser, setProfileUser] = useState<typeof users[0] | null>(null);

  return (
    <>
      <AppHeader title="Manajemen User" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="p-8 animate-fade-in">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold">Pengguna</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Departemen</th>
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
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">
                    {editingUser === u.id ? (
                      <select
                        value={u.role}
                        onChange={(e) => { updateUserRole(u.id, e.target.value as UserRole); setEditingUser(null); }}
                        className="px-2 py-1 rounded border border-input bg-background text-sm"
                        autoFocus
                        onBlur={() => setEditingUser(null)}
                      >
                        {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">{u.role}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.departemen}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditingUser(u.id)} className="text-xs px-3 py-1 rounded-lg border border-input hover:bg-muted transition-colors">Edit Role</button>
                      <button onClick={() => setProfileUser(u)} className="text-xs px-3 py-1 rounded-lg border border-input hover:bg-muted transition-colors">Profil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {profileUser && <UserProfileModal user={profileUser} onClose={() => setProfileUser(null)} />}
    </>
  );
}
