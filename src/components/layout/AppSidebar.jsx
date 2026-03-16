import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Upload, Archive, GitBranch, Users, Shield, FileText, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";
import { useApp } from "@/contexts/AppContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "dashboard.view" },
  { label: "Upload", icon: Upload, path: "/upload", permission: "documents.upload" },
  { label: "Arsip", icon: Archive, path: "/archive", permission: "documents.archive" },
  { label: "Persetujuan", icon: GitBranch, path: "/approval", permission: "documents.approve" },
  { label: "Pengguna", icon: Users, path: "/users", permission: "users.manage" },
  { label: "Role", icon: Shield, path: "/roles", permission: "roles.manage" },
  { label: "Log", icon: FileText, path: "/logs", permission: "audit.view" },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const visibleItems = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 h-screen bg-sidebar flex flex-col shrink-0 overflow-hidden border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="px-3 pt-5 pb-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <button onClick={() => setCollapsed(false)} title="Perluas sidebar"
              className="p-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200">
              <PanelLeft size={18} />
            </button>
            <button onClick={() => navigate("/home")} className="hover:opacity-80 transition-opacity">
              <img src={logoSakura} alt="SAKURA" className="w-9 h-9 rounded-xl" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-1">
            <button onClick={() => navigate("/home")} className="hover:opacity-80 transition-opacity shrink-0">
              <img src={logoSakura} alt="SAKURA" className="w-9 h-9 rounded-xl" />
            </button>
            <button onClick={() => navigate("/home")} className="text-left hover:opacity-80 transition-opacity min-w-0 flex-1">
              <div className="text-primary font-bold text-sm tracking-wider">SAKURA</div>
              <div className="text-sidebar-foreground/50 text-[10px] font-medium">Document Management</div>
            </button>
            <button onClick={() => setCollapsed(true)} title="Sembunyikan sidebar"
              className="p-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200">
              <PanelLeftClose size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Nav items */}
      <nav className="flex-1 px-2 mt-3 space-y-1 overflow-y-auto scrollbar-thin">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full flex ${collapsed ? 'flex-col items-center justify-center py-3 px-1' : 'items-center gap-3 px-3 py-2.5'} rounded-xl font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              {/* Active left indicator */}
              {active && !collapsed && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={collapsed ? 22 : 18} className={`shrink-0 ${active ? "text-primary" : ""}`} />
              {collapsed ? (
                <span className="text-[9px] mt-1 font-medium leading-tight text-center">{item.label}</span>
              ) : (
                <span className="text-[13px]">{item.label}</span>
              )}
            </motion.button>
          );
        })}

        <div className="!my-4 mx-2 h-px bg-sidebar-border" />

        <motion.button
          onClick={() => navigate("/settings")}
          title={collapsed ? "Pengaturan" : undefined}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`relative w-full flex ${collapsed ? 'flex-col items-center justify-center py-3 px-1' : 'items-center gap-3 px-3 py-2.5'} rounded-xl font-medium transition-all duration-200 ${
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          }`}
        >
          {location.pathname === "/settings" && !collapsed && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <Settings size={collapsed ? 22 : 18} className={`shrink-0 ${location.pathname === "/settings" ? "text-primary" : ""}`} />
          {collapsed ? (
            <span className="text-[9px] mt-1 font-medium leading-tight text-center">Pengaturan</span>
          ) : (
            <span className="text-[13px]">Pengaturan</span>
          )}
        </motion.button>
      </nav>

      <div className="flex-shrink-0 h-6" />
    </motion.aside>
  );
}
