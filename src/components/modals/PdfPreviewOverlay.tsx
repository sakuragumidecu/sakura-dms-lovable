import { X, Download, Printer, ZoomIn, ZoomOut, Maximize, Shield, FileText } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import type { Document } from "@/data/mockData";

interface Props {
  onClose: () => void;
  document: Document;
  mode?: "master" | "distributed";
  isAdmin?: boolean;
}

function buildDocumentHtml(doc: Document, mode: "master" | "distributed"): string {
  const siswa = doc.namaSiswa || "—";
  const nisn = doc.nisn || "—";
  const tahun = doc.tahunAjaran || "—";
  const kategori = doc.kategori || "Dokumen";
  const kelas = doc.kelas || "—";
  const nomor = doc.nomorDokumen || "—";
  const jenis = doc.jenisDokumen || kategori;

  const isNilai = kategori === "Nilai";
  const nilaiRows = isNilai
    ? `
      <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:13px;">
        <thead>
          <tr style="background:#f0f4f8;">
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;">No</th>
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;">Mata Pelajaran</th>
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:center;">Nilai</th>
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:center;">Predikat</th>
          </tr>
        </thead>
        <tbody>
          ${[
            ["1", "Bahasa Indonesia", "85", "B+"],
            ["2", "Matematika", "78", "B"],
            ["3", "IPA", "82", "B+"],
            ["4", "IPS", "88", "A-"],
            ["5", "Bahasa Inggris", "90", "A"],
            ["6", "Pendidikan Agama", "87", "A-"],
            ["7", "PPKN", "80", "B+"],
            ["8", "Seni Budaya", "84", "B+"],
          ]
            .map(
              ([no, mp, nilai, pred]) =>
                `<tr><td style="border:1px solid #cbd5e1;padding:6px 12px;">${no}</td><td style="border:1px solid #cbd5e1;padding:6px 12px;">${mp}</td><td style="border:1px solid #cbd5e1;padding:6px 12px;text-align:center;">${nilai}</td><td style="border:1px solid #cbd5e1;padding:6px 12px;text-align:center;">${pred}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>`
    : "";

  const isApproved = doc.status === "Disetujui" || doc.status === "Diarsipkan";
  const verifyUrl = `${window.location.origin}/verify/${doc.id}`;

  // QR section only for distributed copy of approved documents
  const qrSection = (mode === "distributed" && isApproved)
    ? `
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;display:flex;align-items:center;gap:16px;">
      <div style="flex-shrink:0;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
          <rect width="100" height="100" fill="white" stroke="#e2e8f0" stroke-width="2" rx="4"/>
          <rect x="10" y="10" width="24" height="24" fill="#1e293b" rx="2"/>
          <rect x="14" y="14" width="16" height="16" fill="white" rx="1"/>
          <rect x="18" y="18" width="8" height="8" fill="#1e293b" rx="1"/>
          <rect x="66" y="10" width="24" height="24" fill="#1e293b" rx="2"/>
          <rect x="70" y="14" width="16" height="16" fill="white" rx="1"/>
          <rect x="74" y="18" width="8" height="8" fill="#1e293b" rx="1"/>
          <rect x="10" y="66" width="24" height="24" fill="#1e293b" rx="2"/>
          <rect x="14" y="70" width="16" height="16" fill="white" rx="1"/>
          <rect x="18" y="74" width="8" height="8" fill="#1e293b" rx="1"/>
          <rect x="40" y="10" width="6" height="6" fill="#1e293b"/>
          <rect x="50" y="14" width="6" height="6" fill="#1e293b"/>
          <rect x="40" y="24" width="6" height="6" fill="#1e293b"/>
          <rect x="10" y="40" width="6" height="6" fill="#1e293b"/>
          <rect x="20" y="46" width="6" height="6" fill="#1e293b"/>
          <rect x="40" y="40" width="6" height="6" fill="#1e293b"/>
          <rect x="50" y="46" width="6" height="6" fill="#1e293b"/>
          <rect x="60" y="40" width="6" height="6" fill="#1e293b"/>
          <rect x="46" y="54" width="6" height="6" fill="#1e293b"/>
          <rect x="70" y="46" width="6" height="6" fill="#1e293b"/>
          <rect x="80" y="50" width="6" height="6" fill="#1e293b"/>
          <rect x="46" y="66" width="6" height="6" fill="#1e293b"/>
          <rect x="56" y="72" width="6" height="6" fill="#1e293b"/>
          <rect x="66" y="66" width="6" height="6" fill="#1e293b"/>
          <rect x="80" y="76" width="6" height="6" fill="#1e293b"/>
          <rect x="70" y="82" width="6" height="6" fill="#1e293b"/>
          <rect x="82" y="86" width="6" height="6" fill="#1e293b"/>
        </svg>
      </div>
      <div style="font-size:11px;color:#64748b;line-height:1.6;">
        <div style="font-weight:bold;color:#1e293b;font-size:12px;margin-bottom:4px;">QR Verifikasi Dokumen</div>
        <div>Scan QR code atau kunjungi:</div>
        <div style="color:#2563eb;word-break:break-all;">${verifyUrl}</div>
        <div style="margin-top:4px;">Status: <span style="color:#16a34a;font-weight:bold;">${doc.status}</span></div>
        <div>ID: ${doc.nomorDokumen}</div>
      </div>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Times New Roman', serif; color:#1e293b; padding:48px 56px; background:#fff; }
  .kop { text-align:center; border-bottom:3px double #1e293b; padding-bottom:16px; margin-bottom:24px; }
  .kop h1 { font-size:14px; letter-spacing:2px; text-transform:uppercase; color:#64748b; margin-bottom:2px; }
  .kop h2 { font-size:22px; font-weight:bold; }
  .kop h3 { font-size:13px; font-weight:normal; color:#64748b; }
  .kop p { font-size:11px; color:#94a3b8; margin-top:4px; }
  .meta { margin:20px 0; font-size:13px; }
  .meta td { padding:3px 12px 3px 0; vertical-align:top; }
  .meta td:first-child { font-weight:bold; width:160px; }
  .title-doc { text-align:center; font-size:16px; font-weight:bold; margin:28px 0 8px; text-decoration:underline; }
  .subtitle { text-align:center; font-size:13px; color:#64748b; margin-bottom:20px; }
  .content { font-size:13px; line-height:1.8; margin:16px 0; }
  .ttd { display:flex; justify-content:space-between; margin-top:48px; font-size:13px; }
  .ttd-box { text-align:center; width:200px; }
  .ttd-line { margin-top:64px; border-bottom:1px solid #1e293b; margin-bottom:4px; }
  .stamp { text-align:center; margin-top:12px; font-size:11px; color:#94a3b8; }
</style>
</head>
<body>
  <div class="kop">
    <h1>Dinas Pendidikan Kabupaten Bekasi</h1>
    <h2>SMP Negeri 4 Cikarang Barat</h2>
    <h3>Jl. Raya Cikarang-Cibarusah No. 45, Cikarang Barat, Bekasi 17530</h3>
    <p>Telp. (021) 8900-1234 | Email: info@smpn4cikarangbarat.sch.id</p>
  </div>

  <div class="title-doc">${jenis.toUpperCase()}</div>
  <div class="subtitle">Nomor: ${nomor}</div>

  <table class="meta">
    <tr><td>Jenis Dokumen</td><td>: ${jenis}</td></tr>
    <tr><td>Kategori</td><td>: ${kategori}</td></tr>
    <tr><td>Kelas / Unit</td><td>: ${kelas}</td></tr>
    ${siswa !== "—" ? `<tr><td>Nama Siswa</td><td>: ${siswa}</td></tr>` : ""}
    ${nisn !== "—" ? `<tr><td>NISN</td><td>: ${nisn}</td></tr>` : ""}
    <tr><td>Tahun Ajaran</td><td>: ${tahun}</td></tr>
    <tr><td>Status</td><td>: ${doc.status}</td></tr>
  </table>

  ${nilaiRows}

  <div class="content">
    ${
      isNilai
        ? `<p>Demikian laporan nilai ini dibuat berdasarkan hasil evaluasi yang telah dilaksanakan sesuai dengan kurikulum yang berlaku. Nilai di atas merupakan hasil asesmen formatif dan sumatif selama periode semester berjalan.</p>`
        : `<p>Dokumen ini diterbitkan oleh SMP Negeri 4 Cikarang Barat sebagai ${jenis.toLowerCase()} resmi yang sah dan dapat dipertanggungjawabkan. Segala informasi yang tercantum dalam dokumen ini telah diverifikasi dan sesuai dengan data administrasi sekolah.</p>`
    }
  </div>

  <div class="ttd">
    <div class="ttd-box">
      <div>Mengetahui,</div>
      <div>Kepala Sekolah</div>
      <div class="ttd-line"></div>
      <div><strong>Dr. Siti Rahayu, M.Pd.</strong></div>
      <div style="font-size:11px;color:#64748b;">NIP. 19780515 200501 2 003</div>
    </div>
    <div class="ttd-box">
      <div>Cikarang Barat,</div>
      <div>${new Date(doc.tanggalUpload).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
      <div class="ttd-line"></div>
      <div><strong>${doc.pengunggah.nama}</strong></div>
      <div style="font-size:11px;color:#64748b;">${doc.pengunggah.role}</div>
    </div>
  </div>

  ${qrSection}

  <div class="stamp">Dokumen ini digenerate oleh sistem SAKURA — Secure Archiving and Keeping of Unified Records for Administration</div>
</body>
</html>`;
}

export default function PdfPreviewOverlay({ onClose, document: doc, mode = "distributed", isAdmin = false }: Props) {
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const htmlContent = useMemo(() => buildDocumentHtml(doc, mode), [doc, mode]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { clearTimeout(t); window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/90 flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm text-foreground truncate max-w-md">{doc.judul}</span>
          {mode === "master" ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium shrink-0">Master File</span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium shrink-0">Distributed Copy</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(50, z - 25))} className="p-2 rounded hover:bg-muted"><ZoomOut size={18} /></button>
          <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(200, z + 25))} className="p-2 rounded hover:bg-muted"><ZoomIn size={18} /></button>
          <button onClick={() => setZoom(100)} className="p-2 rounded hover:bg-muted"><Maximize size={18} /></button>
          <div className="w-px h-6 bg-border mx-1" />
          {/* Download button with role-based dropdown for Admin */}
          <div className="relative">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="p-2 rounded hover:bg-muted flex items-center gap-1"
                  title="Download"
                >
                  <Download size={18} />
                  <span className="text-xs">▾</span>
                </button>
                {showDownloadMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDownloadMenu(false)} />
                    <div className="absolute top-full right-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg z-20">
                      <button
                        onClick={() => { alert("Simulasi: Mengunduh Master File (editable version)"); setShowDownloadMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted rounded-t-lg flex items-center gap-2"
                      >
                        <Shield size={14} className="text-primary" /> Master File
                        <span className="text-xs text-muted-foreground ml-auto">Editable</span>
                      </button>
                      <button
                        onClick={() => { alert("Simulasi: Mengunduh Distributed Copy (protected PDF)"); setShowDownloadMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted rounded-b-lg flex items-center gap-2 border-t border-border"
                      >
                        <FileText size={14} className="text-muted-foreground" /> Distributed Copy
                        <span className="text-xs text-muted-foreground ml-auto">Protected</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => alert("Simulasi: Mengunduh Distributed Copy (protected PDF dengan QR code)")}
                className="p-2 rounded hover:bg-muted"
                title="Download"
              >
                <Download size={18} />
              </button>
            )}
          </div>
          <button className="p-2 rounded hover:bg-muted"><Printer size={18} /></button>
          <div className="w-px h-6 bg-border mx-1" />
          <button onClick={onClose} className="p-2 rounded hover:bg-destructive/10 text-destructive"><X size={20} /></button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 mt-24">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-primary-foreground/70 text-sm">Memuat dokumen...</span>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg shadow-2xl transition-transform origin-top relative"
            style={{ transform: `scale(${zoom / 100})`, width: "794px", minHeight: "1123px" }}
          >
            <iframe
              srcDoc={htmlContent}
              title={`Preview ${doc.judul}`}
              className="w-full border-0 rounded-lg"
              style={{ width: "794px", minHeight: "1123px", height: "1123px" }}
              sandbox="allow-same-origin"
            />
            {mode === "distributed" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center rounded-lg overflow-hidden">
                <span className="text-6xl font-bold text-muted-foreground/10 rotate-[-30deg] select-none whitespace-nowrap tracking-widest">DISTRIBUTED COPY</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
