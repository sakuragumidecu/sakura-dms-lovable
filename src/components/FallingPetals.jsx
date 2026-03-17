import { useEffect, useState, useCallback } from "react";

const FLOWER_SPAWN_POINTS = [
  { x: 11, y: 40 },
  { x: 17, y: 33 },
  { x: 23, y: 27 },
  { x: 29, y: 23 },
  { x: 34, y: 19 },
  { x: 40, y: 16 },
  { x: 46, y: 13 },
  { x: 52, y: 15 },
  { x: 58, y: 18 },
  { x: 63, y: 22 },
  { x: 37, y: 44 },
  { x: 43, y: 51 },
  { x: 49, y: 57 },
];

const PETAL_COLORS = [
  "#FFB7C5", "#FF9EB5", "#FFC8D5",
  "#FFD0DC", "#FFAABF", "#FFC0CB",
];

function PetalSVG({ color, size }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 18 24"
      fill="none"
    >
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

  useEffect(() => {
    const spawnPetal = () => {
      const spawn = FLOWER_SPAWN_POINTS[
        Math.floor(Math.random() * FLOWER_SPAWN_POINTS.length)
      ];

      const duration = 7 + Math.random() * 8;
      const petal = {
        id: Date.now() + Math.random(),
        startX: spawn.x + (Math.random() - 0.5) * 4,
        startY: spawn.y + (Math.random() - 0.5) * 3,
        size: 8 + Math.random() * 14,
        duration,
        swayX: (Math.random() - 0.5) * 150,
        rotationEnd: 360 + Math.random() * 720,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: 0.5 + Math.random() * 0.4,
      };

      setPetals(prev => {
        const next = [...prev, petal];
        return next.length > 120 ? next.slice(-120) : next;
      });

      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.id !== petal.id));
      }, (duration + 0.5) * 1000);
    };

    // Spawn 25 petals immediately, staggered
    for (let i = 0; i < 25; i++) {
      setTimeout(spawnPetal, i * 100);
    }

    // Continuously spawn every 400ms forever
    const interval = setInterval(spawnPetal, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, overflow: "hidden" }}
      aria-hidden="true"
    >
      {petals.map(petal => (
        <div
          key={petal.id}
          style={{
            position: "fixed",
            left: `${petal.startX}vw`,
            top: `${petal.startY}vh`,
            pointerEvents: "none",
            opacity: petal.opacity,
            animation: `fallingPetal ${petal.duration}s ease-in forwards`,
            "--sway-x": `${petal.swayX}px`,
            "--rot-end": `${petal.rotationEnd}deg`,
          }}
        >
          <PetalSVG color={petal.color} size={petal.size} />
        </div>
      ))}
    </div>
  );
}
