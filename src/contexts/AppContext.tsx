import React, { createContext, useContext, useState, ReactNode } from "react";
import { USERS, DOCUMENTS, ROLE_PERMISSIONS, INITIAL_NOTIFICATIONS, type User, type UserRole, type Document, type Notification } from "@/data/mockData";

interface AppState {
  currentUser: User;
  users: User[];
  documents: Document[];
  rolePermissions: Record<UserRole, string[]>;
  notifications: Notification[];
  isLoggedIn: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  updateUserRole: (userId: number, newRole: UserRole) => void;
  updateUserAvatar: (userId: number, avatar: string) => void;
  togglePermission: (role: UserRole, permission: string) => void;
  addAuditNote: (docId: number, note: string) => void;
  hasPermission: (permission: string) => boolean;
  approveDocument: (docId: number, comment?: string) => void;
  rejectDocument: (docId: number, reason: string) => void;
  uploadDocument: (doc: Omit<Document, "id" | "auditTrail" | "tanggalEdit" | "versi" | "status">) => void;
  archiveDocument: (docId: number) => void;
  toggleFavorite: (docId: number) => void;
  markNotificationRead: (notifId: number) => void;
  markAllNotificationsRead: () => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (userId: number, data: Partial<Omit<User, "id">>) => void;
  deleteUser: (userId: number) => boolean;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [users, setUsers] = useState<User[]>(USERS);
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS);
  const [rolePermissions, setRolePermissions] = useState(ROLE_PERMISSIONS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email: string) => {
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  const hasPermission = (permission: string) => {
    return rolePermissions[currentUser.role]?.includes(permission) ?? false;
  };

  const updateUserRole = (userId: number, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser.id === userId) setCurrentUser((p) => ({ ...p, role: newRole }));
  };

  const updateUserAvatar = (userId: number, avatar: string) => {
    if (userId !== currentUser.id) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, avatar } : u)));
    setCurrentUser((p) => ({ ...p, avatar }));
  };

  const togglePermission = (role: UserRole, permission: string) => {
    setRolePermissions((prev) => {
      const current = prev[role];
      const next = current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission];
      return { ...prev, [role]: next };
    });
  };

  const addAuditNote = (docId: number, note: string) => {
    if (!hasPermission("audit.addNote")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const newTrail = [...d.auditTrail, {
          time: new Date().toISOString(),
          user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role },
          action: `Catatan Admin: ${note}`,
        }];
        return { ...d, auditTrail: newTrail };
      })
    );
  };

  const approveDocument = (docId: number, comment?: string) => {
    if (!hasPermission("documents.approve")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Menunggu") return d;
        return {
          ...d,
          status: "Diarsipkan" as const,
          tanggalEdit: new Date().toISOString(),
          auditTrail: [...d.auditTrail,
            {
              time: new Date().toISOString(),
              user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role },
              action: comment ? `Menyetujui dokumen: ${comment}` : "Menyetujui dokumen",
            },
            {
              time: new Date().toISOString(),
              user: { nama: "Sistem", avatar: currentUser.avatar, role: "Sistem" },
              action: "Dokumen otomatis diarsipkan setelah persetujuan",
            },
          ],
        };
      })
    );
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setNotifications((prev) => [{
        id: Date.now(), message: `Dokumen '${doc.judul}' telah disetujui dan diarsipkan`, time: new Date().toISOString(), read: false, type: "approval", docId,
      }, ...prev]);
    }
  };

  const rejectDocument = (docId: number, reason: string) => {
    if (!hasPermission("documents.reject")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Menunggu") return d;
        return {
          ...d,
          status: "Ditolak" as const,
          tanggalEdit: new Date().toISOString(),
          catatan: reason,
          auditTrail: [...d.auditTrail, {
            time: new Date().toISOString(),
            user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role },
            action: `Menolak dokumen: ${reason}`,
          }],
        };
      })
    );
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setNotifications((prev) => [{
        id: Date.now(), message: `Dokumen '${doc.judul}' telah ditolak`, time: new Date().toISOString(), read: false, type: "rejection", docId,
      }, ...prev]);
    }
  };

  const uploadDocument = (doc: Omit<Document, "id" | "auditTrail" | "tanggalEdit" | "versi" | "status">) => {
    if (!hasPermission("documents.upload")) return;
    const newDoc: Document = {
      ...doc,
      id: Date.now(),
      status: "Menunggu",
      versi: 1,
      tanggalEdit: doc.tanggalUpload,
      auditTrail: [{
        time: doc.tanggalUpload,
        user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role },
        action: "Mengunggah dokumen",
      }],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setNotifications((prev) => [{
      id: Date.now(), message: `Dokumen '${doc.judul}' telah diunggah dan menunggu persetujuan`, time: doc.tanggalUpload, read: false, type: "upload", docId: newDoc.id,
    }, ...prev]);
  };

  const archiveDocument = (docId: number) => {
    if (!hasPermission("documents.archive")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Disetujui") return d;
        return {
          ...d,
          status: "Diarsipkan" as const,
          tanggalEdit: new Date().toISOString(),
          auditTrail: [...d.auditTrail, {
            time: new Date().toISOString(),
            user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role },
            action: "Mengarsipkan dokumen",
          }],
        };
      })
    );
  };

  const toggleFavorite = (docId: number) => {
    setDocuments((prev) => prev.map((d) => d.id === docId ? { ...d, favorite: !d.favorite } : d));
  };

  const markNotificationRead = (notifId: number) => {
    setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addUser = (user: Omit<User, "id">) => {
    if (currentUser.role !== "Operator/TU") return;
    const newUser: User = { ...user, id: Date.now() };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (userId: number, data: Partial<Omit<User, "id">>) => {
    if (currentUser.role !== "Operator/TU") return;
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) {
      setCurrentUser((p) => ({ ...p, ...data }));
    }
  };

  const deleteUser = (userId: number): boolean => {
    if (currentUser.role !== "Operator/TU") return false;
    if (userId === currentUser.id) return false;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, documents, rolePermissions, notifications, isLoggedIn,
      login, logout, updateUserRole, updateUserAvatar, togglePermission, addAuditNote,
      hasPermission, approveDocument, rejectDocument, uploadDocument, archiveDocument,
      toggleFavorite, markNotificationRead, markAllNotificationsRead,
      addUser, updateUser, deleteUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};
