import { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, RotateCcw, Plus, Crop, Download, FileText, Image, ChevronLeft, ChevronRight, Trash2, Check } from "lucide-react";

export default function CameraScanModal({ onClose, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [step, setStep] = useState("camera");

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
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
    const newPage = { id: Date.now(), imageData };
    setPages((prev) => [...prev, newPage]);
    setCurrentPage(pages.length);
  };

  const handleCrop = () => {
    if (pages.length === 0) return;
    const page = pages[currentPage];
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
      setIsCropping(false);
    };
    img.src = page.imageData;
  };

  const deletePage = (index) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
    if (currentPage >= pages.length - 1) setCurrentPage(Math.max(0, pages.length - 2));
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

  const currentImage = pages[currentPage]?.cropped || pages[currentPage]?.imageData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Camera size={20} className="text-primary" />
            <div>
              <h2 className="font-bold text-foreground">Scan Dokumen</h2>
              <p className="text-xs text-muted-foreground">
                {step === "camera" ? "Ambil foto dokumen" : `${pages.length} halaman terscan`}
              </p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-1.5 rounded-lg hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === "camera" ? (
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

              <div className="flex items-center justify-center gap-4">
                <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
                  <Camera size={24} />
                </button>
              </div>

              {pages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{pages.length} halaman terscan</span>
                    <button onClick={() => { stopCamera(); setStep("review"); }} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
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
          ) : (
            <>
              {currentImage && (
                <div className="relative">
                  {isCropping ? (
                    <div className="relative">
                      <img src={pages[currentPage].imageData} alt="" className="w-full rounded-lg opacity-50" />
                      <div className="absolute border-2 border-primary bg-primary/10 rounded" style={{ left: `${cropArea.x}%`, top: `${cropArea.y}%`, width: `${cropArea.w}%`, height: `${cropArea.h}%` }} />
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {["x", "y", "w", "h"].map((key) => (
                          <div key={key}>
                            <label className="text-xs text-muted-foreground uppercase">{key}</label>
                            <input type="range" min={0} max={100} value={cropArea[key]} onChange={(e) => setCropArea((p) => ({ ...p, [key]: Number(e.target.value) }))} className="w-full" />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={handleCrop} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Terapkan Crop</button>
                        <button onClick={() => setIsCropping(false)} className="px-4 py-2 rounded-lg border border-input text-sm">Batal</button>
                      </div>
                    </div>
                  ) : (
                    <img src={currentImage} alt="" className="w-full rounded-lg" />
                  )}
                </div>
              )}

              {pages.length > 1 && !isCropping && (
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronLeft size={18} /></button>
                  <span className="text-sm text-foreground font-medium">{currentPage + 1} / {pages.length}</span>
                  <button onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))} disabled={currentPage === pages.length - 1} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
              )}

              {!isCropping && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setStep("camera"); startCamera(); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-sm hover:bg-muted"><Plus size={14} /> Tambah Halaman</button>
                  <button onClick={() => setIsCropping(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-sm hover:bg-muted"><Crop size={14} /> Crop</button>
                  <button onClick={() => deletePage(currentPage)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-sm hover:bg-destructive/10 text-destructive"><Trash2 size={14} /> Hapus</button>
                  <button onClick={() => { setPages([]); setStep("camera"); startCamera(); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-sm hover:bg-muted"><RotateCcw size={14} /> Ulang</button>
                </div>
              )}

              {!isCropping && pages.length > 0 && (
                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Format Output</h4>
                  <div className="flex gap-2">
                    {["pdf", "png", "jpg"].map((fmt) => (
                      <button key={fmt} onClick={() => setOutputFormat(fmt)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${outputFormat === fmt ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                        {fmt === "pdf" ? <FileText size={14} /> : <Image size={14} />}
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleConvert} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    <Download size={16} /> Convert & Gunakan untuk Upload
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
