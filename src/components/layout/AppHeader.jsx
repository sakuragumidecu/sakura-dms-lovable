import { Bell, User, LogOut, KeyRound } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AppHeader({ title, subtitle }) {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, logout } = useApp();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell size={20} className="text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-bold text-sm text-foreground">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border scrollbar-thin">
                  {notifications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">Tidak ada notifikasi</p>
                  )}
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors ${!n.read ? "bg-secondary/30" : ""}`}
                    >
                      <div className="text-sm text-foreground">{n.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{format(new Date(n.time), "dd/MM/yyyy HH:mm")}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Profil"
          >
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-12 z-50 w-56 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-semibold text-foreground">{currentUser.nama}</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User size={16} className="text-muted-foreground" /> Profil Saya
              </button>
              <div className="border-t border-border" />
              <button
                onClick={() => { setShowDropdown(false); logout(); navigate("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
