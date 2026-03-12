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
    <aside className={`${collapsed ? "w-[78px]" : "w-[180px]"} min-h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300 relative`}>
      {/* Collapse toggle — top-right edge */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Perluas sidebar" : "Sembunyikan sidebar"}
        className="absolute top-3 right-0 translate-x-1/2 z-10 p-1 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors shadow-sm"
      >
        {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Branding */}
      <div className="flex flex-col items-center pt-6 pb-4 px-3">
        <img src={logoSakura} alt="SAKURA" className="w-12 h-12 rounded-full bg-sidebar-accent shrink-0" />
        {!collapsed && (
          <div className="text-center mt-3">
            <div className="text-sidebar-primary font-bold text-lg leading-tight tracking-wide">SAKURA</div>
            <p className="text-sidebar-foreground/60 text-[10px] leading-relaxed mt-1.5 px-2">
              Secure Archiving and Keeping of Unified Records for Administration
            </p>
          </div>
        )}
      </div>

      {/* Divider below branding */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Main nav — stacked: large icon on top, label below */}
      <nav className="flex-1 px-3 mt-3 space-y-2">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={30} className="shrink-0" />
              {!collapsed && <span className="text-[11px] leading-tight text-center">{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="!my-4 mx-2 h-px bg-sidebar-border" />

        {/* Pengaturan Sistem */}
        <button
          onClick={() => navigate("/settings")}
          title={collapsed ? "Pengaturan Sistem" : undefined}
          className={`w-full flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-xl font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          }`}
        >
          <Settings size={30} className="shrink-0" />
          {!collapsed && <span className="text-[11px] leading-tight text-center">Pengaturan Sistem</span>}
        </button>
      </nav>

      <div className="flex-shrink-0 h-6" />
    </aside>
  );
}
