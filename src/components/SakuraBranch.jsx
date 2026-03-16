/**
 * Cinematic SVG cherry blossom branch entering from the left.
 * Uses gradients for 3D cylindrical depth.
 */
export default function SakuraBranch() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMinYMid slice"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      <defs>
        {/* Main branch gradient — cylindrical 3D */}
        <linearGradient id="branchMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D1C02" />
          <stop offset="30%" stopColor="#7B4A2D" />
          <stop offset="50%" stopColor="#8B5E3C" />
          <stop offset="70%" stopColor="#7B4A2D" />
          <stop offset="100%" stopColor="#3D1C02" />
        </linearGradient>
        {/* Sub-branch gradient */}
        <linearGradient id="branchSub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A2810" />
          <stop offset="40%" stopColor="#8B5E3C" />
          <stop offset="60%" stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#4A2810" />
        </linearGradient>
        {/* Twig gradient */}
        <linearGradient id="branchTwig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3A1E" />
          <stop offset="50%" stopColor="#9B7653" />
          <stop offset="100%" stopColor="#5C3A1E" />
        </linearGradient>
        {/* Small cherry blossom cluster */}
        <radialGradient id="blossomGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD6E0" />
          <stop offset="60%" stopColor="#FFB7C5" />
          <stop offset="100%" stopColor="#FF9EB5" />
        </radialGradient>
        <radialGradient id="blossomGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF0F3" />
          <stop offset="50%" stopColor="#FFC0CB" />
          <stop offset="100%" stopColor="#FFAABB" />
        </radialGradient>
        <radialGradient id="blossomCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8879B" />
          <stop offset="100%" stopColor="#D4687E" />
        </radialGradient>
      </defs>

      {/* ── MAIN TRUNK: enters from far left, slightly diagonal ── */}
      <path
        d="M -60 420 C 40 400, 120 370, 200 340 C 280 310, 360 290, 440 270 C 520 250, 580 240, 650 235"
        fill="none"
        stroke="url(#branchMain)"
        strokeWidth="22"
        strokeLinecap="round"
      />
      {/* Thicker base overlay for depth */}
      <path
        d="M -60 420 C 20 405, 80 385, 160 360"
        fill="none"
        stroke="url(#branchMain)"
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* ── SUB-BRANCH 1: curves upward to top-right ── */}
      <path
        d="M 280 325 C 310 290, 340 250, 380 210 C 410 180, 440 160, 480 145"
        fill="none"
        stroke="url(#branchSub)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* ── SUB-BRANCH 2: extends right-upward ── */}
      <path
        d="M 440 270 C 480 250, 520 230, 560 200 C 590 180, 620 165, 660 155"
        fill="none"
        stroke="url(#branchSub)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* ── SUB-BRANCH 3: curves downward ── */}
      <path
        d="M 360 300 C 390 330, 420 360, 450 400 C 470 425, 490 445, 520 460"
        fill="none"
        stroke="url(#branchSub)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* ── SUB-BRANCH 4: upper extension from main ── */}
      <path
        d="M 550 245 C 580 220, 610 195, 650 175"
        fill="none"
        stroke="url(#branchSub)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* ── TWIGS ── */}
      <path d="M 200 345 C 210 320, 225 300, 245 280" fill="none" stroke="url(#branchTwig)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 320 305 C 330 280, 345 260, 365 245" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 480 145 C 500 130, 520 120, 545 115" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 520 460 C 540 470, 555 475, 575 478" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 650 155 C 670 145, 690 138, 710 135" fill="none" stroke="url(#branchTwig)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 650 235 C 670 230, 695 228, 720 230" fill="none" stroke="url(#branchTwig)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 150 370 C 155 350, 165 335, 180 320" fill="none" stroke="url(#branchTwig)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 600 210 C 615 195, 630 185, 650 178" fill="none" stroke="url(#branchTwig)" strokeWidth="3" strokeLinecap="round" />

      {/* ── BLOSSOM CLUSTERS (cherry flower groups) ── */}
      {/* Each cluster: 5-petal flower with center dot */}
      {renderBlossom(245, 275, 18, "blossomGrad")}
      {renderBlossom(365, 240, 16, "blossomGrad2")}
      {renderBlossom(480, 140, 20, "blossomGrad")}
      {renderBlossom(545, 110, 14, "blossomGrad2")}
      {renderBlossom(660, 150, 18, "blossomGrad")}
      {renderBlossom(710, 130, 13, "blossomGrad2")}
      {renderBlossom(520, 458, 17, "blossomGrad")}
      {renderBlossom(575, 475, 14, "blossomGrad2")}
      {renderBlossom(650, 230, 16, "blossomGrad")}
      {renderBlossom(720, 226, 13, "blossomGrad2")}
      {renderBlossom(650, 175, 15, "blossomGrad")}
      {renderBlossom(180, 316, 14, "blossomGrad2")}
      {renderBlossom(450, 400, 15, "blossomGrad")}
      {renderBlossom(300, 290, 12, "blossomGrad2")}

      {/* Extra small buds along branches */}
      {renderBud(220, 300, 7)}
      {renderBud(400, 205, 8)}
      {renderBud(500, 155, 6)}
      {renderBud(580, 195, 7)}
      {renderBud(690, 140, 6)}
      {renderBud(470, 430, 7)}
      {renderBud(620, 170, 6)}
    </svg>
  );
}

/** Render a 5-petal cherry blossom flower */
function renderBlossom(cx, cy, size, gradId) {
  const petalPath = (angle) => {
    const rad = (angle * Math.PI) / 180;
    const px = cx + Math.cos(rad) * size * 0.9;
    const py = cy + Math.sin(rad) * size * 0.9;
    const cp1x = cx + Math.cos(rad - 0.3) * size * 0.5;
    const cp1y = cy + Math.sin(rad - 0.3) * size * 0.5;
    const cp2x = cx + Math.cos(rad + 0.3) * size * 0.5;
    const cp2y = cy + Math.sin(rad + 0.3) * size * 0.5;
    return `M ${cx} ${cy} Q ${cp1x} ${cp1y} ${px} ${py} Q ${cp2x} ${cp2y} ${cx} ${cy}`;
  };

  return (
    <g key={`blossom-${cx}-${cy}`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d={petalPath(angle)}
          fill={`url(#${gradId})`}
          opacity="0.9"
          stroke="#FFB7C5"
          strokeWidth="0.3"
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.18} fill="url(#blossomCenter)" />
      {/* Stamens */}
      {[30, 100, 170, 240, 310].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const sx = cx + Math.cos(rad) * size * 0.3;
        const sy = cy + Math.sin(rad) * size * 0.3;
        return (
          <circle key={`s-${angle}`} cx={sx} cy={sy} r="1.2" fill="#E8879B" opacity="0.7" />
        );
      })}
    </g>
  );
}

/** Render a small unopened bud */
function renderBud(cx, cy, size) {
  return (
    <g key={`bud-${cx}-${cy}`}>
      <ellipse cx={cx} cy={cy} rx={size * 0.6} ry={size} fill="#FFB7C5" opacity="0.7" transform={`rotate(-20 ${cx} ${cy})`} />
      <ellipse cx={cx + 1} cy={cy} rx={size * 0.4} ry={size * 0.8} fill="#FFC0CB" opacity="0.6" transform={`rotate(10 ${cx} ${cy})`} />
    </g>
  );
}
