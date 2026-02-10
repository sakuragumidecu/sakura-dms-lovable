import { useState, useMemo } from "react";
import { FileText, Clock, CheckCircle, Archive, XCircle, Folder, FolderOpen, Star, ChevronRight, ChevronDown, Eye, Search, Download, X, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import DocumentListModal from "@/components/modals/DocumentListModal";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import { useApp } from "@/contexts/AppContext";
import { buildFolderTree, docMatchesFolder } from "@/data/mockData";
import { format, differenceInHours } from "date-fns";
import type { Document, FolderNode } from "@/data/mockData";

type TabKey = "ringkasan" | "dokumen" | "persetujuan";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "ringkasan", label: "Ringkasan", icon: Archive },
  { key: "dokumen", label: "Dokumen", icon: Folder },
  { key: "persetujuan", label: "Persetujuan", icon: CheckCircle },
];

export default function DashboardPage() {
  const { documents, currentUser, hasPermission, approveDocument, rejectDocument, toggleFavorite } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>("ringkasan");
  const [listModal, setListModal] = useState<{ title: string; docs: Document[] } | null>(null);
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);

  // For Staff/Guru, only show their own documents
  const visibleDocs = useMemo(() => {
    if (currentUser.role === "Staff Administrasi" || currentUser.role === "Guru") {
      return documents.filter((d) => d.pengunggah.id === currentUser.id);
    }
    return documents;
  }, [documents, currentUser]);

  return (
    <>
      <AppHeader title="Dashboard" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="p-8 space-y-6 animate-fade-in">
        {/* Tabs */}
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
        {activeTab === "dokumen" && (
          <DokumenTab documents={visibleDocs} onSelectDoc={setDetailDoc} toggleFavorite={toggleFavorite} />
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

/* ============ OVERVIEW TAB ============ */
function OverviewTab({ visibleDocs, onOpenList, onSelectDoc }: {
  visibleDocs: Document[];
  onOpenList: (title: string, docs: Document[]) => void;
  onSelectDoc: (doc: Document) => void;
}) {
  const counts = {
    total: visibleDocs.length,
    menunggu: visibleDocs.filter((d) => d.status === "Menunggu").length,
    disetujui: visibleDocs.filter((d) => d.status === "Disetujui").length,
    ditolak: visibleDocs.filter((d) => d.status === "Ditolak").length,
    diarsipkan: visibleDocs.filter((d) => d.status === "Diarsipkan").length,
  };

  const handleChartClick = (date: string) => {
    onOpenList(`Dokumen tanggal ${date}`, visibleDocs.slice(0, 3));
  };

  const recentDocs = [...visibleDocs].sort((a, b) => new Date(b.tanggalUpload).getTime() - new Date(a.tanggalUpload).getTime()).slice(0, 5);

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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard title="Total Dokumen" value={counts.total} icon={FileText} onClick={() => onOpenList("Semua Dokumen", visibleDocs)} />
        <DashboardCard title="Menunggu" value={counts.menunggu} icon={Clock} variant="warning" onClick={() => onOpenList("Dokumen Menunggu", visibleDocs.filter((d) => d.status === "Menunggu"))} />
        <DashboardCard title="Disetujui" value={counts.disetujui} icon={CheckCircle} variant="success" onClick={() => onOpenList("Dokumen Disetujui", visibleDocs.filter((d) => d.status === "Disetujui"))} />
        <DashboardCard title="Ditolak" value={counts.ditolak} icon={XCircle} variant="default" onClick={() => onOpenList("Dokumen Ditolak", visibleDocs.filter((d) => d.status === "Ditolak"))} />
        <DashboardCard title="Diarsipkan" value={counts.diarsipkan} icon={Archive} variant="muted" onClick={() => onOpenList("Dokumen Diarsipkan", visibleDocs.filter((d) => d.status === "Diarsipkan"))} />
      </div>

      <ActivityChart onDateClick={handleChartClick} />

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

/* ============ DOKUMEN TAB ============ */
function DokumenTab({ documents, onSelectDoc, toggleFavorite }: {
  documents: Document[];
  onSelectDoc: (doc: Document) => void;
  toggleFavorite: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [showPdfOverlay, setShowPdfOverlay] = useState(false);

  const folderTree = useMemo(() => buildFolderTree(documents), [documents]);

  useMemo(() => {
    if (folderTree.length > 0 && expandedFolders.size === 0) {
      setExpandedFolders(new Set([folderTree[0].path]));
    }
  }, [folderTree]);

  const toggleExpand = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let docs = documents;
    if (selectedFolder) docs = docs.filter((d) => docMatchesFolder(d, selectedFolder));
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter((d) => d.judul.toLowerCase().includes(q) || d.nomorDokumen.toLowerCase().includes(q));
    }
    return docs;
  }, [documents, selectedFolder, search]);

  const renderFolder = (folder: FolderNode, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.path);
    const hasChildren = folder.children.length > 0;
    const isSelected = selectedFolder === folder.path;

    return (
      <div key={folder.path}>
        <button
          onClick={() => { if (hasChildren) toggleExpand(folder.path); setSelectedFolder(folder.path); setPreviewDoc(null); }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
            isSelected ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          {hasChildren ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <span className="w-3" />}
          {isExpanded && hasChildren ? <FolderOpen size={14} className="text-sakura-warning" /> : <Folder size={14} className="text-muted-foreground" />}
          <span className="truncate">{folder.name}</span>
        </button>
        {isExpanded && folder.children.map((child) => renderFolder(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex gap-0 bg-card rounded-xl border border-border overflow-hidden" style={{ minHeight: "500px" }}>
      {/* Folder tree */}
      <div className="w-52 shrink-0 border-r border-border p-3 overflow-y-auto space-y-1">
        <button
          onClick={() => { setSelectedFolder(null); setPreviewDoc(null); }}
          className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium ${!selectedFolder ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
        >
          Semua
        </button>
        <div className="h-px bg-border my-1" />
        {folderTree.map((f) => renderFolder(f))}
      </div>

      {/* Doc list */}
      <div className={`flex-1 p-4 overflow-y-auto ${previewDoc ? "max-w-[50%]" : ""}`}>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari dokumen..." className="w-full pl-8 pr-3 py-2 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="space-y-1">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setPreviewDoc(doc)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${previewDoc?.id === doc.id ? "bg-secondary" : "hover:bg-muted/50"}`}
            >
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(doc.id); }} className="shrink-0">
                <Star size={14} className={doc.favorite ? "fill-sakura-warning text-sakura-warning" : "text-muted-foreground"} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">{doc.judul}</div>
                <div className="text-xs text-muted-foreground">{doc.nomorDokumen} · {doc.kategori}</div>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" :
                doc.status === "Menunggu" ? "bg-sakura-warning/20 text-sakura-warning" :
                doc.status === "Ditolak" ? "bg-destructive/20 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>{doc.status}</span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-6 text-sm">Tidak ada dokumen.</p>}
        </div>
      </div>

      {/* Side preview */}
      {previewDoc && (
        <div className="w-80 shrink-0 border-l border-border p-4 overflow-y-auto space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm text-foreground">{previewDoc.judul}</h4>
            <button onClick={() => setPreviewDoc(null)} className="p-1 rounded hover:bg-muted"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Kategori:</span> <span className="font-medium text-foreground">{previewDoc.kategori}</span></div>
            <div><span className="text-muted-foreground">Kelas:</span> <span className="font-medium text-foreground">{previewDoc.kelas}</span></div>
            <div><span className="text-muted-foreground">Status:</span> <span className="font-medium text-foreground">{previewDoc.status}</span></div>
            <div><span className="text-muted-foreground">Upload:</span> <span className="font-medium text-foreground">{format(new Date(previewDoc.tanggalUpload), "dd/MM/yy")}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowPdfOverlay(true)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
              <Eye size={14} /> Preview
            </button>
            <button onClick={() => onSelectDoc(previewDoc)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted">
              <FileText size={14} /> Detail
            </button>
          </div>
        </div>
      )}
      {showPdfOverlay && previewDoc && <PdfPreviewOverlay onClose={() => setShowPdfOverlay(false)} document={previewDoc} />}
    </div>
  );
}

/* ============ PERSETUJUAN TAB ============ */
function PersetujuanTab({ documents, canApprove, approveDocument, rejectDocument, onSelectDoc }: {
  documents: Document[];
  canApprove: boolean;
  approveDocument: (docId: number, comment?: string) => void;
  rejectDocument: (docId: number, reason: string) => void;
  onSelectDoc: (doc: Document) => void;
}) {
  const [approveId, setApproveId] = useState<number | null>(null);
  const [approveComment, setApproveComment] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingDocs = documents.filter((d) => d.status === "Menunggu");

  const getUrgency = (doc: Document) => {
    const hours = differenceInHours(new Date(), new Date(doc.tanggalUpload));
    if (hours > 72) return { label: "Urgent", color: "bg-destructive/20 text-destructive" };
    if (hours > 24) return { label: "Pending", color: "bg-sakura-warning/20 text-sakura-warning" };
    return { label: "Baru", color: "bg-sakura-success/20 text-sakura-success" };
  };

  const handleApprove = (docId: number) => {
    approveDocument(docId, approveComment.trim() || undefined);
    setApproveId(null);
    setApproveComment("");
  };

  const handleReject = (docId: number) => {
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
              {/* Card header */}
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

              {/* Card body */}
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

              {/* Card actions */}
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
                      <CheckCircle size={14} /> Approve
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

      {/* Approve modal */}
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

      {/* Reject modal */}
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
