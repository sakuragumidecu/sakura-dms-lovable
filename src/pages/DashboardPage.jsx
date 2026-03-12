import { useState, useMemo } from "react";
import { FileText, Clock, CheckCircle, Archive, XCircle, Eye, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import DocumentListModal from "@/components/modals/DocumentListModal";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import { useApp } from "@/contexts/AppContext";
import { buildFolderTree, docMatchesFolder } from "@/data/mockData";
import { format, differenceInHours } from "date-fns";

const TABS = [
  { key: "ringkasan", label: "Ringkasan", icon: Archive },
  { key: "persetujuan", label: "Persetujuan", icon: CheckCircle },
];

export default function DashboardPage() {
  const { documents, currentUser, hasPermission, approveDocument, rejectDocument, toggleFavorite } = useApp();
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [listModal, setListModal] = useState(null);
  const [detailDoc, setDetailDoc] = useState(null);

  const visibleDocs = useMemo(() => {
    if (currentUser.role === "Guru") {
      return documents.filter((d) => d.pengunggah.id === currentUser.id);
    }
    return documents;
  }, [documents, currentUser]);

  return (
    <>
      <AppHeader title="Dashboard" subtitle={`Selamat Datang, ${currentUser.nama}`} />
      <div className="border-b border-border" />
      <div className="p-8 space-y-6 animate-fade-in">
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "ringkasan" && (
          <OverviewTab
            visibleDocs={visibleDocs}
            onOpenList={(title, docs) => setListModal({ title, docs })}
            onSelectDoc={setDetailDoc}
          />
        )}
        {activeTab === "persetujuan" && (
          <PersetujuanTab
            documents={documents}
            canApprove={hasPermission("documents.approve")}
            approveDocument={approveDocument}
            rejectDocument={rejectDocument}
            onSelectDoc={setDetailDoc}
          />
        )}
      </div>

      {listModal && !detailDoc && (
        <DocumentListModal title={listModal.title} documents={listModal.docs} onClose={() => setListModal(null)} onSelectDocument={(doc) => setDetailDoc(doc)} />
      )}
      {detailDoc && <DocumentDetailModal document={detailDoc} onClose={() => setDetailDoc(null)} />}
    </>
  );
}

