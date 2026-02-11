import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="w-[260px] h-full" onClick={(e) => e.stopPropagation()}>
            <AppSidebar mobileMode onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <AppSidebar />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-3 left-3 z-30 p-2 rounded-lg bg-card border border-border shadow-sm"
        >
          <Menu size={20} />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
