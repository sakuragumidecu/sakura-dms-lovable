import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Archive, GitBranch, Users, Shield, FileText, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
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

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const visibleItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  return (
    <aside className={`${collapsed ? "w-[72px]" : "w-[270px]"} min-h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "flex-col gap-2 px-2" : "gap-3 px-5"} py-5`}>
        <img src={logoSakura} alt="SAKURA" className="w-11 h-11 rounded-full bg-sidebar-accent shrink-0" />
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
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-1 mt-1">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}

        {/* Divider */}
        <div className="!my-3 mx-2 h-px bg-sidebar-border" />

        {/* Pengaturan Sistem */}
        <button
          onClick={() => navigate("/settings")}
          title={collapsed ? "Pengaturan Sistem" : undefined}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          }`}
        >
          <Settings size={22} className="shrink-0" />
          {!collapsed && "Pengaturan Sistem"}
        </button>
      </nav>

      {/* Spacer to push nothing to bottom — keep sidebar balanced */}
      <div className="flex-shrink-0 h-6" />
    </aside>
  );
}
