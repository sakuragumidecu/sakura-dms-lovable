import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { ShieldCheck, FileText, CheckCircle, Calendar, User, Hash, ArrowLeft } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const { documents } = useApp();
  const navigate = useNavigate();

  const doc = documents.find((d) => d.id === Number(id));

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <ShieldCheck size={64} className="mx-auto text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Dokumen Tidak Ditemukan</h1>
          <p className="text-muted-foreground">Dokumen dengan ID tersebut tidak terdaftar dalam sistem.</p>
          <button onClick={() => navigate("/")} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const isVerified = doc.status === "Disetujui" || doc.status === "Diarsipkan";
  const approvalEntry = doc.auditTrail.find((e) => e.action.startsWith("Menyetujui"));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img src={logoSakura} alt="SAKURA" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-bold text-lg">SAKURA</div>
            <div className="text-primary-foreground/70 text-xs">Verifikasi Dokumen</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Status Banner */}
        <div className={`p-6 rounded-xl border-2 text-center space-y-3 ${
          isVerified
            ? "bg-sakura-success/5 border-sakura-success/30"
            : "bg-destructive/5 border-destructive/30"
        }`}>
          {isVerified ? (
            <CheckCircle size={48} className="mx-auto text-sakura-success" />
          ) : (
            <ShieldCheck size={48} className="mx-auto text-destructive" />
          )}
          <h1 className="text-2xl font-bold text-foreground">
            {isVerified ? "Dokumen Terverifikasi" : "Dokumen Belum Terverifikasi"}
          </h1>
          <p className={`text-sm font-medium ${isVerified ? "text-sakura-success" : "text-destructive"}`}>
            Integrity Status: {isVerified ? "Valid" : "Pending"}
          </p>
        </div>

        {/* Document Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <FileText size={18} className="text-primary" /> Detail Dokumen
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs flex items-center gap-1"><Hash size={12} /> Document ID</div>
              <div className="font-medium text-foreground">{doc.id}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs flex items-center gap-1"><Hash size={12} /> Nomor Dokumen</div>
              <div className="font-medium text-foreground">{doc.nomorDokumen}</div>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <div className="text-muted-foreground text-xs flex items-center gap-1"><FileText size={12} /> Document Title</div>
              <div className="font-bold text-foreground text-lg">{doc.judul}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs">Status</div>
              <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                isVerified ? "bg-sakura-success/20 text-sakura-success" : "bg-sakura-warning/20 text-sakura-warning"
              }`}>
                {isVerified ? "Approved & Archived" : doc.status}
              </span>
            </div>
            {approvalEntry && (
              <>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={12} /> Approval Date</div>
                  <div className="font-medium text-foreground">{format(new Date(approvalEntry.time), "dd MMMM yyyy, HH:mm")}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><User size={12} /> Approved By</div>
                  <div className="font-medium text-foreground">{approvalEntry.user.nama}</div>
                </div>
              </>
            )}
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs">Kategori</div>
              <div className="font-medium text-foreground">{doc.kategori}</div>
            </div>
          </div>
        </div>

        {/* Document Preview (read-only watermarked) */}
        {isVerified && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-foreground">Preview Dokumen</h2>
            <div className="relative bg-muted/30 rounded-lg p-8 min-h-[300px] flex items-center justify-center overflow-hidden">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <div className="text-primary/10 text-6xl font-extrabold rotate-[-30deg] whitespace-nowrap">
                  VERIFIED ARCHIVE COPY
                </div>
              </div>
              <div className="text-center z-10 space-y-3">
                <FileText size={64} className="mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Preview dokumen dalam mode read-only</p>
                <p className="text-xs text-muted-foreground">File: {doc.judul}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Dokumen ini terdaftar di database SAKURA, telah melewati proses persetujuan, dan memiliki status arsip resmi.
            </p>
          </div>
        )}

        <div className="text-center">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            <ArrowLeft size={14} /> Kembali ke halaman utama
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">© 2026 SAKURA · SMP Negeri 4 Cikarang Barat</p>
      </div>
    </div>
  );
}
