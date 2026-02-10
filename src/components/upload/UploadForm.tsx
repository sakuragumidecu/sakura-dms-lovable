import { useState, useRef, useEffect } from "react";
import { Upload, Camera, X, Eye, FileText } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useSettings } from "@/contexts/SettingsContext";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const JENIS_OPTIONS = ["Ijazah", "Rapor", "Surat Keputusan", "Sertifikat", "Data Siswa", "Laporan Keuangan", "Lainnya"];
const KATEGORI_OPTIONS = ["Ijazah", "Nilai", "SK", "Data Siswa", "Laporan", "Sertifikat"];

interface UploadFormProps {
  targetFolder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UploadForm({ targetFolder, onSuccess, onCancel }: UploadFormProps) {
  const { uploadDocument, currentUser } = useApp();
  const { settings } = useSettings();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Parse targetFolder to pre-fill fields
  const parsedTahun = targetFolder?.split("/")[0] || "";
  const parsedKelas = targetFolder?.split("/")[1] || "";

  const [form, setForm] = useState({
    nomorDokumen: "",
    judul: "",
    jenisDokumen: "",
    kategori: "",
    kelas: parsedKelas,
    namaSiswa: "",
    nisn: "",
    tahunAjaran: parsedTahun || "2024/2025",
    catatan: "",
  });

  const [mappedFolder, setMappedFolder] = useState<string | null>(targetFolder || null);

  // Auto-map folder based on jenisDokumen when folderMapping is enabled
  useEffect(() => {
    if (targetFolder) return; // don't override explicit target
    if (!settings.folderMapping.enabled || !form.jenisDokumen) {
      setMappedFolder(null);
      return;
    }
    const mapping = settings.folderMapping.mappings.find((m) => m.jenisDokumen === form.jenisDokumen);
    if (mapping) {
      const folderPath = form.tahunAjaran
        ? `${form.tahunAjaran.split("/").pop()}/${mapping.targetFolder}`
        : mapping.targetFolder;
      setMappedFolder(folderPath);
    } else {
      setMappedFolder(null);
    }
  }, [form.jenisDokumen, form.tahunAjaran, settings.folderMapping, targetFolder]);

  const handleFile = (f: File) => {
    const maxSize = 10 * 1024 * 1024;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(f.type)) {
      toast({ title: "Format tidak didukung", description: "Hanya PDF, JPG, PNG yang diizinkan.", variant: "destructive" });
      return;
    }
    if (f.size > maxSize) {
      toast({ title: "Ukuran terlalu besar", description: "Maksimal 10MB per file.", variant: "destructive" });
      return;
    }
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

    toast({ title: "✓ Berhasil", description: "Dokumen berhasil diunggah dan masuk antrian persetujuan!" });

    setTimeout(() => {
      setFile(null);
      setFilePreview(null);
      setForm({ nomorDokumen: "", judul: "", jenisDokumen: "", kategori: "", kelas: parsedKelas, namaSiswa: "", nisn: "", tahunAjaran: parsedTahun || "2024/2025", catatan: "" });
      onSuccess?.();
    }, 1000);
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - File section */}
        <div className="space-y-6">
          {(targetFolder || mappedFolder) && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
              <span className="text-muted-foreground">Masukkan ke folder: </span>
              <span className="font-semibold text-primary">{targetFolder || mappedFolder}</span>
              <span className="text-muted-foreground">{!targetFolder && mappedFolder ? " (auto-mapping)" : " (direkomendasikan)"}</span>
            </div>
          )}
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
              <input value={form.kelas} onChange={(e) => update("kelas", e.target.value)} readOnly={!!targetFolder && currentUser.role !== "Admin/TU"} placeholder="Contoh: Kelas 7A / Alumni 2024" className={`w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring ${targetFolder && currentUser.role !== "Admin/TU" ? "bg-muted/50 text-muted-foreground" : "bg-background"}`} />
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
                <input value={form.tahunAjaran} onChange={(e) => update("tahunAjaran", e.target.value)} readOnly={!!targetFolder && currentUser.role !== "Admin/TU"} placeholder="2024/2025" className={`w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring ${targetFolder && currentUser.role !== "Admin/TU" ? "bg-muted/50 text-muted-foreground" : "bg-background"}`} />
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
            <div className="flex gap-3">
              {onCancel && (
                <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg border border-input text-sm font-semibold hover:bg-muted transition-colors">
                  Batal
                </button>
              )}
              <button type="submit" className={`${onCancel ? "flex-1" : "w-full"} flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity`}>
                <Upload size={18} /> Upload Dokumen
              </button>
            </div>
          </div>
        </div>
      </form>
      {showPdfPreview && <PdfPreviewOverlay onClose={() => setShowPdfPreview(false)} document={{
        id: 0, nomorDokumen: form.nomorDokumen || "DRAFT", judul: form.judul || "Dokumen Baru",
        kategori: form.kategori || "Umum", kelas: form.kelas || "-", jenisDokumen: form.jenisDokumen,
        namaSiswa: form.namaSiswa, nisn: form.nisn, tahunAjaran: form.tahunAjaran,
        pengunggah: { id: currentUser.id, nama: currentUser.nama, role: currentUser.role, avatar: currentUser.avatar },
        tanggalUpload: new Date().toISOString(), tanggalEdit: new Date().toISOString(),
        status: "Menunggu", versi: 1, fileUrl: "", auditTrail: [],
      }} />}
    </>
  );
}
