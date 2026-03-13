import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import CopyrightFooter from "./CopyrightFooter";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 grid grid-rows-[auto_1fr_auto] min-h-screen">
        <div className="row-start-1" />
        <div className="row-start-2 pb-8"><Outlet /></div>
        <CopyrightFooter />
      </main>
    </div>
  );
}
