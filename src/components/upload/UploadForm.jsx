import { useState, useRef, useEffect, useMemo } from "react";
import { Upload, Camera, X, Eye, FileText, CalendarIcon, ChevronDown, Maximize, ZoomIn, ZoomOut } from "lucide-react";
import CameraScanModal from "@/components/scan/CameraScanModal";
import { useApp } from "@/contexts/AppContext";
import { useSettings } from "@/contexts/SettingsContext";
import PdfPreviewOverlay from "@/components/modals/PdfPreviewOverlay";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, DOCUMENT_TYPES, KATEGORI_DETAIL_FIELDS, TAHUN_AJARAN_OPTIONS, buildFolderTree, flattenFolderPaths } from "@/data/mockData";
import { Calendar } from "@/components/ui/calendar";

export default function UploadForm({ targetFolder, onSuccess, onCancel }) {
  const { uploadDocument, currentUser, documents, generateDocumentNumber, getFolderForCategory } = useApp();
  const { settings } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCameraScan, setShowCameraScan] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [fullPreviewZoom, setFullPreviewZoom] = useState(100);
  const [showDetailFields, setShowDetailFields] = useState(false);
  const [customTahun, setCustomTahun] = useState("");
  const [detailData, setDetailData] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [detailData, setDetailData] = useState({});

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
    tanggalUpload: new Date(),
    folderTujuan: targetFolder || "",
  });

  const jenisOptions = useMemo(() => {
    if (!selectedCategoryId) return [];
    return DOCUMENT_TYPES.filter((t) => t.category_id === selectedCategoryId);
  }, [selectedCategoryId]);

  const detailFields = useMemo(() => {
    return KATEGORI_DETAIL_FIELDS[form.kategori] || [];
  }, [form.kategori]);

  const folderPaths = useMemo(() => {
    const tree = buildFolderTree(documents);
    return flattenFolderPaths(tree);
  }, [documents]);

  useEffect(() => {
    if (targetFolder) return;
    if (!settings.folderMapping.enabled || !form.jenisDokumen) return;
    const mapping = settings.folderMapping.mappings.find((m) => m.jenisDokumen === form.jenisDokumen);
    if (mapping) {
      const folderPath = form.tahunAjaran
        ? `${form.tahunAjaran.split("/").pop()}/${mapping.targetFolder}`
        : mapping.targetFolder;
      setForm((p) => ({ ...p, folderTujuan: folderPath }));
    }
  }, [form.jenisDokumen, form.tahunAjaran, settings.folderMapping, targetFolder]);

  const handleFile = (f) => {
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
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.judul) return;
    setShowConfirm(true);
  };

  const confirmUpload = () => {
    const jenis = form.jenisDokumen === "Lainnya" ? customJenis : form.jenisDokumen;
    const tahun = form.tahunAjaran === "Lainnya" ? customTahun : form.tahunAjaran;
    const kategori = form.kategori === "Lainnya" ? customKategori : form.kategori;

    uploadDocument({
      nomorDokumen: form.nomorDokumen || `DOC-${Date.now()}`,
      judul: form.judul,
      kategori: kategori || "Lainnya",
      kelas: form.kelas || "-",
      jenisDokumen: jenis,
      namaSiswa: form.namaSiswa,
      nisn: form.nisn,
      tahunAjaran: tahun,
      pengunggah: { id: currentUser.id, nama: currentUser.nama, role: currentUser.role, avatar: currentUser.avatar },
      tanggalUpload: form.tanggalUpload.toISOString(),
      fileUrl: filePreview || "/mock/sample.pdf",
      catatan: form.catatan || undefined,
      folderTujuan: form.folderTujuan || undefined,
    });

    setShowConfirm(false);
    toast({
      title: "✓ Dokumen Berhasil Diunggah",
      description: (
        <div className="flex flex-col gap-2">
          <span>Dokumen masuk antrian persetujuan.</span>
          <button onClick={() => navigate("/archive")} className="text-xs text-primary font-semibold hover:underline text-left">
            → Lihat di Arsip Dokumen
          </button>
        </div>
      ),
    });

    setTimeout(() => {
      setFile(null);
      setFilePreview(null);
      setDetailData({});
      setForm({ nomorDokumen: "", judul: "", jenisDokumen: "", kategori: "", kelas: parsedKelas, namaSiswa: "", nisn: "", tahunAjaran: parsedTahun || "2024/2025", catatan: "", tanggalUpload: new Date(), folderTujuan: targetFolder || "" });
      onSuccess?.();
    }, 1000);
  };

  const handleScanCamera = () => {
    setShowCameraScan(true);
  };

  const handleScanComplete = (scannedFile) => {
    handleFile(scannedFile);
    setShowCameraScan(false);
  };

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {(targetFolder || form.folderTujuan) && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
              <span className="text-muted-foreground">Masukkan ke folder: </span>
              <span className="font-semibold text-primary">{targetFolder || form.folderTujuan}</span>
              <span className="text-muted-foreground">{!targetFolder && form.folderTujuan ? " (auto-mapping)" : ""}</span>
            </div>
          )}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><FileText size={18} className="text-primary" /> File Dokumen</h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center cursor-pointer transition-colors ${isDragOver ? "border-primary bg-secondary/50" : "border-input hover:border-primary/50"}`}
            >
              <Upload size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-foreground">Seret file ke sini atau <span className="text-primary font-semibold">klik untuk memilih</span></p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (maks. 10MB)</p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            <button type="button" onClick={handleScanCamera} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-colors">
              <Camera size={18} /> Scan via Kamera
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

          {(file || filePreview) && (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Eye size={18} className="text-primary" /> Pratinjau File</h3>
              {filePreview ? (
                <div className="relative group">
                  <img src={filePreview} alt="Preview" className="w-full rounded-lg max-h-64 object-contain bg-muted/30" />
                  <button type="button" onClick={() => setShowFullPreview(true)} className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors rounded-lg">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-lg bg-card/90 text-foreground text-sm font-medium shadow-lg">
                      <Maximize size={16} /> Lihat Full Screen
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8">
                  <FileText size={48} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{file?.name}</p>
                  <button type="button" onClick={() => setShowPdfPreview(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Preview PDF</button>
                </div>
              )}
            </div>
          )}

          {showFullPreview && filePreview && (
            <div className="fixed inset-0 z-[100] bg-foreground/90 flex flex-col animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
                <span className="font-semibold text-sm text-foreground truncate max-w-md">{file?.name}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setFullPreviewZoom((z) => Math.max(25, z - 25))} className="p-2 rounded hover:bg-muted"><ZoomOut size={18} /></button>
                  <span className="text-sm text-muted-foreground w-12 text-center">{fullPreviewZoom}%</span>
                  <button type="button" onClick={() => setFullPreviewZoom((z) => Math.min(300, z + 25))} className="p-2 rounded hover:bg-muted"><ZoomIn size={18} /></button>
                  <button type="button" onClick={() => setFullPreviewZoom(100)} className="p-2 rounded hover:bg-muted"><Maximize size={18} /></button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <button type="button" onClick={() => { setShowFullPreview(false); setFullPreviewZoom(100); }} className="p-2 rounded hover:bg-destructive/10 text-destructive"><X size={20} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-8" onClick={() => { setShowFullPreview(false); setFullPreviewZoom(100); }}>
                <img src={filePreview} alt="Full preview" className="rounded-lg shadow-2xl transition-transform" style={{ transform: `scale(${fullPreviewZoom / 100})`, maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
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
              <label className="block text-sm font-medium text-foreground mb-1">Kategori Dokumen *</label>
              <select required value={form.kategori} onChange={(e) => { update("kategori", e.target.value); update("jenisDokumen", ""); setCustomKategori(""); }} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Pilih kategori</option>
                {KATEGORI_OPTIONS.map((k) => <option key={k}>{k}</option>)}
              </select>
              {form.kategori === "Lainnya" && (
                <input value={customKategori} onChange={(e) => setCustomKategori(e.target.value)} placeholder="Ketik nama kategori..." className="w-full mt-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Jenis Dokumen *</label>
              <select required value={form.jenisDokumen} onChange={(e) => update("jenisDokumen", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" disabled={!form.kategori}>
                <option value="">{form.kategori ? "Pilih jenis dokumen" : "Pilih kategori dulu"}</option>
                {jenisOptions.map((j) => <option key={j}>{j}</option>)}
                <option value="Lainnya">Lainnya</option>
              </select>
              {form.jenisDokumen === "Lainnya" && (
                <input value={customJenis} onChange={(e) => setCustomJenis(e.target.value)} placeholder="Ketik jenis dokumen..." className="w-full mt-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Masukkan ke Folder</label>
              <select value={form.folderTujuan} onChange={(e) => update("folderTujuan", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Auto-mapping</option>
                {folderPaths.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Kelas</label>
              <input value={form.kelas} onChange={(e) => update("kelas", e.target.value)} readOnly={!!targetFolder && currentUser.role !== "Operator/TU"} placeholder="Contoh: Kelas 7A / Alumni 2024" className={`w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring ${targetFolder && currentUser.role !== "Operator/TU" ? "bg-muted/50 text-muted-foreground" : "bg-background"}`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Siswa</label>
                <input value={form.namaSiswa} onChange={(e) => update("namaSiswa", e.target.value)} placeholder="Nama lengkap" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">NISN</label>
                <input value={form.nisn} onChange={(e) => update("nisn", e.target.value)} placeholder="00xxxxxxxx" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tahun Ajaran</label>
                <select value={form.tahunAjaran} onChange={(e) => update("tahunAjaran", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {TAHUN_AJARAN_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  <option value="Lainnya">Lainnya</option>
                </select>
                {form.tahunAjaran === "Lainnya" && (
                  <input value={customTahun} onChange={(e) => setCustomTahun(e.target.value)} placeholder="Contoh: 2026/2027" className="w-full mt-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tanggal Upload</label>
                <div className="relative">
                  <input readOnly value={format(form.tanggalUpload, "dd/MM/yyyy")} onClick={() => setShowDatePicker(!showDatePicker)} className="w-full px-3 py-2.5 pr-10 rounded-lg border border-input bg-background text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button type="button" onClick={() => setShowDatePicker(!showDatePicker)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><CalendarIcon size={16} /></button>
                  {showDatePicker && (
                    <div className="absolute z-50 top-full mt-1 right-0 bg-card border border-border rounded-xl shadow-lg">
                      <Calendar mode="single" selected={form.tanggalUpload} onSelect={(d) => { if (d) { setForm((p) => ({ ...p, tanggalUpload: d })); setShowDatePicker(false); } }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Catatan (opsional)</label>
              <textarea value={form.catatan} onChange={(e) => update("catatan", e.target.value)} placeholder="Catatan tambahan jika ada" rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            {detailFields.length > 0 && (
              <div>
                <button type="button" onClick={() => setShowDetailFields(!showDetailFields)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ChevronDown size={14} className={`transition-transform ${showDetailFields ? "rotate-180" : ""}`} />
                  Tambah Data Detail (Opsional)
                </button>
                {showDetailFields && (
                  <div className="mt-3 space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    {detailFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-foreground mb-1">{field.label}</label>
                        <input value={detailData[field.key] || ""} onChange={(e) => setDetailData((p) => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {onCancel && (
                <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg border border-input text-sm font-semibold hover:bg-muted transition-colors">Batal</button>
              )}
              <button type="submit" className={`${onCancel ? "flex-1" : "w-full"} flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity`}>
                <Upload size={18} /> Upload Dokumen
              </button>
            </div>
          </div>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground text-lg mb-2">Konfirmasi Upload</h3>
            <p className="text-sm text-muted-foreground mb-4">Apakah Anda yakin semua data dokumen sudah benar? Dokumen akan masuk antrian persetujuan setelah diunggah.</p>
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm space-y-1 mb-4">
              <div><span className="text-muted-foreground">Nama:</span> <span className="font-medium text-foreground">{form.judul}</span></div>
              <div><span className="text-muted-foreground">Kategori:</span> <span className="font-medium text-foreground">{form.kategori === "Lainnya" ? customKategori : form.kategori}</span></div>
              <div><span className="text-muted-foreground">Jenis:</span> <span className="font-medium text-foreground">{form.jenisDokumen === "Lainnya" ? customJenis : form.jenisDokumen}</span></div>
              {file && <div><span className="text-muted-foreground">File:</span> <span className="font-medium text-foreground">{file.name}</span></div>}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-muted">Periksa Lagi</button>
              <button onClick={confirmUpload} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Ya, Upload Sekarang</button>
            </div>
          </div>
        </div>
      )}

      {showPdfPreview && <PdfPreviewOverlay onClose={() => setShowPdfPreview(false)} document={{
        id: 0, nomorDokumen: form.nomorDokumen || "DRAFT", judul: form.judul || "Dokumen Baru",
        kategori: form.kategori || "Umum", kelas: form.kelas || "-", jenisDokumen: form.jenisDokumen,
        namaSiswa: form.namaSiswa, nisn: form.nisn, tahunAjaran: form.tahunAjaran,
        pengunggah: { id: currentUser.id, nama: currentUser.nama, role: currentUser.role, avatar: currentUser.avatar },
        tanggalUpload: new Date().toISOString(), tanggalEdit: new Date().toISOString(),
        status: "Menunggu", versi: 1, fileUrl: "", auditTrail: [],
      }} />}
      {showCameraScan && <CameraScanModal onClose={() => setShowCameraScan(false)} onComplete={handleScanComplete} />}
    </>
  );
}
