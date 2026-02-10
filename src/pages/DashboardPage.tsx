import { useState, useMemo } from "react";
import { FileText, Clock, CheckCircle, Archive, XCircle } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import DocumentListModal from "@/components/modals/DocumentListModal";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import type { Document } from "@/data/mockData";

export default function DashboardPage() {
  const { documents, currentUser, hasPermission } = useApp();
  const [listModal, setListModal] = useState<{ title: string; docs: Document[] } | null>(null);
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);

  // For Staff/Guru, only show their own documents
  const visibleDocs = useMemo(() => {
    if (currentUser.role === "Staff Administrasi" || currentUser.role === "Guru") {
      return documents.filter((d) => d.pengunggah.id === currentUser.id);
    }
    return documents;
  }, [documents, currentUser]);

  const counts = {
    total: visibleDocs.length,
    menunggu: visibleDocs.filter((d) => d.status === "Menunggu").length,
    disetujui: visibleDocs.filter((d) => d.status === "Disetujui").length,
    ditolak: visibleDocs.filter((d) => d.status === "Ditolak").length,
    diarsipkan: visibleDocs.filter((d) => d.status === "Diarsipkan").length,
  };

  const openFilteredList = (title: string, status?: string) => {
    const docs = status ? visibleDocs.filter((d) => d.status === status) : visibleDocs;
    setListModal({ title, docs });
  };

  const handleChartClick = (date: string) => {
    setListModal({ title: `Dokumen tanggal ${date}`, docs: visibleDocs.slice(0, 3) });
  };

  // Recent documents (last 5)
  const recentDocs = [...visibleDocs].sort((a, b) => new Date(b.tanggalUpload).getTime() - new Date(a.tanggalUpload).getTime()).slice(0, 5);

  // Recent activity (all audit entries, sorted by time)
  const recentActivity = useMemo(() => {
    const entries: { docTitle: string; time: string; userName: string; userAvatar: string; userRole: string; action: string }[] = [];
    visibleDocs.forEach((doc) => {
      doc.auditTrail.forEach((e) => {
        entries.push({ docTitle: doc.judul, time: e.time, userName: e.user.nama, userAvatar: e.user.avatar, userRole: e.user.role, action: e.action });
      });
    });
    return entries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [visibleDocs]);

  return (
    <>
      <AppHeader title="Dashboard" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="p-8 space-y-6 animate-fade-in">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <DashboardCard title="Total Dokumen" value={counts.total} icon={FileText} onClick={() => openFilteredList("Semua Dokumen")} />
          <DashboardCard title="Menunggu" value={counts.menunggu} icon={Clock} variant="warning" onClick={() => openFilteredList("Dokumen Menunggu", "Menunggu")} />
          <DashboardCard title="Disetujui" value={counts.disetujui} icon={CheckCircle} variant="success" onClick={() => openFilteredList("Dokumen Disetujui", "Disetujui")} />
          <DashboardCard title="Ditolak" value={counts.ditolak} icon={XCircle} variant="default" onClick={() => openFilteredList("Dokumen Ditolak", "Ditolak")} />
          <DashboardCard title="Diarsipkan" value={counts.diarsipkan} icon={Archive} variant="muted" onClick={() => openFilteredList("Dokumen Diarsipkan", "Diarsipkan")} />
        </div>

        {/* Chart */}
        <ActivityChart onDateClick={handleChartClick} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">📄 Dokumen Terbaru</h3>
            <div className="space-y-2">
              {recentDocs.map((doc) => (
                <button key={doc.id} onClick={() => setDetailDoc(doc)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{doc.judul}</div>
                    <div className="text-xs text-muted-foreground">{doc.nomorDokumen} · {doc.kategori}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" :
                    doc.status === "Menunggu" ? "bg-sakura-warning/20 text-sakura-warning" :
                    doc.status === "Ditolak" ? "bg-destructive/20 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>{doc.status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">🕒 Aktivitas Terbaru</h3>
            <div className="space-y-3">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <img src={act.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{act.userName}</span>
                      <span className="text-xs text-muted-foreground">· {act.userRole}</span>
                    </div>
                    <div className="text-sm text-foreground">{act.action}</div>
                    <div className="text-xs text-muted-foreground">{act.docTitle} · {format(new Date(act.time), "dd/MM/yyyy HH:mm")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {listModal && !detailDoc && (
        <DocumentListModal title={listModal.title} documents={listModal.docs} onClose={() => setListModal(null)} onSelectDocument={(doc) => setDetailDoc(doc)} />
      )}
      {detailDoc && <DocumentDetailModal document={detailDoc} onClose={() => setDetailDoc(null)} />}
    </>
  );
}
