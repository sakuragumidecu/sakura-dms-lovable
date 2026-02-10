import { useState, useRef } from "react";
import { Upload, Camera, X, Eye, FileText } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { useApp } from "@/contexts/AppContext";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import { format } from "date-fns";

const JENIS_OPTIONS = ["Ijazah", "Rapor", "Surat Keputusan", "Sertifikat", "Data Siswa", "Laporan Keuangan", "Lainnya"];
const KATEGORI_OPTIONS = ["Ijazah", "Nilai", "SK", "Data Siswa", "Laporan", "Sertifikat"];

export default function UploadPage() {
  const { uploadDocument, currentUser } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nomorDokumen: "",
    judul: "",
    jenisDokumen: "",
    kategori: "",
    kelas: "",
    namaSiswa: "",
    nisn: "",
    tahunAjaran: "2024/2025",
    catatan: "",
  });

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul) return;

    uploadDocument({
      nomorDokumen: form.nomorDokumen || `DOC-${Date.now()}`,
      judul: form.judul,
      kategori: form.kategori || "Lainnya",
      kelas: form.kelas || "-",
      jenisDokumen: form.jenisDokumen,
      namaSiswa: form.namaSiswa,
      nisn: form.nisn,
      tahunAjaran: form.tahunAjaran,
      pengunggah: { id: currentUser.id, nama: currentUser.nama, role: currentUser.role, avatar: currentUser.avatar },
      tanggalUpload: new Date().toISOString(),
      fileUrl: "/mock/sample.pdf",
      catatan: form.catatan || undefined,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFile(null);
      setFilePreview(null);
      setForm({ nomorDokumen: "", judul: "", jenisDokumen: "", kategori: "", kelas: "", namaSiswa: "", nisn: "", tahunAjaran: "2024/2025", catatan: "" });
    }, 2000);
  };

  const handleScanCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      alert("Simulasi: Kamera terbuka. Pada implementasi nyata, ini akan menangkap gambar dokumen.");
    } catch {
      alert("Kamera tidak tersedia pada perangkat ini.");
    }
  };

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <>
      <AppHeader title="Upload Dokumen" subtitle="Unggah dokumen untuk diproses dan diarsipkan" />
      <div className="p-8 animate-fade-in">
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-sakura-success/10 border border-sakura-success/30 text-sakura-success font-semibold text-sm">
            ✓ Dokumen berhasil diunggah dan masuk antrian persetujuan!
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - File section */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><FileText size={18} className="text-primary" /> File Dokumen</h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragOver ? "border-primary bg-secondary/50" : "border-input hover:border-primary/50"}`}
              >
                <Upload size={40} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-foreground">Seret file ke sini atau <span className="text-primary font-semibold">klik untuk memilih</span></p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (maks. 10MB)</p>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <button type="button" onClick={handleScanCamera} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-colors">
                <Camera size={18} /> Scan via Kamera (Simulasi)
              </button>

              {file && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <FileText size={20} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="p-1 hover:bg-muted rounded"><X size={16} /></button>
                </div>
              )}
            </div>

            {/* Preview */}
            {(file || filePreview) && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Eye size={18} className="text-primary" /> Pratinjau File</h3>
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-full rounded-lg max-h-64 object-contain bg-muted/30" />
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <FileText size={48} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{file?.name}</p>
                    <button type="button" onClick={() => setShowPdfPreview(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                      Preview PDF
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Metadata */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-4">Data Dokumen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nomor Dokumen</label>
                <input value={form.nomorDokumen} onChange={(e) => update("nomorDokumen", e.target.value)} placeholder="Contoh: IJZ/2024/001" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Dokumen *</label>
                <input required value={form.judul} onChange={(e) => update("judul", e.target.value)} placeholder="Contoh: Ijazah SMP" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Jenis Dokumen *</label>
                <select required value={form.jenisDokumen} onChange={(e) => update("jenisDokumen", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Pilih jenis dokumen</option>
                  {JENIS_OPTIONS.map((j) => <option key={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kategori</label>
                <select value={form.kategori} onChange={(e) => update("kategori", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Pilih kategori</option>
                  {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kelas</label>
                <input value={form.kelas} onChange={(e) => update("kelas", e.target.value)} placeholder="Contoh: Kelas 7A / Alumni 2024" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nama Siswa *</label>
                  <input value={form.namaSiswa} onChange={(e) => update("namaSiswa", e.target.value)} placeholder="Nama lengkap" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">NISN *</label>
                  <input value={form.nisn} onChange={(e) => update("nisn", e.target.value)} placeholder="00xxxxxxxx" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tahun Ajaran *</label>
                  <input value={form.tahunAjaran} onChange={(e) => update("tahunAjaran", e.target.value)} placeholder="2024/2025" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tanggal Upload</label>
                  <input readOnly value={format(new Date(), "dd/MM/yyyy")} className="w-full px-3 py-2.5 rounded-lg border border-input bg-muted/50 text-muted-foreground text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Catatan (opsional)</label>
                <textarea value={form.catatan} onChange={(e) => update("catatan", e.target.value)} placeholder="Catatan tambahan jika ada" rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                <Upload size={18} /> Upload Dokumen
              </button>
            </div>
          </div>
        </form>
      </div>
      {showPdfPreview && <PdfPreviewOverlay onClose={() => setShowPdfPreview(false)} fileName={form.judul || "Dokumen"} />}
    </>
  );
}
