import { useState } from "react";
import { CheckCircle, XCircle, Clock, Eye, FileText, ArrowRight } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp } from "@/contexts/AppContext";
import DocumentDetailModal from "@/components/modals/DocumentDetailModal";
import type { Document } from "@/data/mockData";

const STEPS = [
  { label: "Staff / Guru Upload", icon: FileText },
  { label: "Antrian Persetujuan", icon: Clock },
  { label: "Review Kepala Sekolah", icon: Eye },
  { label: "Disetujui / Ditolak", icon: CheckCircle },
];

export default function ApprovalPage() {
  const { documents, currentUser, hasPermission, approveDocument, rejectDocument } = useApp();
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const canApprove = hasPermission("documents.approve");
  const pendingDocs = documents.filter((d) => d.status === "Menunggu");
  const recentDecisions = documents.filter((d) => d.status === "Disetujui" || d.status === "Ditolak").slice(0, 5);

  const handleReject = (docId: number) => {
    if (!rejectReason.trim()) return;
    rejectDocument(docId, rejectReason.trim());
    setRejectId(null);
    setRejectReason("");
  };

  return (
    <>
      <AppHeader title="Alur Persetujuan" subtitle="Workflow persetujuan dokumen" />
      <div className="p-8 space-y-6 animate-fade-in">
        {/* Workflow visual */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-4">Alur Persetujuan Dokumen</h3>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? "bg-primary text-primary-foreground" : i === STEPS.length - 1 ? "bg-sakura-success/20 text-sakura-success" : "bg-secondary text-primary"}`}>
                    <step.icon size={22} />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center max-w-[100px]">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && <ArrowRight size={20} className="text-muted-foreground shrink-0 mt-[-20px]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Pending queue */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-sakura-warning" />
            <h3 className="font-bold text-foreground">Antrian Persetujuan</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sakura-warning/20 text-sakura-warning font-semibold">{pendingDocs.length}</span>
          </div>
          {pendingDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Tidak ada dokumen yang menunggu persetujuan.</p>
          ) : (
            <div className="space-y-3">
              {pendingDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sakura-warning/10 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-sakura-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => setDetailDoc(doc)} className="font-semibold text-sm text-foreground hover:text-primary truncate block text-left">
                      {doc.judul}
                    </button>
                    <div className="text-xs text-muted-foreground">{doc.nomorDokumen} · Diunggah oleh {doc.pengunggah.nama}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setDetailDoc(doc)} className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-muted transition-colors">
                      <Eye size={14} className="inline mr-1" /> Lihat
                    </button>
                    {canApprove && (
                      <>
                        <button onClick={() => approveDocument(doc.id)} className="px-3 py-1.5 rounded-lg bg-sakura-success/20 text-sakura-success text-xs font-semibold hover:bg-sakura-success/30 transition-colors">
                          <CheckCircle size={14} className="inline mr-1" /> Setujui
                        </button>
                        <button onClick={() => setRejectId(doc.id)} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                          <XCircle size={14} className="inline mr-1" /> Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reject reason modal */}
        {rejectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setRejectId(null)}>
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-foreground mb-3">Alasan Penolakan</h3>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Masukkan alasan penolakan dokumen..." rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setRejectId(null)} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Batal</button>
                <button onClick={() => handleReject(rejectId)} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Tolak Dokumen</button>
              </div>
            </div>
          </div>
        )}

        {/* Recent decisions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-4">Keputusan Terbaru</h3>
          {recentDecisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada keputusan.</p>
          ) : (
            <div className="space-y-2">
              {recentDecisions.map((doc) => (
                <button key={doc.id} onClick={() => setDetailDoc(doc)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" : "bg-destructive/20 text-destructive"}`}>
                    {doc.status === "Disetujui" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{doc.judul}</div>
                    <div className="text-xs text-muted-foreground">{doc.nomorDokumen}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${doc.status === "Disetujui" ? "bg-sakura-success/20 text-sakura-success" : "bg-destructive/20 text-destructive"}`}>
                    {doc.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {detailDoc && <DocumentDetailModal document={detailDoc} onClose={() => setDetailDoc(null)} />}
    </>
  );
}
