import { useState } from "react";

/**
 * Cinematic SVG cherry blossom branch spanning full width with 3D flowers.
 * Branch extends from left edge to upper-right near navbar.
 */

/* ── Flower positions (in SVG viewBox 0 0 1200 800) ── */
export const FLOWER_NODES = [
  // Interactive flowers — larger sizes, with glow
  { cx: 245, cy: 275, size: 75, rot: -10, section: "about", label: "Apa itu SAKURA?" },
  { cx: 365, cy: 240, size: 72, rot: 15, section: "why", label: "Arsip Digital" },
  { cx: 480, cy: 140, size: 78, rot: -5, section: "workflow", label: "Alur Persetujuan" },
  { cx: 660, cy: 150, size: 74, rot: 20, section: "security", label: "Keamanan & QR" },
  { cx: 520, cy: 458, size: 72, rot: -15, section: "school", label: "SMP Negeri 4" },
  // Decorative flowers — smaller, no interaction
  { cx: 545, cy: 110, size: 48, rot: 30, section: null, label: null },
  { cx: 710, cy: 130, size: 45, rot: -25, section: null, label: null },
  { cx: 575, cy: 475, size: 46, rot: 10, section: null, label: null },
  { cx: 650, cy: 230, size: 50, rot: -20, section: null, label: null },
  { cx: 720, cy: 226, size: 42, rot: 5, section: null, label: null },
  { cx: 650, cy: 175, size: 50, rot: -30, section: null, label: null },
  { cx: 180, cy: 316, size: 44, rot: 12, section: null, label: null },
  { cx: 450, cy: 400, size: 48, rot: -8, section: null, label: null },
  { cx: 300, cy: 290, size: 40, rot: 25, section: null, label: null },
  { cx: 420, cy: 170, size: 42, rot: -18, section: null, label: null },
  { cx: 590, cy: 145, size: 40, rot: 8, section: null, label: null },
  { cx: 500, cy: 430, size: 38, rot: -12, section: null, label: null },
];

const BUD_POSITIONS = [
  { cx: 220, cy: 300, size: 9, rot: -20 },
  { cx: 400, cy: 205, size: 10, rot: 15 },
  { cx: 500, cy: 155, size: 8, rot: -10 },
  { cx: 580, cy: 195, size: 9, rot: 25 },
  { cx: 690, cy: 140, size: 8, rot: -15 },
  { cx: 470, cy: 430, size: 9, rot: 10 },
  { cx: 620, cy: 170, size: 8, rot: -5 },
];

