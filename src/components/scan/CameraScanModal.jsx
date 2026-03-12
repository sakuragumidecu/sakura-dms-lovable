import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, RotateCcw, Plus, Crop, Download, FileText, Image, Trash2, Check, Pencil } from "lucide-react";
import CropOverlay from "./CropOverlay";

export default function CameraScanModal({ onClose, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [pages, setPages] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [step, setStep] = useState("camera"); // camera | crop | review
  const [cropPageIndex, setCropPageIndex] = useState(0);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, w: 80, h: 80 });

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraActive(true);
    } catch {
      alert("Kamera tidak tersedia pada perangkat ini.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsCameraActive(false);
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.92);
    setPages((prev) => [...prev, { id: Date.now(), imageData }]);
  };

  const applyCrop = () => {
    const page = pages[cropPageIndex];
    if (!page) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const sx = (cropArea.x / 100) * img.width;
      const sy = (cropArea.y / 100) * img.height;
      const sw = (cropArea.w / 100) * img.width;
      const sh = (cropArea.h / 100) * img.height;
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const cropped = canvas.toDataURL("image/jpeg", 0.92);
      setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, cropped } : p)));
      setStep("review");
    };
    img.src = page.imageData;
  };

  const deletePage = (index) => {
    setPages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setStep("camera");
        startCamera();
      }
      return next;
    });
  };

  const openCrop = (index) => {
    setCropPageIndex(index);
    setCropArea({ x: 10, y: 10, w: 80, h: 80 });
    setStep("crop");
  };

  const handleConvert = () => {
    if (pages.length === 0) return;
    const page = pages[0];
    const data = page.cropped || page.imageData;
    const byteString = atob(data.split(",")[1]);
    const mimeType = outputFormat === "png" ? "image/png" : outputFormat === "jpg" ? "image/jpeg" : "application/pdf";
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const ext = outputFormat === "pdf" ? "pdf" : outputFormat;
    const blob = new Blob([ab], { type: outputFormat === "pdf" ? "image/jpeg" : mimeType });
    const file = new File([blob], `scan-${Date.now()}.${ext}`, { type: mimeType });
    onComplete(file);
  };

  // ===== CAMERA STEP =====
  const renderCamera = () => (
    <>
      <div className="relative bg-foreground/5 rounded-xl overflow-hidden aspect-[4/3]">
        {isCameraActive ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Memulai kamera...</p>
          </div>
        )}
        <div className="absolute inset-4 border-2 border-dashed border-primary/40 rounded-lg pointer-events-none" />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
          <Camera size={24} />
        </button>
      </div>
      {pages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{pages.length} halaman terscan</span>
            <button onClick={() => { stopCamera(); setStep("review"); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Check size={14} /> Selesai Scan
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pages.map((page, i) => (
              <div key={page.id} className="relative shrink-0">
                <img src={page.cropped || page.imageData} alt={`Page ${i + 1}`} className="w-20 h-28 object-cover rounded-lg border border-border" />
                <span className="absolute bottom-1 left-1 text-xs bg-foreground/70 text-background px-1.5 py-0.5 rounded font-medium">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // ===== CROP STEP =====
  const renderCrop = () => {
    const page = pages[cropPageIndex];
    if (!page) return null;
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Seret sudut kotak untuk memilih area crop pada halaman {cropPageIndex + 1}
        </div>
        <CropOverlay imageUrl={page.imageData} cropArea={cropArea} onChange={setCropArea} />
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: "x", label: "X" },
            { key: "y", label: "Y" },
            { key: "w", label: "W" },
            { key: "h", label: "H" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <input
                type="range" min={0} max={100}
                value={cropArea[key]}
                onChange={(e) => setCropArea((p) => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full accent-primary h-1.5"
              />
              <span className="text-xs text-muted-foreground text-center block">{Math.round(cropArea[key])}%</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={applyCrop} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
            <Check size={14} className="inline mr-1.5" /> Terapkan Crop
          </button>
          <button onClick={() => setStep("review")} className="px-4 py-2.5 rounded-lg border border-input text-sm font-medium hover:bg-muted">
            Batal
          </button>
        </div>
      </div>
    );
  };

  // ===== REVIEW STEP (print-preview style) =====
  const renderReview = () => (
    <div className="flex flex-col sm:flex-row gap-4 min-h-0">
      {/* Left: scrollable page previews */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
        {pages.map((page, i) => (
          <div key={page.id} className="relative group">
            <div className="bg-background border border-border rounded-lg shadow-sm overflow-hidden">
              <img
                src={page.cropped || page.imageData}
                alt={`Halaman ${i + 1}`}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Page number & per-page controls */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-muted-foreground">Halaman {i + 1}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openCrop(i)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-input hover:bg-muted transition-colors"
                >
                  <Crop size={12} /> Crop
                </button>
                <button
                  onClick={() => deletePage(i)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: settings panel */}
      <div className="sm:w-52 shrink-0 space-y-4">
        <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Disimpan sebagai</h4>
          <div className="flex flex-row sm:flex-col gap-2">
            {["pdf", "png", "jpg"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors w-full justify-center sm:justify-start ${
                  outputFormat === fmt
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                {fmt === "pdf" ? <FileText size={14} /> : <Image size={14} />}
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Opsi</h4>
          <button
            onClick={() => { setStep("camera"); startCamera(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-xs hover:bg-muted w-full"
          >
            <Plus size={12} /> Tambah Halaman
          </button>
          <button
            onClick={() => { setPages([]); setStep("camera"); startCamera(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-xs hover:bg-muted w-full"
          >
            <RotateCcw size={12} /> Ulang Semua
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Download size={16} /> Convert & Upload
        </button>
      </div>
    </div>
  );

  const subtitle = step === "camera"
    ? "Ambil foto dokumen"
    : step === "crop"
    ? `Crop halaman ${cropPageIndex + 1}`
    : `${pages.length} halaman terscan`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Camera size={20} className="text-primary" />
            <div>
              <h2 className="font-bold text-foreground text-sm sm:text-base">Scan Dokumen</h2>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {step === "camera" && renderCamera()}
          {step === "crop" && renderCrop()}
          {step === "review" && renderReview()}
        </div>
      </div>
    </div>
  );
}
