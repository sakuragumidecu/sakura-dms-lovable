import { useState } from "react";
import { motion } from "framer-motion";
import logoSakura from "@/assets/logo_sakura.png";

const TECH_CARDS = [
  {
    title: "Frontend",
    iconColor: "#61DAFB",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
      </svg>
    ),
    tags: ["React.js", "TypeScript", "Tailwind CSS", "Vite", "shadcn/ui"],
  },
  {
    title: "Backend",
    iconColor: "#8CC84B",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="#8CC84B">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8CC84B" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tags: ["Node.js", "Express.js", "REST API", "JWT Auth", "Multer"],
  },
  {
    title: "Database",
    iconColor: "#A855F7",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    tags: ["MySQL", "phpMyAdmin", "XAMPP", "Azure Blob Storage"],
  },
  {
    title: "Keamanan",
    iconColor: "#C23A57",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#C23A57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    tags: ["JWT Token", "bcrypt", "QR Verification", "Signed Token", "HTTPS"],
  },
  {
    title: "Development Tools",
    iconColor: "#F59E0B",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    tags: ["VS Code", "Git & GitHub", "Postman", "Chrome", "Microsoft Edge"],
  },
  {
    title: "Cloud & Hosting",
    iconColor: "#3B82F6",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    tags: ["Azure Cloud", "Azure Blob Storage", "Lovable.dev"],
  },
];

const ORBIT_PETALS = [
  { duration: 8, startAngle: 0, radius: 140, size: 14 },
  { duration: 12, startAngle: 90, radius: 130, size: 11 },
  { duration: 15, startAngle: 200, radius: 150, size: 13 },
  { duration: 10, startAngle: 300, radius: 135, size: 10 },
];

function OrbitPetal({ duration, startAngle, radius, size }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        animation: `orbit ${duration}s linear infinite`,
        animationDelay: `${-(startAngle / 360) * duration}s`,
        "--orbit-radius": `${radius}px`,
      }}
    >
      <svg width={size} height={size * 1.3} viewBox="0 0 18 24" fill="none" style={{ marginLeft: -size / 2, marginTop: -size / 2 }}>
        <path
          d="M 9 0 C 15 0 18 6 18 12 C 18 18 14 24 9 24 C 4 24 0 18 0 12 C 0 6 3 0 9 0 Z"
          fill="#FFB7C5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function TechCard({ card, index, isHovered, isSelected, onClick }) {
  const stackOffset = isHovered ? 0 : index * 8;
  const stackRight = isHovered ? 0 : index * 4;
  const fanY = isHovered ? -index * 74 : 0;

  return (
    <div
      onClick={() => onClick(index)}
      style={{
        position: isHovered ? "relative" : "absolute",
        top: isHovered ? 0 : stackOffset,
        left: isHovered ? 0 : stackRight,
        right: isHovered ? 0 : undefined,
        width: "100%",
        zIndex: TECH_CARDS.length - index,
        transform: isHovered
          ? `translateY(${fanY}px) scale(1.01)`
          : `translateY(0)`,
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: isSelected
          ? "1.5px solid #C23A57"
          : "1px solid rgba(255,182,193,0.35)",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: isSelected
          ? "0 8px 32px rgba(194,58,87,0.25)"
          : "0 4px 20px rgba(194,58,87,0.08)",
        cursor: "pointer",
        opacity: !isHovered && index > 0 ? 0.95 : 1,
      }}
    >
      <div className="flex items-center gap-3 mb-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${card.iconColor}15` }}
        >
          {card.icon}
        </div>
        <span className="font-semibold text-sm" style={{ color: "#1A0A0F" }}>
          {card.title}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full font-medium"
            style={{
              background: "#FDE8EC",
              color: "#C23A57",
              fontSize: "11px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <motion.div
      id="section-about"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col md:flex-row items-center gap-10 md:gap-16 py-12"
      style={{ position: "relative", zIndex: 2 }}
    >
      {/* LEFT — Logo emblem */}
      <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "40%" }}>
        <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,182,193,0.3) 0%, rgba(255,182,193,0) 70%)",
            }}
          />
          {/* Orbiting petals */}
          {ORBIT_PETALS.map((p, i) => (
            <OrbitPetal key={i} {...p} />
          ))}
          {/* Logo */}
          <img
            src={logoSakura}
            alt="SAKURA Logo"
            className="relative rounded-2xl"
            style={{ width: 200, height: 200, objectFit: "contain" }}
          />
        </div>
        <h2
          className="text-center mt-2 font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 48,
            color: "#1A0A0F",
            lineHeight: 1.1,
          }}
        >
          SAKURA
        </h2>
        <p
          className="text-center mt-2 italic"
          style={{ fontSize: 13, color: "#C23A57", maxWidth: 280 }}
        >
          Secure Archiving and Keeping of Unified Records for Administration
        </p>
        <p className="text-center mt-1" style={{ fontSize: 12, color: "#5B5468" }}>
          SMP Negeri 4 Cikarang Barat
        </p>
      </div>

      {/* RIGHT — Tech stack cards */}
      <div className="flex-1 min-w-0">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            minHeight: isHovered ? TECH_CARDS.length * 74 + 20 : TECH_CARDS.length * 8 + 90,
            transition: "min-height 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {TECH_CARDS.map((card, i) => (
            <TechCard
              key={card.title}
              card={card}
              index={i}
              isHovered={isHovered}
              isSelected={selectedCard === i}
              onClick={setSelectedCard}
            />
          ))}
        </div>
        <p
          className="text-center mt-3"
          style={{ fontSize: 11, color: "#9B7A8A" }}
        >
          Hover untuk melihat teknologi yang digunakan
        </p>
      </div>
    </motion.div>
  );
}
