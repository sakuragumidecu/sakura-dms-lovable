import { useState, useRef, useCallback } from "react";

export default function CropOverlay({ imageUrl, cropArea, onChange }) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const getRelativePos = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const startRef = useRef({ pos: { x: 0, y: 0 }, crop: { x: 0, y: 0, w: 0, h: 0 } });

  const handlePointerDown = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getRelativePos(e);
    startRef.current = { pos, crop: { ...cropArea } };
    setDragging(type);
  }, [cropArea, getRelativePos]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getRelativePos(e);
    const dx = pos.x - startRef.current.pos.x;
    const dy = pos.y - startRef.current.pos.y;
    const c = startRef.current.crop;
    let next = { ...c };

    if (dragging === "move") {
      next.x = Math.max(0, Math.min(100 - c.w, c.x + dx));
      next.y = Math.max(0, Math.min(100 - c.h, c.y + dy));
    } else if (dragging === "se") {
      next.w = Math.max(10, Math.min(100 - c.x, c.w + dx));
      next.h = Math.max(10, Math.min(100 - c.y, c.h + dy));
    } else if (dragging === "sw") {
      const newX = Math.max(0, c.x + dx);
      next.x = newX;
      next.w = Math.max(10, c.w - (newX - c.x));
      next.h = Math.max(10, Math.min(100 - c.y, c.h + dy));
    } else if (dragging === "ne") {
      next.w = Math.max(10, Math.min(100 - c.x, c.w + dx));
      const newY = Math.max(0, c.y + dy);
      next.y = newY;
      next.h = Math.max(10, c.h - (newY - c.y));
    } else if (dragging === "nw") {
      const newX = Math.max(0, c.x + dx);
      const newY = Math.max(0, c.y + dy);
      next.x = newX;
      next.y = newY;
      next.w = Math.max(10, c.w - (newX - c.x));
      next.h = Math.max(10, c.h - (newY - c.y));
    }

    onChange(next);
  }, [dragging, getRelativePos, onChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleStyle = "w-4 h-4 sm:w-5 sm:h-5 bg-primary border-2 border-primary-foreground rounded-full absolute z-20 shadow-lg cursor-pointer";

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none rounded-lg overflow-hidden bg-muted/20"
      style={{ maxHeight: "50vh" }}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Full image - always visible */}
      <img
        src={imageUrl}
        alt="Pratinjau untuk dipotong"
        className="w-full h-auto block rounded-lg"
        style={{ maxHeight: "50vh", objectFit: "contain", width: "100%" }}
        draggable={false}
        onLoad={() => setImgLoaded(true)}
      />

      {imgLoaded && (
        <>
          {/* Dark overlay outside crop area */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            {/* Top */}
            <div className="absolute bg-foreground/45" style={{ top: 0, left: 0, right: 0, height: `${cropArea.y}%` }} />
            {/* Bottom */}
            <div className="absolute bg-foreground/45" style={{ bottom: 0, left: 0, right: 0, height: `${Math.max(0, 100 - cropArea.y - cropArea.h)}%` }} />
            {/* Left */}
            <div className="absolute bg-foreground/45" style={{ top: `${cropArea.y}%`, left: 0, width: `${cropArea.x}%`, height: `${cropArea.h}%` }} />
            {/* Right */}
            <div className="absolute bg-foreground/45" style={{ top: `${cropArea.y}%`, right: 0, width: `${Math.max(0, 100 - cropArea.x - cropArea.w)}%`, height: `${cropArea.h}%` }} />
          </div>

          {/* Crop selection box */}
          <div
            className="absolute border-2 border-primary cursor-move"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.w}%`,
              height: `${cropArea.h}%`,
              zIndex: 10,
              boxShadow: "0 0 0 1px hsl(var(--primary) / 0.3)",
            }}
            onMouseDown={(e) => handlePointerDown(e, "move")}
            onTouchStart={(e) => handlePointerDown(e, "move")}
          >
            {/* Rule-of-thirds grid */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary-foreground/40" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-primary-foreground/40" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-primary-foreground/40" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-primary-foreground/40" />
            </div>
          </div>

          {/* Corner handles - larger touch targets */}
          <div className={handleStyle} style={{ left: `calc(${cropArea.x}% - 8px)`, top: `calc(${cropArea.y}% - 8px)`, cursor: "nw-resize", zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "nw")} onTouchStart={(e) => handlePointerDown(e, "nw")} />
          <div className={handleStyle} style={{ left: `calc(${cropArea.x + cropArea.w}% - 8px)`, top: `calc(${cropArea.y}% - 8px)`, cursor: "ne-resize", zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "ne")} onTouchStart={(e) => handlePointerDown(e, "ne")} />
          <div className={handleStyle} style={{ left: `calc(${cropArea.x}% - 8px)`, top: `calc(${cropArea.y + cropArea.h}% - 8px)`, cursor: "sw-resize", zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "sw")} onTouchStart={(e) => handlePointerDown(e, "sw")} />
          <div className={handleStyle} style={{ left: `calc(${cropArea.x + cropArea.w}% - 8px)`, top: `calc(${cropArea.y + cropArea.h}% - 8px)`, cursor: "se-resize", zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "se")} onTouchStart={(e) => handlePointerDown(e, "se")} />

          {/* Edge midpoint handles */}
          <div className="w-6 h-2 bg-primary rounded-full absolute shadow-md cursor-n-resize"
            style={{ left: `calc(${cropArea.x + cropArea.w / 2}% - 12px)`, top: `calc(${cropArea.y}% - 4px)`, zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "nw")} onTouchStart={(e) => handlePointerDown(e, "nw")} />
          <div className="w-6 h-2 bg-primary rounded-full absolute shadow-md cursor-s-resize"
            style={{ left: `calc(${cropArea.x + cropArea.w / 2}% - 12px)`, top: `calc(${cropArea.y + cropArea.h}% - 4px)`, zIndex: 20 }}
            onMouseDown={(e) => handlePointerDown(e, "se")} onTouchStart={(e) => handlePointerDown(e, "se")} />
        </>
      )}
    </div>
  );
}
