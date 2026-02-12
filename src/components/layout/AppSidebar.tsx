import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Archive, GitBranch, Users, Shield, FileText, Settings, User, PanelLeftClose, PanelLeft } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import { useApp } from "@/contexts/AppContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "dashboard.view" },
  { label: "Upload Dokumen", icon: Upload, path: "/upload", permission: "documents.upload" },
  { label: "Arsip Dokumen", icon: Archive, path: "/archive", permission: "documents.archive" },
  { label: "Persetujuan", icon: GitBranch, path: "/approval", permission: "documents.approve" },
  { label: "Manajemen User", icon: Users, path: "/users", permission: "users.manage" },
  { label: "Manajemen Role", icon: Shield, path: "/roles", permission: "roles.manage" },
  { label: "Log Sistem", icon: FileText, path: "/logs", permission: "audit.view" },
];

const BOTTOM_ITEMS = [
  { label: "Profil Saya", icon: User, path: "/settings", section: "profil" },
  { label: "Pengaturan Sistem", icon: Settings, path: "/settings", section: "tema" },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, hasPermission } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  return (
    <aside className={`${collapsed ? "w-[68px]" : "w-[260px]"} min-h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300`}>
      {/* Top: Logo + Collapse button */}
      <div className={`flex items-center ${collapsed ? "flex-col gap-2 px-2" : "gap-3 px-4"} py-5`}>
        <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full bg-sidebar-accent shrink-0" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sidebar-primary font-bold text-lg leading-tight">SAKURA</div>
            <div className="text-sidebar-foreground/70 text-xs">Secure Archive System</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Perluas sidebar" : "Sembunyikan sidebar"}
          className="p-1.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors shrink-0"
          style={{ display: "flex" }}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: Profile, Settings */}
      <div className="px-3 space-y-1 mb-2">
        {BOTTOM_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </div>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sidebar-primary text-sm font-semibold truncate">{currentUser.nama}</div>
              <div className="text-sidebar-foreground/60 text-xs truncate">{currentUser.role}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
