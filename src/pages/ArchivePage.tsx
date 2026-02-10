import { useState, useMemo } from "react";
import { Search, RotateCcw, Folder, FolderOpen, Star, FileText as FileIcon, ChevronRight } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import { useApp } from "@/contexts/AppContext";
import { FOLDER_STRUCTURE } from "@/data/mockData";
import type { Document } from "@/data/mockData";

export default function ArchivePage() {
  const { documents, toggleFavorite } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["2025"]));
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let docs = documents;
    if (showFavorites) docs = docs.filter((d) => d.favorite);
    if (selectedFolder) docs = docs.filter((d) => d.kelas === selectedFolder || d.kategori === selectedFolder);
    if (statusFilter !== "Semua") docs = docs.filter((d) => d.status === statusFilter);
    if (categoryFilter !== "Semua") docs = docs.filter((d) => d.kategori === categoryFilter);
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter((d) => d.judul.toLowerCase().includes(q) || d.nomorDokumen.toLowerCase().includes(q) || d.pengunggah.nama.toLowerCase().includes(q));
    }
    return docs;
  }, [documents, search, statusFilter, categoryFilter, selectedFolder, showFavorites]);

  return (
    <>
      <AppHeader title="Arsip Dokumen" subtitle="SMP Negeri 4 Cikarang Barat" />
      <div className="flex flex-1 animate-fade-in">
        {/* Left - Folder tree */}
        <div className="w-64 shrink-0 border-r border-border bg-card p-4 space-y-1 overflow-y-auto">
          <h3 className="font-bold text-foreground text-sm mb-3">📁 Struktur Folder</h3>
          <button onClick={() => { setSelectedFolder(null); setShowFavorites(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedFolder && !showFavorites ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
            Semua Dokumen
          </button>
          <button onClick={() => { setShowFavorites(true); setSelectedFolder(null); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showFavorites ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
            <Star size={14} className="text-sakura-warning" /> Favorit
          </button>
          <div className="h-px bg-border my-2" />
          {FOLDER_STRUCTURE.map((folder) => (
            <div key={folder.name}>
              <button onClick={() => { toggleExpand(folder.name); if (folder.children.length === 0) { setSelectedFolder(folder.name); setShowFavorites(false); } }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground">
                {folder.children.length > 0 ? (
                  <ChevronRight size={14} className={`transition-transform ${expandedFolders.has(folder.name) ? "rotate-90" : ""}`} />
                ) : <span className="w-3.5" />}
                {expandedFolders.has(folder.name) ? <FolderOpen size={16} className="text-sakura-warning shrink-0" /> : <Folder size={16} className="text-muted-foreground shrink-0" />}
                {folder.name}
              </button>
              {expandedFolders.has(folder.name) && folder.children.map((child) => (
                <button key={child.name} onClick={() => { setSelectedFolder(child.name); setShowFavorites(false); }} className={`w-full text-left pl-10 pr-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFolder === child.name ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {child.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right - Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {showFavorites ? "⭐ Dokumen Favorit" : selectedFolder ? `📁 ${selectedFolder}` : "Semua Dokumen Arsip"}
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
              <option>Ijazah</option><option>Nilai</option><option>SK</option><option>Data Siswa</option><option>Laporan</option>
            </select>
            <button onClick={() => { setSearch(""); setStatusFilter("Semua"); setCategoryFilter("Semua"); }} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-input text-sm hover:bg-muted transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Results */}
          <div className="space-y-2">
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow transition text-left">
                <button onClick={() => toggleFavorite(doc.id)} className="shrink-0">
                  <Star size={18} className={doc.favorite ? "fill-sakura-warning text-sakura-warning" : "text-muted-foreground hover:text-sakura-warning"} />
                </button>
                <button onClick={() => setDetailDoc(doc)} className="flex items-center gap-4 flex-1 min-w-0 text-left">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <FileIcon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{doc.judul}</div>
                    <div className="text-xs text-muted-foreground">{doc.nomorDokumen} · {doc.kategori} · {doc.kelas}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" :
                    doc.status === "Menunggu" ? "bg-sakura-warning/20 text-sakura-warning" :
                    doc.status === "Ditolak" ? "bg-destructive/20 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>{doc.status}</span>
                </button>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada dokumen ditemukan.</p>}
          </div>
        </div>
      </div>
      {detailDoc && <DocumentDetailModal document={detailDoc} onClose={() => setDetailDoc(null)} />}
    </>
  );
}