function scrollToSection(id) {
  const el = document.getElementById(`section-${id}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const STAMEN_TIPS = [
  [50, 33], [60, 35], [65, 45], [63, 57], [55, 65],
  [45, 65], [37, 57], [35, 45], [40, 35],
];

function renderFlower(node, hoveredId, setHoveredId) {
  const { cx, cy, size, rot, section, label } = node;
  const isInteractive = !!section;
  const isHovered = hoveredId === section;
  const scale = isHovered ? 1.15 : 1;
  const uid = `fl-${cx}-${cy}`;
  const svgSize = size;

  return (
    <g
      key={uid}
      className={isInteractive ? "sakura-flower-interactive" : ""}
      style={{
        cursor: isInteractive ? "pointer" : "default",
        transform: `translate(${cx - svgSize / 2}px, ${cy - svgSize / 2}px) scale(${scale})`,
        transformOrigin: `${svgSize / 2}px ${svgSize / 2}px`,
        transition: "transform 0.3s ease",
        opacity: isInteractive ? 1 : 0.85,
      }}
      onClick={isInteractive ? () => scrollToSection(section) : undefined}
      onMouseEnter={isInteractive ? () => setHoveredId(section) : undefined}
      onMouseLeave={isInteractive ? () => setHoveredId(null) : undefined}
    >
      <svg
        viewBox="0 0 100 100"
        width={svgSize}
        height={svgSize}
        overflow="visible"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        <defs>
          <radialGradient id={`pg-${uid}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFB7C5" />
            <stop offset="100%" stopColor="#E8607A" />
          </radialGradient>
          <radialGradient id={`cg-${uid}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
        </defs>

        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={angle} transform={`rotate(${angle}, 50, 50)`}>
            <path
              d="M50,50 C38,38 30,20 50,10 C70,20 62,38 50,50Z"
              fill={`url(#pg-${uid})`}
              opacity="0.95"
            />
            <path
              d="M50,50 C50,35 50,22 50,10"
              stroke="white"
              strokeWidth="0.8"
              opacity="0.4"
              fill="none"
            />
          </g>
        ))}

        <circle cx="50" cy="50" r="9" fill={`url(#cg-${uid})`} />

        <g stroke="#C23A57" strokeWidth="1.2" opacity="0.7">
          {STAMEN_TIPS.map(([tx, ty], i) => (
            <line key={i} x1="50" y1="50" x2={tx} y2={ty} />
          ))}
        </g>

        {STAMEN_TIPS.map(([tx, ty], i) => (
          <circle key={`t${i}`} cx={tx} cy={ty} r="2" fill="#FFD700" opacity="0.9" />
        ))}
      </svg>

      {/* Always-visible label for interactive flowers — perfectly horizontal */}
      {isInteractive && label && (
        <foreignObject
          x={0} y={-32}
          width="1" height="1"
          overflow="visible"
          style={{ overflow: "visible", pointerEvents: "none" }}
        >
          <div
            className="sakura-flower-label"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "0",
              transform: "translateX(-50%)",
              background: "#fff",
              color: "#C23A57",
              fontSize: "11px",
              fontWeight: 600,
              padding: "5px 14px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(194, 58, 87, 0.2)",
              border: "1px solid rgba(194, 58, 87, 0.15)",
              whiteSpace: "nowrap",
              opacity: isHovered ? 1 : 0.9,
              transition: "opacity 0.3s ease",
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function renderBud(bud) {
  const { cx, cy, size, rot } = bud;
  return (
    <g key={`bud-${cx}-${cy}`} transform={`rotate(${rot} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={size * 0.5} ry={size} fill="#FF85A1" opacity="0.75" />
      <ellipse cx={cx + 1} cy={cy - 1} rx={size * 0.35} ry={size * 0.75} fill="#FFB7C5" opacity="0.6" />
    </g>
  );
}

export default function SakuraBranch() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMinYMid slice"
      style={{ zIndex: 2, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="branchMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D1C02" />
          <stop offset="30%" stopColor="#7B4A2D" />
          <stop offset="50%" stopColor="#8B5E3C" />
          <stop offset="70%" stopColor="#7B4A2D" />
          <stop offset="100%" stopColor="#3D1C02" />
        </linearGradient>
        <linearGradient id="branchSub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A2810" />
          <stop offset="40%" stopColor="#8B5E3C" />
          <stop offset="60%" stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#4A2810" />
        </linearGradient>
        <linearGradient id="branchTwig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3A1E" />
          <stop offset="50%" stopColor="#9B7653" />
          <stop offset="100%" stopColor="#5C3A1E" />
        </linearGradient>
      </defs>

      {/* ── MAIN TRUNK ── */}
      <path
        d="M -60 420 C 40 400, 120 370, 200 340 C 280 310, 360 290, 440 270 C 520 250, 580 240, 650 235"
        fill="none" stroke="url(#branchMain)" strokeWidth="22" strokeLinecap="round"
      />
      <path
        d="M -60 420 C 20 405, 80 385, 160 360"
        fill="none" stroke="url(#branchMain)" strokeWidth="28" strokeLinecap="round" opacity="0.7"
      />

      {/* ── SUB-BRANCHES ── */}
      <path d="M 280 325 C 310 290, 340 250, 380 210 C 410 180, 440 160, 480 145" fill="none" stroke="url(#branchSub)" strokeWidth="12" strokeLinecap="round" />
      <path d="M 440 270 C 480 250, 520 230, 560 200 C 590 180, 620 165, 660 155" fill="none" stroke="url(#branchSub)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 360 300 C 390 330, 420 360, 450 400 C 470 425, 490 445, 520 460" fill="none" stroke="url(#branchSub)" strokeWidth="11" strokeLinecap="round" />
      <path d="M 550 245 C 580 220, 610 195, 650 175" fill="none" stroke="url(#branchSub)" strokeWidth="8" strokeLinecap="round" />

      {/* ── TWIGS ── */}
      <path d="M 200 345 C 210 320, 225 300, 245 280" fill="none" stroke="url(#branchTwig)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 320 305 C 330 280, 345 260, 365 245" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 480 145 C 500 130, 520 120, 545 115" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 520 460 C 540 470, 555 475, 575 478" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 650 155 C 670 145, 690 138, 710 135" fill="none" stroke="url(#branchTwig)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 650 235 C 670 230, 695 228, 720 230" fill="none" stroke="url(#branchTwig)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 150 370 C 155 350, 165 335, 180 320" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 600 210 C 615 195, 630 185, 650 178" fill="none" stroke="url(#branchTwig)" strokeWidth="3" strokeLinecap="round" />

      {/* ── BUDS ── */}
      {BUD_POSITIONS.map((bud) => renderBud(bud))}

      {/* ── FLOWERS ── */}
      {FLOWER_NODES.map((node) => renderFlower(node, hoveredId, setHoveredId))}
    </svg>
  );
}
