import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * 80 SVG sakura petals falling with pure CSS keyframe animation.
 * Each petal falls from -20px to 110vh with unique timing.
 */

const PETAL_COLORS = [
  "#FFB7C5", "#FFC8D5", "#FF9EB5", "#FFD6E0", "#FFAFC5",
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function PetalSVG({ color, width, height, blur }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={blur ? { filter: "blur(0.8px)" } : undefined}
    >
      <path
        d="M 9 0 C 15 0 18 6 18 12 C 18 18 14 24 9 24 C 4 24 0 18 0 12 C 0 6 3 0 9 0 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M 9 3 C 9 8, 9 16, 9 22"
        stroke="#fff"
        strokeWidth="0.5"
        opacity="0.25"
        fill="none"
      />
    </svg>
  );
}

export default function SakuraPetalsFalling() {
  const isMobile = useIsMobile();
  const count = isMobile ? 35 : 80;

  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const color = PETAL_COLORS[i % PETAL_COLORS.length];
      const w = rand(10, 22);
      const h = w * rand(1.2, 1.5);
      const duration = rand(6, 14);
      const delay = rand(0, 12);
      const driftX = rand(-50, 50);
      const rotation = rand(360, 540);
      const tiltY = rand(0, 180);
      const startX = rand(5, 95);
      const blur = i % 6 === 0;
      const opacity = rand(0.65, 0.9);

      return {
        id: i,
        color,
        width: w,
        height: h,
        blur,
        style: {
          position: "absolute",
          left: `${startX}%`,
          top: "-20px",
          width: `${w}px`,
          height: `${h}px`,
          willChange: "transform",
          opacity: 0,
          animationName: i % 2 === 0 ? "petalFall" : "petalFall2",
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          animationIterationCount: "infinite",
          animationFillMode: "both",
          "--petal-drift": `${driftX}px`,
          "--petal-rotation": `${rotation}deg`,
          "--petal-tiltX": `${rand(20, 40)}deg`,
          "--petal-tiltY": `${tiltY}deg`,
          "--petal-opacity": opacity,
          zIndex: 30,
          pointerEvents: "none",
        },
      };
    });
  }, [count]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 30, perspective: "600px", overflow: "visible" }}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <div key={p.id} style={p.style}>
          <PetalSVG color={p.color} width={p.width} height={p.height} blur={p.blur} />
        </div>
      ))}
    </div>
  );
}