function OverviewTab({ visibleDocs, onOpenList, onSelectDoc }) {
  const counts = {
    total: visibleDocs.length,
    menunggu: visibleDocs.filter((d) => d.status === "Menunggu").length,
    disetujui: visibleDocs.filter((d) => d.status === "Disetujui").length,
    ditolak: visibleDocs.filter((d) => d.status === "Ditolak").length,
    diarsipkan: visibleDocs.filter((d) => d.status === "Diarsipkan").length,
  };

  const handleChartClick = (date, status) => {
    let matched = visibleDocs.filter((d) => d.tanggalUpload.startsWith(date));
    if (status && status !== "Upload") {
      const statusMap = {
        "Disetujui": ["Disetujui"],
        "Ditolak": ["Ditolak"],
        "Menunggu": ["Menunggu"],
        "Diarsipkan": ["Diarsipkan"],
      };
      const allowedStatuses = statusMap[status] || [];
      matched = matched.filter((d) => allowedStatuses.includes(d.status));
    }
    const label = status ? `Dokumen ${status} tanggal ${date}` : `Dokumen tanggal ${date}`;
    onOpenList(label, matched.length > 0 ? matched : visibleDocs.slice(0, 3));
  };

  const handleStatusClick = (status) => {
    const statusMap = { "Disetujui": "Disetujui", "Ditolak": "Ditolak", "Menunggu": "Menunggu", "Diarsipkan": "Diarsipkan", "Upload": "all" };
    const key = statusMap[status];
    if (key === "all") {
      onOpenList(`Semua Dokumen (Upload)`, visibleDocs);
    } else if (key) {
      onOpenList(`Dokumen ${status}`, visibleDocs.filter((d) => d.status === key));
    }
  };

  const recentDocs = [...visibleDocs].sort((a, b) => new Date(b.tanggalUpload).getTime() - new Date(a.tanggalUpload).getTime()).slice(0, 5);

  const recentActivity = useMemo(() => {
    const entries = [];
    visibleDocs.forEach((doc) => {
      doc.auditTrail.forEach((e) => {
        entries.push({ docTitle: doc.judul, time: e.time, userName: e.user.nama, userAvatar: e.user.avatar, userRole: e.user.role, action: e.action });
      });
    });
    return entries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [visibleDocs]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Total Dokumen" value={counts.total} icon={FileText} onClick={() => onOpenList("Semua Dokumen", visibleDocs)} />
        <DashboardCard title="Menunggu" value={counts.menunggu} icon={Clock} variant="warning" onClick={() => onOpenList("Dokumen Menunggu", visibleDocs.filter((d) => d.status === "Menunggu"))} />
        <DashboardCard title="Disetujui" value={counts.disetujui} icon={CheckCircle} variant="success" onClick={() => onOpenList("Dokumen Disetujui", visibleDocs.filter((d) => d.status === "Disetujui"))} />
        <DashboardCard title="Ditolak" value={counts.ditolak} icon={XCircle} variant="default" onClick={() => onOpenList("Dokumen Ditolak", visibleDocs.filter((d) => d.status === "Ditolak"))} />
        <DashboardCard title="Diarsipkan" value={counts.diarsipkan} icon={Archive} variant="muted" onClick={() => onOpenList("Dokumen Diarsipkan", visibleDocs.filter((d) => d.status === "Diarsipkan"))} />
      </div>

      <ActivityChart onDateClick={handleChartClick} onStatusClick={handleStatusClick} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">📄 Dokumen Terbaru</h3>
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <button key={doc.id} onClick={() => onSelectDoc(doc)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left">
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
    </>
  );
}

function PersetujuanTab({ documents, canApprove, approveDocument, rejectDocument, onSelectDoc }) {
  const [approveId, setApproveId] = useState(null);
  const [approveComment, setApproveComment] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingDocs = documents.filter((d) => d.status === "Menunggu");

  const getUrgency = (doc) => {
    const hours = differenceInHours(new Date(), new Date(doc.tanggalUpload));
    if (hours > 72) return { label: "Urgent", color: "bg-destructive/20 text-destructive" };
    if (hours > 24) return { label: "Pending", color: "bg-sakura-warning/20 text-sakura-warning" };
    return { label: "Baru", color: "bg-sakura-success/20 text-sakura-success" };
  };

  const handleApprove = (docId) => {
    approveDocument(docId, approveComment.trim() || undefined);
    setApproveId(null);
    setApproveComment("");
  };

  const handleReject = (docId) => {
    if (!rejectReason.trim()) return;
    rejectDocument(docId, rejectReason.trim());
    setRejectId(null);
    setRejectReason("");
  };

  if (pendingDocs.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <CheckCircle size={48} className="mx-auto text-sakura-success mb-3" />
        <p className="text-foreground font-medium">Tidak ada dokumen yang menunggu persetujuan</p>
        <p className="text-sm text-muted-foreground mt-1">Semua dokumen sudah ditinjau.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pendingDocs.map((doc) => {
          const urgency = getUrgency(doc);
          return (
            <div key={doc.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2.5">
                  <img src={doc.pengunggah.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{doc.pengunggah.nama}</div>
                    <div className="text-xs text-muted-foreground">{doc.pengunggah.role}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${urgency.color}`}>
                  {urgency.label}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h4 className="font-bold text-foreground text-sm line-clamp-2">{doc.judul}</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-secondary text-foreground">{doc.kategori}</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-foreground">{doc.tahunAjaran}</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-foreground">{doc.kelas}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {doc.nomorDokumen} · {format(new Date(doc.tanggalUpload), "dd MMM yyyy")}
                </div>
                {doc.catatan && (
                  <div className="text-xs px-2 py-1.5 rounded bg-sakura-warning/10 text-sakura-warning">
                    ⚠ {doc.catatan}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-5 py-3 border-t border-border">
                <button
                  onClick={() => onSelectDoc(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  <Eye size={14} /> Review
                </button>
                {canApprove && (
                  <>
                    <button
                      onClick={() => setApproveId(doc.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sakura-success text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle size={14} /> Setujui
                    </button>
                    <button
                      onClick={() => setRejectId(doc.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {approveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setApproveId(null)}>
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground mb-3">Konfirmasi Persetujuan</h3>
            <textarea value={approveComment} onChange={(e) => setApproveComment(e.target.value)} placeholder="Komentar (opsional)..." rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setApproveId(null); setApproveComment(""); }} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Batal</button>
              <button onClick={() => handleApprove(approveId)} className="px-4 py-2 rounded-lg bg-sakura-success text-white text-sm font-semibold hover:opacity-90">Setujui</button>
            </div>
          </div>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setRejectId(null)}>
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground mb-3">Alasan Penolakan</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Masukkan alasan penolakan..." rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectId(null)} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Batal</button>
              <button onClick={() => handleReject(rejectId)} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Tolak</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
