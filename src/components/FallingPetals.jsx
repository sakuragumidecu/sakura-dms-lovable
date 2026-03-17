import { useEffect, useRef, useState, useCallback } from "react";

// Inject keyframe via JS to guarantee it loads
const STYLE_ID = "sakura-fall-style";
const STYLE = `
@keyframes sakuraFall {
  0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
  15%  { transform: translate(calc(var(--sx) * 0.15), 12vh) rotate(60deg) scale(0.98); }
  30%  { transform: translate(calc(var(--sx) * 0.35), 26vh) rotate(130deg) scale(0.96); }
  45%  { transform: translate(calc(var(--sx) * 0.50), 40vh) rotate(200deg) scale(0.94); }
  60%  { transform: translate(calc(var(--sx) * 0.65), 55vh) rotate(290deg) scale(0.92); }
  75%  { transform: translate(calc(var(--sx) * 0.80), 72vh) rotate(380deg) scale(0.90); opacity: 0.25; }
  90%  { transform: translate(calc(var(--sx) * 0.92), 90vh) rotate(460deg) scale(0.88); opacity: 0.1; }
  100% { transform: translate(var(--sx), 108vh) rotate(540deg) scale(0.85); opacity: 0; }
}
`;

const FLOWERS = [
  { x: 10, y: 37 }, { x: 15, y: 31 }, { x: 20, y: 26 },
  { x: 26, y: 22 }, { x: 31, y: 18 }, { x: 37, y: 15 },
  { x: 43, y: 13 }, { x: 49, y: 14 }, { x: 55, y: 17 },
  { x: 60, y: 21 }, { x: 35, y: 43 }, { x: 41, y: 50 },
  { x: 47, y: 56 },
];

const COLORS = [
  "#FFB7C5", "#FF9EBA", "#FFC5D0",
  "#FFADC0", "#FFD0DC", "#FF90AF",
];

let uid = 0;

function spawn(ox, oy) {
  const f = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  return {
    id: ++uid,
    x: (ox ?? f.x) + (Math.random() - 0.5) * 3,
    y: (oy ?? f.y) + (Math.random() - 0.5) * 2,
    size: 9 + Math.random() * 13,
    dur: 7 + Math.random() * 8,
    // Use vw unit for sway so calc multiplication works (unitless * vw)
    sx: ((Math.random() - 0.5) * 20).toFixed(1), // in vw
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    op: 0.5 + Math.random() * 0.45,
  };
}

function PetalSVG({ color, size }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 18 24" fill="none">
      <path
        d="M 9 0 C 15 0 18 6 18 12 C 18 18 14 24 9 24 C 4 24 0 18 0 12 C 0 6 3 0 9 0 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M 9 3 C 9 8, 9 16, 9 22"
        stroke="#fff"
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

export default function FallingPetals() {
  const [petals, setPetals] = useState([]);
  const timers = useRef([]);

  const addPetal = useCallback((p) => {
    setPetals((prev) => {
      const next = [...prev, p];
      return next.length > 150 ? next.slice(-150) : next;
    });
    const t = setTimeout(() => {
      setPetals((prev) => prev.filter((x) => x.id !== p.id));
    }, (p.dur + 0.5) * 1000);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    // Inject keyframe style
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement("style");
      el.id = STYLE_ID;
      el.textContent = STYLE;
      document.head.appendChild(el);
    }

    // Spawn initial batch staggered
    for (let i = 0; i < 28; i++) {
      const t = setTimeout(() => addPetal(spawn()), i * 120);
      timers.current.push(t);
    }

    // Continuous spawning every 380ms — runs forever
    const interval = setInterval(() => addPetal(spawn()), 380);

    // Flower click bursts
    const onBurst = (e) => {
      const { x, y } = e.detail;
      for (let i = 0; i < 20; i++) {
        const t = setTimeout(() => addPetal(spawn(x, y)), i * 60);
        timers.current.push(t);
      }
    };
    window.addEventListener("sakuraBurst", onBurst);

    return () => {
      clearInterval(interval);
      timers.current.forEach(clearTimeout);
      window.removeEventListener("sakuraBurst", onBurst);
    };
  }, [addPetal]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            opacity: p.op,
            animation: `sakuraFall ${p.dur}s ease-in forwards`,
            "--sx": `${p.sx}vw`,
            pointerEvents: "none",
          }}
        >
          <PetalSVG color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  );
}
