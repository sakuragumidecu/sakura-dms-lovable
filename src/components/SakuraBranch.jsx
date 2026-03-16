import { useState } from "react";

/**
 * Cinematic SVG cherry blossom branch with realistic 3D-style flowers.
 * Flowers are clickable and scroll to sections.
 */

/* ── Flower positions ── */
const FLOWER_NODES = [
  // Interactive flowers (linked to sections)
  { cx: 245, cy: 275, size: 32, rot: -10, section: "about", label: "Apa itu SAKURA?" },
  { cx: 365, cy: 240, size: 28, rot: 15, section: "why", label: "Arsip Digital" },
  { cx: 480, cy: 140, size: 34, rot: -5, section: "workflow", label: "Alur Persetujuan" },
  { cx: 660, cy: 150, size: 30, rot: 20, section: "security", label: "Keamanan & QR" },
  { cx: 520, cy: 458, size: 29, rot: -15, section: "school", label: "SMP Negeri 4" },
  // Decorative flowers
  { cx: 545, cy: 110, size: 24, rot: 30, section: null, label: null },
  { cx: 710, cy: 130, size: 22, rot: -25, section: null, label: null },
  { cx: 575, cy: 475, size: 23, rot: 10, section: null, label: null },
  { cx: 650, cy: 230, size: 26, rot: -20, section: null, label: null },
  { cx: 720, cy: 226, size: 20, rot: 5, section: null, label: null },
  { cx: 650, cy: 175, size: 25, rot: -30, section: null, label: null },
  { cx: 180, cy: 316, size: 22, rot: 12, section: null, label: null },
  { cx: 450, cy: 400, size: 24, rot: -8, section: null, label: null },
  { cx: 300, cy: 290, size: 19, rot: 25, section: null, label: null },
  { cx: 420, cy: 170, size: 21, rot: -18, section: null, label: null },
  { cx: 590, cy: 145, size: 20, rot: 8, section: null, label: null },
  { cx: 500, cy: 430, size: 18, rot: -12, section: null, label: null },
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

/**
 * Generate a single wide, rounded heart-shaped petal path
 * centered at (0,0), pointing upward, then rotate by angle.
 */
function petalPath(angle, size) {
  const s = size / 50; // scale factor relative to viewBox 100
  const rad = (angle * Math.PI) / 180;
  // Wide rounded heart petal shape
  const pts = [
    [0, -size * 0.95],   // tip
    [-size * 0.55, -size * 0.7],  // left control
    [-size * 0.65, -size * 0.2],  // left wide
    [-size * 0.35, size * 0.1],   // left base
    [0, 0],                        // center
    [size * 0.35, size * 0.1],    // right base
    [size * 0.65, -size * 0.2],   // right wide
    [size * 0.55, -size * 0.7],   // right control
  ];
  
  // Rotate all points
  const rotate = ([x, y]) => {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [x * cos - y * sin, x * sin + y * cos];
  };

  const r = pts.map(rotate);
  
  return `M ${r[0][0]} ${r[0][1]} 
    C ${r[1][0]} ${r[1][1]}, ${r[2][0]} ${r[2][1]}, ${r[3][0]} ${r[3][1]} 
    Q ${r[4][0]} ${r[4][1]}, ${r[5][0]} ${r[5][1]} 
    C ${r[6][0]} ${r[6][1]}, ${r[7][0]} ${r[7][1]}, ${r[0][0]} ${r[0][1]} Z`;
}

/** Render a 3D-style 5-petal cherry blossom */
function renderFlower(node, hoveredId, setHoveredId) {
  const { cx, cy, size, rot, section, label } = node;
  const isInteractive = !!section;
  const isHovered = hoveredId === section;
  const scale = isHovered ? 1.2 : 1;
  const petalAngles = [0, 72, 144, 216, 288];
  const stamenCount = 10;
  const stamenLength = size * 0.45;
  const uniqueId = `flower-${cx}-${cy}`;

  return (
    <g
      key={uniqueId}
      style={{
        cursor: isInteractive ? "pointer" : "default",
        transform: `translate(${cx}px, ${cy}px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "0 0",
        transition: "transform 0.3s ease, filter 0.3s ease",
        filter: isHovered
          ? "drop-shadow(0 3px 12px rgba(200,80,100,0.5))"
          : "drop-shadow(1px 2px 4px rgba(200,80,100,0.3))",
      }}
      onClick={isInteractive ? () => scrollToSection(section) : undefined}
      onMouseEnter={isInteractive ? () => setHoveredId(section) : undefined}
      onMouseLeave={isInteractive ? () => setHoveredId(null) : undefined}
    >
      {/* Petal gradient defs scoped to this flower */}
      <defs>
        <radialGradient id={`pg-${uniqueId}`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FFB7C5" />
          <stop offset="100%" stopColor="#FF85A1" />
        </radialGradient>
      </defs>

      {/* 5 petals */}
      {petalAngles.map((angle) => (
        <g key={`p-${angle}`}>
          <path
            d={petalPath(angle, size)}
            fill={`url(#pg-${uniqueId})`}
            stroke="#FFa0b5"
            strokeWidth="0.5"
            opacity="0.94"
          />
          {/* Vein — subtle white stripe */}
          <line
            x1={0}
            y1={0}
            x2={Math.sin((angle * Math.PI) / 180) * size * -0.7}
            y2={-Math.cos((angle * Math.PI) / 180) * size * 0.7}
            stroke="white"
            strokeWidth="0.8"
            opacity="0.2"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Center gradient */}
      <defs>
        <radialGradient id={`cg-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
      </defs>
      <circle r={size * 0.16} fill={`url(#cg-${uniqueId})`} />

      {/* Stamens */}
      {Array.from({ length: stamenCount }, (_, i) => {
        const a = (i * 360) / stamenCount;
        const rad = (a * Math.PI) / 180;
        const endX = Math.cos(rad) * stamenLength;
        const endY = Math.sin(rad) * stamenLength;
        const startX = Math.cos(rad) * size * 0.12;
        const startY = Math.sin(rad) * size * 0.12;
        return (
          <g key={`s-${i}`}>
            <line
              x1={startX} y1={startY}
              x2={endX} y2={endY}
              stroke="#C23A57"
              strokeWidth="1.2"
              opacity="0.7"
              strokeLinecap="round"
            />
            <circle cx={endX} cy={endY} r="2.2" fill="#FFD700" opacity="0.9" />
          </g>
        );
      })}

      {/* Tooltip on hover */}
      {isHovered && label && (
        <foreignObject
          x={-60} y={-size - 32}
          width="120" height="28"
          style={{ overflow: "visible", pointerEvents: "none" }}
        >
          <div
            style={{
              background: "#fff",
              color: "#C2185B",
              fontSize: "10px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(194,24,91,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

/** Render a bud */
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
