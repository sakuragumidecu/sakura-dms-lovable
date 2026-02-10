import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Archive, GitBranch, Users, Shield, FileText } from "lucide-react";
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
  const { currentUser, hasPermission } = useApp();

  const visibleItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  return (
    <aside className="w-[260px] min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full bg-sidebar-accent" />
        <div>
          <div className="text-sidebar-primary font-bold text-lg leading-tight">SAKURA</div>
          <div className="text-sidebar-foreground/70 text-xs">Secure Archive System</div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="text-sidebar-primary text-sm font-semibold truncate">{currentUser.nama}</div>
            <div className="text-sidebar-foreground/60 text-xs truncate">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
