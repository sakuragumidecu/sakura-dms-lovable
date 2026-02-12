import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, RefreshCw, ArrowLeft, Mail } from "lucide-react";
import logoSakura from "@/assets/logo_sakura.png";

interface OtpPageProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function OtpPage({ email, onVerified, onBack }: OtpPageProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Demo OTP code
  const DEMO_OTP = "123456";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits filled
    if (newOtp.every((d) => d !== "")) {
      const code = newOtp.join("");
      verifyOtp(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (data.length === 6) {
      const newOtp = data.split("");
      setOtp(newOtp);
      verifyOtp(data);
    }
  };

  const verifyOtp = (code: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      if (code === DEMO_OTP) {
        onVerified();
      } else {
        setError("Kode OTP salah. Gunakan 123456 untuk demo.");
        setIsVerifying(false);
      }
    }, 800);
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-primary px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <img src={logoSakura} alt="SAKURA" className="w-12 h-12 rounded-full" />
          <div>
            <div className="text-primary-foreground font-bold text-xl">SAKURA</div>
            <div className="text-primary-foreground/70 text-sm">Secure Document System</div>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
          Verifikasi<br />Dua Langkah
        </h1>
        <p className="text-primary-foreground/70 text-lg">
          Kode OTP telah dikirim ke email Anda untuk keamanan tambahan.
        </p>
        <div className="mt-12 p-6 rounded-xl bg-primary-foreground/5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={24} className="text-accent" />
            <span className="text-primary-foreground font-semibold">Keamanan Berlapis</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            Two-Factor Authentication melindungi akun Anda dari akses tidak sah, meskipun password Anda diketahui pihak lain.
          </p>
        </div>
        <p className="mt-auto text-primary-foreground/40 text-xs pt-8">© 2026 SAKURA · President University Capstone Project</p>
      </div>

      {/* Right - OTP Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 bg-background">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Kembali
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Masukkan Kode OTP</h2>
            <p className="text-muted-foreground text-sm">
              Kode verifikasi 6 digit telah dikirim ke
            </p>
            <p className="text-foreground font-semibold text-sm mt-1">{email}</p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                  error ? "border-destructive" : digit ? "border-primary" : "border-input"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center mb-4">{error}</p>
          )}

          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
              <RefreshCw size={14} className="animate-spin" /> Memverifikasi...
            </div>
          )}

          {/* Resend */}
          <div className="text-center mb-6">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Kirim ulang kode dalam <span className="font-semibold text-foreground">{resendTimer}s</span>
              </p>
            ) : (
              <button onClick={handleResend} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mx-auto">
                <RefreshCw size={14} /> Kirim Ulang Kode OTP
              </button>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-center border-t border-border pt-4">
            <button
              onClick={() => alert("Simulasi: Link reset password telah dikirim ke " + email)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Lupa kata sandi? <span className="font-semibold text-primary">Reset via email</span>
            </button>
          </div>

          {/* Back button (desktop) */}
          <div className="hidden lg:block text-center mt-6">
            <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
              <ArrowLeft size={14} /> Kembali ke Login
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-lg border border-border bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">
              Demo: Gunakan kode <span className="font-bold text-foreground">123456</span> untuk verifikasi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
