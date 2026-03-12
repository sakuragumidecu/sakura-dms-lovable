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
    <aside className={`${collapsed ? "w-[72px]" : "w-[220px]"} min-h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300`}>
      {/* Header — 3-column grid: Logo | Text | Collapse */}
      <div className="px-3 pt-4 pb-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setCollapsed(false)}
              title="Perluas sidebar"
              className="p-1.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <PanelLeft size={18} />
            </button>
            <button onClick={() => navigate("/home")} className="hover:opacity-80 transition-opacity">
              <img src={logoSakura} alt="SAKURA" className="w-8 h-8 rounded-full bg-sidebar-accent" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3">
            {/* Col 1: Logo */}
            <button onClick={() => navigate("/home")} className="hover:opacity-80 transition-opacity">
              <img src={logoSakura} alt="SAKURA" className="w-8 h-8 rounded-full bg-sidebar-accent" />
            </button>
            {/* Col 2: Text */}
            <button onClick={() => navigate("/home")} className="text-left hover:opacity-80 transition-opacity min-w-0">
              <div className="text-sidebar-primary font-bold text-sm leading-tight tracking-wide">SAKURA</div>
              
            </button>
            {/* Col 3: Collapse icon */}
            <button
              onClick={() => setCollapsed(true)}
              title="Sembunyikan sidebar"
              className="p-1.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
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
