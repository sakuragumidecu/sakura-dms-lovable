import { X, Eye, Download, Clock, FileText, CheckCircle, XCircle, Archive } from "lucide-react";
import type { Document } from "@/data/mockData";
import { format } from "date-fns";
import { useState } from "react";
import PdfPreviewOverlay from "./PdfPreviewOverlay";
import { useApp } from "@/contexts/AppContext";

interface Props {
  document: Document;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  Menunggu: "bg-sakura-warning/20 text-sakura-warning",
  Disetujui: "bg-sakura-success/20 text-sakura-success",
  Ditolak: "bg-destructive/20 text-destructive",
  Diarsipkan: "bg-muted text-muted-foreground",
};

export default function DocumentDetailModal({ document: doc, onClose }: Props) {
  const [showPdf, setShowPdf] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const { addAuditNote, currentUser, hasPermission, approveDocument, rejectDocument, archiveDocument } = useApp();

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addAuditNote(doc.id, noteText.trim());
    setNoteText("");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectDocument(doc.id, rejectReason.trim());
    setShowRejectForm(false);
    setRejectReason("");
    onClose();
  };

  const handleApprove = () => {
    approveDocument(doc.id, approveComment.trim() || undefined);
    setShowApproveForm(false);
    setApproveComment("");
    onClose();
  };

  const handleArchive = () => {
    archiveDocument(doc.id);
    onClose();
  };

  const canApprove = hasPermission("documents.approve") && doc.status === "Menunggu";
  const canArchive = hasPermission("documents.archive") && doc.status === "Disetujui";
  const canAddNote = hasPermission("audit.addNote");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-card rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{doc.judul}</h2>
                <p className="text-sm text-muted-foreground">{doc.kategori} · {doc.kelas}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[doc.status]}`}>{doc.status}</span>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Nomor Dokumen", doc.nomorDokumen],
                ["Kategori", doc.kategori],
                ["Kelas / Unit", doc.kelas],
                ["Pengunggah", doc.pengunggah.nama],
                ["Tanggal Upload", format(new Date(doc.tanggalUpload), "yyyy-MM-dd HH:mm")],
                ["Tanggal Edit Terakhir", format(new Date(doc.tanggalEdit), "yyyy-MM-dd HH:mm")],
                ["Versi", `v${doc.versi}`],
                ["Status", doc.status],
                ...(doc.namaSiswa ? [["Nama Siswa", doc.namaSiswa]] : []),
                ...(doc.nisn ? [["NISN", doc.nisn]] : []),
                ...(doc.tahunAjaran ? [["Tahun Ajaran", doc.tahunAjaran]] : []),
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-muted-foreground text-xs">{label}</div>
                  <div className="font-medium text-foreground">{val}</div>
                </div>
              ))}
            </div>

            {doc.catatan && (
              <div className="px-3 py-2 rounded-lg bg-sakura-warning/10 border border-sakura-warning/30 text-sm text-sakura-warning font-medium">
                ⚠ {doc.catatan}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowPdf(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Eye size={16} /> Preview
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                <Download size={16} /> Download
              </button>
              {canApprove && (
                <>
                  <button onClick={() => setShowApproveForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sakura-success/20 text-sakura-success text-sm font-semibold hover:bg-sakura-success/30 transition-colors">
                    <CheckCircle size={16} /> Setujui
                  </button>
                  <button onClick={() => setShowRejectForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors">
                    <XCircle size={16} /> Tolak
                  </button>
                </>
              )}
              {canArchive && (
                <button onClick={handleArchive} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-semibold hover:bg-muted/80 transition-colors">
                  <Archive size={16} /> Arsipkan
                </button>
              )}
            </div>

            {/* Approve form */}
            {showApproveForm && (
              <div className="p-4 rounded-lg border border-sakura-success/30 bg-sakura-success/5 space-y-3">
                <h4 className="font-semibold text-sm text-sakura-success">Konfirmasi Persetujuan</h4>
                <textarea value={approveComment} onChange={(e) => setApproveComment(e.target.value)} placeholder="Komentar (opsional), misal: Dokumen sudah sesuai standar..." rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <div className="flex gap-2">
                  <button onClick={handleApprove} className="px-4 py-2 rounded-lg bg-sakura-success text-white text-sm font-semibold hover:opacity-90">Konfirmasi Setujui</button>
                  <button onClick={() => { setShowApproveForm(false); setApproveComment(""); }} className="px-4 py-2 rounded-lg border border-input text-sm">Batal</button>
                </div>
              </div>
            )}

            {/* Reject form */}
            {showRejectForm && (
              <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 space-y-3">
                <h4 className="font-semibold text-sm text-destructive">Alasan Penolakan</h4>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Masukkan alasan penolakan..." rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <div className="flex gap-2">
                  <button onClick={handleReject} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Tolak</button>
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 rounded-lg border border-input text-sm">Batal</button>
                </div>
              </div>
            )}

            {/* Audit Trail */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Jejak Aktivitas</h3>
                <span className="text-xs text-muted-foreground">(Read-only)</span>
              </div>
              <div className="space-y-4">
                {doc.auditTrail.map((entry, i) => (
                  <div key={i} className="flex gap-3 animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <img src={entry.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{entry.user.nama}</span>
                        <span className="text-xs text-muted-foreground">— {entry.user.role}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{format(new Date(entry.time), "yyyy-MM-dd HH:mm")}</span>
                      </div>
                      <div className={`text-sm mt-0.5 ${entry.action.startsWith("Catatan Admin") ? "text-accent font-medium italic" : "text-foreground"}`}>
                        {entry.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {canAddNote && (
                <div className="mt-4 flex gap-2">
                  <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Tambah catatan admin..." className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button onClick={handleAddNote} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Tambah</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPdf && <PdfPreviewOverlay onClose={() => setShowPdf(false)} document={doc} />}
    </>
  );
}
