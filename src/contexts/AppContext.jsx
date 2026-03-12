import React, { createContext, useContext, useState, useRef } from "react";
import { USERS, DOCUMENTS, ROLE_PERMISSIONS, INITIAL_NOTIFICATIONS, DOCUMENT_TYPES, INITIAL_DOCUMENT_COUNTERS } from "@/data/mockData.js";

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [users, setUsers] = useState(USERS);
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [rolePermissions, setRolePermissions] = useState(ROLE_PERMISSIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [documentCounters, setDocumentCounters] = useState(INITIAL_DOCUMENT_COUNTERS);
  const countersRef = useRef(documentCounters);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const generateDocumentNumber = (typeId) => {
    const docType = DOCUMENT_TYPES.find((t) => t.type_id === typeId);
    if (!docType) return `DOC-${Date.now()}`;
    const prefix = docType.code_prefix;
    const year = new Date().getFullYear();
    const counters = countersRef.current;
    const existing = counters.find((c) => c.prefix === prefix && c.year === year);
    let nextSeq;
    let updated;
    if (existing) {
      nextSeq = existing.last_seq + 1;
      updated = counters.map((c) => (c.prefix === prefix && c.year === year ? { ...c, last_seq: nextSeq } : c));
    } else {
      nextSeq = 1;
      updated = [...counters, { prefix, year, last_seq: 1 }];
    }
    countersRef.current = updated;
    setDocumentCounters(updated);
    return `${prefix}/${year}/${String(nextSeq).padStart(3, "0")}`;
  };

  // getFolderForCategory removed — folder mapping now handled by getFolderIdForDocument in mockData

  const login = (email) => {
    const user = users.find((u) => u.email === email);
    if (user) { setCurrentUser(user); setIsLoggedIn(true); return true; }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  const hasPermission = (permission) => {
    return rolePermissions[currentUser.role]?.includes(permission) ?? false;
  };

  const updateUserRole = (userId, newRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser.id === userId) setCurrentUser((p) => ({ ...p, role: newRole }));
  };

  const updateUserAvatar = (userId, avatar) => {
    if (userId !== currentUser.id) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, avatar } : u)));
    setCurrentUser((p) => ({ ...p, avatar }));
  };

  const togglePermission = (role, permission) => {
    setRolePermissions((prev) => {
      const current = prev[role];
      const next = current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission];
      return { ...prev, [role]: next };
    });
  };

  const addAuditNote = (docId, note) => {
    if (!hasPermission("audit.addNote")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const newTrail = [...d.auditTrail, { time: new Date().toISOString(), user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role }, action: `Catatan Admin: ${note}` }];
        return { ...d, auditTrail: newTrail };
      })
    );
  };

  const approveDocument = (docId, comment) => {
    if (!hasPermission("documents.approve")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Menunggu") return d;
        return {
          ...d, status: "Diarsipkan", tanggalEdit: new Date().toISOString(),
          auditTrail: [...d.auditTrail,
            { time: new Date().toISOString(), user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role }, action: comment ? `Menyetujui dokumen: ${comment}` : "Menyetujui dokumen" },
            { time: new Date().toISOString(), user: { nama: "Sistem", avatar: currentUser.avatar, role: "Sistem" }, action: "Dokumen otomatis diarsipkan setelah persetujuan" },
          ],
        };
      })
    );
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setNotifications((prev) => [{ id: Date.now(), message: `Dokumen '${doc.judul}' telah disetujui dan diarsipkan`, time: new Date().toISOString(), read: false, type: "approval", docId }, ...prev]);
    }
  };

  const rejectDocument = (docId, reason) => {
    if (!hasPermission("documents.reject")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Menunggu") return d;
        return {
          ...d, status: "Ditolak", tanggalEdit: new Date().toISOString(), catatan: reason,
          auditTrail: [...d.auditTrail, { time: new Date().toISOString(), user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role }, action: `Menolak dokumen: ${reason}` }],
        };
      })
    );
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setNotifications((prev) => [{ id: Date.now(), message: `Dokumen '${doc.judul}' telah ditolak`, time: new Date().toISOString(), read: false, type: "rejection", docId }, ...prev]);
    }
  };

  const uploadDocument = (doc) => {
    if (!hasPermission("documents.upload")) return;
    const newDoc = {
      ...doc, id: Date.now(), status: "Menunggu", versi: 1, tanggalEdit: doc.tanggalUpload,
      auditTrail: [{ time: doc.tanggalUpload, user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role }, action: "Mengunggah dokumen" }],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setNotifications((prev) => [{ id: Date.now(), message: `Dokumen '${doc.judul}' telah diunggah dan menunggu persetujuan`, time: doc.tanggalUpload, read: false, type: "upload", docId: newDoc.id }, ...prev]);
  };

  const archiveDocument = (docId) => {
    if (!hasPermission("documents.archive")) return;
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId || d.status !== "Disetujui") return d;
        return {
          ...d, status: "Diarsipkan", tanggalEdit: new Date().toISOString(),
          auditTrail: [...d.auditTrail, { time: new Date().toISOString(), user: { nama: currentUser.nama, avatar: currentUser.avatar, role: currentUser.role }, action: "Mengarsipkan dokumen" }],
        };
      })
    );
  };

  const toggleFavorite = (docId) => {
    setDocuments((prev) => prev.map((d) => d.id === docId ? { ...d, favorite: !d.favorite } : d));
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addUser = (user) => {
    if (currentUser.role !== "Operator/TU") return;
    const newUser = { ...user, id: Date.now() };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (userId, data) => {
    if (currentUser.role !== "Operator/TU") return;
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) setCurrentUser((p) => ({ ...p, ...data }));
  };

  // Self-update profile (any logged-in user can update their own name)
  const updateProfile = (data) => {
    const allowed = { nama: data.nama };
    setUsers((prev) => prev.map((u) => u.id === currentUser.id ? { ...u, ...allowed } : u));
    setCurrentUser((p) => ({ ...p, ...allowed }));
  };

  // Change password (mock — compares against stored password)
  const changePassword = (currentPw, newPw) => {
    const user = users.find((u) => u.id === currentUser.id);
    if ((user.password || "password123") !== currentPw) return false;
    setUsers((prev) => prev.map((u) => u.id === currentUser.id ? { ...u, password: newPw } : u));
    return true;
  };

  const deleteUser = (userId) => {
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
      addUser, updateUser, deleteUser, generateDocumentNumber, updateProfile, changePassword,
    }}>
      {children}
    </AppContext.Provider>
  );
};
