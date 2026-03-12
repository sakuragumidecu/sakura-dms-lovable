import { useState, useMemo } from "react";
import { Search, RotateCcw, Folder, FolderOpen, Star, FileText as FileIcon, ChevronRight, ChevronDown, Eye, Download, Clock, X, Upload, Plus, Pencil, Trash2, Monitor } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import UploadForm from "@/components/upload/UploadForm";
import { useApp } from "@/contexts/AppContext";
import { useSettings } from "@/contexts/SettingsContext";
import { buildFolderTree, docMatchesFolder, KATEGORI_OPTIONS } from "@/data/mockData";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const STATUS_SECTIONS = [
  { key: "Menunggu", label: "Belum Disetujui", color: "text-sakura-warning", bgColor: "bg-sakura-warning/10 border-sakura-warning/20", badgeColor: "bg-sakura-warning/20 text-sakura-warning", opacity: true },
  { key: "Disetujui", label: "Disetujui", color: "text-sakura-success", bgColor: "bg-sakura-success/10 border-sakura-success/20", badgeColor: "bg-sakura-success/20 text-sakura-success", opacity: false },
  { key: "Diarsipkan", label: "Diarsipkan", color: "text-muted-foreground", bgColor: "bg-muted/50 border-border", badgeColor: "bg-muted text-muted-foreground", opacity: false },
  { key: "Ditolak", label: "Ditolak", color: "text-destructive", bgColor: "bg-destructive/5 border-destructive/20", badgeColor: "bg-destructive/20 text-destructive", opacity: false },
];

