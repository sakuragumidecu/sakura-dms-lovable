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
    <aside className={`${collapsed ? "w-[72px]" : "w-[190px]"} min-h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300`}>
      {/* Header — grid: collapse icon | logo */}
      <div className="px-3 pt-4 pb-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Perluas sidebar" : "Sembunyikan sidebar"}
            className="p-1.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shrink-0"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
          {!collapsed && (
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer min-w-0"
            >
              <img src={logoSakura} alt="SAKURA" className="w-9 h-9 rounded-full bg-sidebar-accent shrink-0" />
            </button>
          )}
        </div>

        {/* Logo centered when collapsed */}
        {collapsed && (
          <button
            onClick={() => navigate("/home")}
            className="mt-2 flex justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={logoSakura} alt="SAKURA" className="w-9 h-9 rounded-full bg-sidebar-accent" />
          </button>
        )}

        {/* Title only */}
        {!collapsed && (
          <button onClick={() => navigate("/home")} className="mt-2 text-left hover:opacity-80 transition-opacity cursor-pointer w-full">
            <div className="text-sidebar-primary font-bold text-base leading-tight tracking-wide">SAKURA</div>
            <div className="text-sidebar-foreground/50 text-[9px] leading-snug mt-0.5">Secure Archive System</div>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Nav items — icon stacked above label */}
      <nav className="flex-1 px-2 mt-2 space-y-1">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              {!collapsed && <span className="text-[10.5px] leading-tight text-center">{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="!my-3 mx-2 h-px bg-sidebar-border" />

        {/* Pengaturan Sistem */}
        <button
          onClick={() => navigate("/settings")}
          title={collapsed ? "Pengaturan Sistem" : undefined}
          className={`w-full flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          }`}
        >
          <Settings size={22} className="shrink-0" />
          {!collapsed && <span className="text-[10.5px] leading-tight text-center">Pengaturan Sistem</span>}
        </button>
      </nav>

      <div className="flex-shrink-0 h-6" />
    </aside>
  );
}