export default function ArchivePage() {
  const { documents, toggleFavorite, currentUser } = useApp();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [detailDoc, setDetailDoc] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showPdfOverlay, setShowPdfOverlay] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isAdmin = currentUser.role === "Operator/TU";

  // Build folder tree from schema-aligned FOLDERS table
  const folderTree = useMemo(() => buildFolderTree(documents), [documents]);

  // Auto-expand first category on mount
  useMemo(() => {
    if (folderTree.length > 0 && expandedFolders.size === 0) {
      setExpandedFolders(new Set([folderTree[0].path]));
    }
  }, [folderTree]);

  const toggleExpand = (path) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let docs = documents;
    if (showFavorites) docs = docs.filter((d) => d.favorite);
    if (selectedFolder) docs = docs.filter((d) => docMatchesFolder(d, selectedFolder));
    if (statusFilter !== "Semua") docs = docs.filter((d) => d.status === statusFilter);
    if (categoryFilter !== "Semua") docs = docs.filter((d) => d.kategori === categoryFilter);
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter((d) => d.judul.toLowerCase().includes(q) || d.nomorDokumen.toLowerCase().includes(q) || d.pengunggah.nama.toLowerCase().includes(q));
    }
    return docs;
  }, [documents, search, statusFilter, categoryFilter, selectedFolder, showFavorites]);

  const groupedDocs = useMemo(() => {
    const groups = {};
    STATUS_SECTIONS.forEach((s) => { groups[s.key] = []; });
    filtered.forEach((doc) => {
      if (groups[doc.status]) groups[doc.status].push(doc);
    });
    return groups;
  }, [filtered]);

  // Build breadcrumb from structured path
  const breadcrumbParts = useMemo(() => {
    if (!selectedFolder) return null;
    // Walk the tree to find names for the path
    const findPath = (nodes, targetPath, trail = []) => {
      for (const node of nodes) {
        if (node.path === targetPath) return [...trail, { label: node.name, path: node.path }];
        if (targetPath.startsWith(node.path + "/")) {
          const result = findPath(node.children, targetPath, [...trail, { label: node.name, path: node.path }]);
          if (result) return result;
        }
      }
      return null;
    };
    return findPath(folderTree, selectedFolder) || [{ label: selectedFolder, path: selectedFolder }];
  }, [selectedFolder, folderTree]);

  // Count documents in a folder (for badge)
  const countDocsInFolder = (folderPath) => {
    return documents.filter((d) => docMatchesFolder(d, folderPath)).length;
  };

  const renderFolder = (folder, depth = 0) => {
    const isExpanded = expandedFolders.has(folder.path);
    const hasChildren = folder.children.length > 0;
    const isSelected = selectedFolder === folder.path;
    const docCount = countDocsInFolder(folder.path);

    return (
      <div key={folder.path}>
        <div className="group flex items-center" style={{ paddingLeft: `${12 + depth * 20}px` }}>
          <button
            onClick={() => {
              if (hasChildren) toggleExpand(folder.path);
              setSelectedFolder(folder.path);
              setShowFavorites(false);
              setPreviewDoc(null);
            }}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-0 ${
              isSelected ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
            }`}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            {isExpanded && hasChildren ? (
              <FolderOpen size={16} className="text-sakura-warning shrink-0" />
            ) : (
              <Folder size={16} className={`shrink-0 ${hasChildren ? "text-muted-foreground" : "text-sakura-warning"}`} />
            )}
            <span className="truncate">{folder.name}</span>
            {docCount > 0 && (
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">{docCount}</span>
            )}
          </button>
        </div>
        {isExpanded && folder.children.map((child) => renderFolder(child, depth + 1))}
      </div>
    );
  };

  const renderDocCard = (doc, dimmed) => (
    <div
      key={doc.id}
      className={`flex items-center gap-4 p-4 bg-card rounded-lg border transition cursor-pointer ${
        previewDoc?.id === doc.id ? "border-primary shadow-md" : "border-border hover:shadow"
      } ${dimmed ? "opacity-50" : ""}`}
      onClick={() => setPreviewDoc(doc)}
    >
      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(doc.id); }} className="shrink-0">
        <Star size={18} className={doc.favorite ? "fill-sakura-warning text-sakura-warning" : "text-muted-foreground hover:text-sakura-warning"} />
      </button>
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <FileIcon size={20} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-foreground truncate">{doc.judul}</div>
        <div className="text-xs text-muted-foreground">{doc.nomorDokumen} · {doc.kategori} · {doc.jenisDokumen}</div>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
        doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" :
        doc.status === "Menunggu" ? "bg-sakura-warning/20 text-sakura-warning" :
        doc.status === "Ditolak" ? "bg-destructive/20 text-destructive" :
        "bg-muted text-muted-foreground"
      }`}>{doc.status}</span>
    </div>
  );

  return (
    <>
      <AppHeader title="Arsip Dokumen" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="flex flex-1 animate-fade-in overflow-hidden">
        {/* Left - Folder tree */}
        <div className="w-64 shrink-0 border-r border-border bg-card p-4 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Folder size={16} className="text-sakura-warning" /> Struktur Folder
            </h3>
          </div>
          <button
            onClick={() => { setSelectedFolder(null); setShowFavorites(false); setPreviewDoc(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedFolder && !showFavorites ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
            }`}
          >
            Semua Dokumen
          </button>
          <button
            onClick={() => { setShowFavorites(true); setSelectedFolder(null); setPreviewDoc(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              showFavorites ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
            }`}
          >
            <Star size={14} className="text-sakura-warning" /> Favorit
          </button>
          {folderTree.map((folder) => renderFolder(folder))}
        </div>

        {/* Center - Document list */}
        <div className={`flex-1 p-6 space-y-4 overflow-y-auto ${previewDoc ? "max-w-[50%]" : ""}`}>
          {breadcrumbParts && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
              <Monitor size={14} className="shrink-0" />
              <ChevronRight size={12} className="shrink-0" />
              {breadcrumbParts.map((part, i) => (
                <span key={part.path} className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedFolder(part.path); setPreviewDoc(null); }}
                    className={`hover:text-primary transition-colors ${i === breadcrumbParts.length - 1 ? "font-semibold text-foreground" : ""}`}
                  >
                    {part.label}
                  </button>
                  {i < breadcrumbParts.length - 1 && <ChevronRight size={12} className="shrink-0" />}
                </span>
              ))}
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              {showFavorites ? (
                <><Star size={20} className="text-sakura-warning fill-sakura-warning" /> Dokumen Favorit</>
              ) : selectedFolder ? (
                <><Folder size={20} className="text-sakura-warning" /> {breadcrumbParts ? breadcrumbParts[breadcrumbParts.length - 1]?.label : "Folder"}</>
              ) : (
                "Semua Dokumen Arsip"
              )}
            </h2>
            <p className="text-sm text-muted-foreground">{filtered.length} dokumen ditemukan</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-xl border border-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nomor, judul, atau pengunggah..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
              <option value="Semua">Semua Status</option>
              <option>Menunggu</option><option>Disetujui</option><option>Ditolak</option><option>Diarsipkan</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
              <option value="Semua">Semua Kategori</option>
              {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
            </select>
            <button onClick={() => { setSearch(""); setStatusFilter("Semua"); setCategoryFilter("Semua"); }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-input text-sm hover:bg-muted transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <Upload size={14} /> Upload Dokumen
            </button>
          </div>

          {/* Results grouped by status */}
          {statusFilter !== "Semua" ? (
            <div className="space-y-2">
              {filtered.map((doc) => renderDocCard(doc, false))}
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada dokumen ditemukan.</p>}
            </div>
          ) : (
            <div className="space-y-6">
              {STATUS_SECTIONS.map((section) => {
                const docs = groupedDocs[section.key];
                if (docs.length === 0) return null;
                return (
                  <div key={section.key}>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${section.bgColor}`}>
                      <span className={`text-sm font-semibold ${section.color}`}>{section.label}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${section.badgeColor}`}>{docs.length}</span>
                    </div>
                    <div className="space-y-2">
                      {docs.map((doc) => renderDocCard(doc, section.opacity))}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada dokumen ditemukan.</p>}
            </div>
          )}
        </div>

        {/* Right - Side Preview */}
        {previewDoc && (
          <div className="w-[400px] shrink-0 border-l border-border bg-card overflow-y-auto">
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base">{previewDoc.judul}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{previewDoc.nomorDokumen}</p>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-1 rounded hover:bg-muted shrink-0">
                  <X size={16} />
                </button>
              </div>

              <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                previewDoc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" :
                previewDoc.status === "Menunggu" ? "bg-sakura-warning/20 text-sakura-warning" :
                previewDoc.status === "Ditolak" ? "bg-destructive/20 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>{previewDoc.status}</span>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Kategori</div>
                  <div className="font-medium text-foreground">{previewDoc.kategori}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Jenis Dokumen</div>
                  <div className="font-medium text-foreground">{previewDoc.jenisDokumen}</div>
                </div>
                {previewDoc.kelas && previewDoc.kelas !== "-" && (
                  <div>
                    <div className="text-muted-foreground text-xs">Kelas</div>
                    <div className="font-medium text-foreground">{previewDoc.kelas}</div>
                  </div>
                )}
                {previewDoc.namaSiswa && (
                  <div>
                    <div className="text-muted-foreground text-xs">Nama Siswa</div>
                    <div className="font-medium text-foreground">{previewDoc.namaSiswa}</div>
                  </div>
                )}
                {previewDoc.tahunAjaran && (
                  <div>
                    <div className="text-muted-foreground text-xs">Tahun Ajaran</div>
                    <div className="font-medium text-foreground">{previewDoc.tahunAjaran}</div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground text-xs">Pengunggah</div>
                  <div className="font-medium text-foreground">{previewDoc.pengunggah.nama}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Upload</div>
                  <div className="font-medium text-foreground">{format(new Date(previewDoc.tanggalUpload), "dd/MM/yyyy")}</div>
                </div>
              </div>

              {previewDoc.catatan && (
                <div className="px-3 py-2 rounded-lg bg-sakura-warning/10 border border-sakura-warning/30 text-sm text-sakura-warning font-medium">
                  ⚠ {previewDoc.catatan}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPdfOverlay(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Eye size={16} /> Preview
                </button>
                <button
                  onClick={() => setDetailDoc(previewDoc)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  <FileIcon size={16} /> Detail
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-primary" />
                  <span className="font-semibold text-sm text-foreground">Jejak Aktivitas</span>
                </div>
                <div className="space-y-3">
                  {previewDoc.auditTrail.slice(0, 4).map((entry, i) => (
                    <div key={i} className="flex gap-2">
                      <img src={entry.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground">{entry.user.nama}</div>
                        <div className="text-xs text-foreground">{entry.action}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(entry.time), "dd/MM/yyyy HH:mm")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {detailDoc && <DocumentDetailModal document={detailDoc} onClose={() => setDetailDoc(null)} />}
      {showPdfOverlay && previewDoc && <PdfPreviewOverlay onClose={() => setShowPdfOverlay(false)} document={previewDoc} />}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowUploadModal(false)} />
          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Upload Dokumen</h2>
                <p className="text-sm text-muted-foreground">Form upload identik dengan halaman Upload Dokumen</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 rounded-lg hover:bg-muted"><X size={20} /></button>
            </div>
            <UploadForm
              onSuccess={() => setShowUploadModal(false)}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
