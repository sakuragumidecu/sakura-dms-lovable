

# Plan: Redesign Homepage — Side-Entering 3D Sakura Branch

## What Changes

The homepage hero will be completely rebuilt. Instead of a centered vertical tree, the sakura branch will **enter from the left side** of the screen and extend horizontally toward the center-right, with a slight 3D perspective angle. Petals will originate from blossom positions on the branch (not randomly from the top). Mouse parallax will add subtle depth.

## Technical Approach

**No Three.js needed.** CSS 3D transforms + framer-motion provide the right balance of quality and performance for this use case. The branch is an SVG with perspective transforms and a subtle `onMouseMove` parallax effect.

---

## Implementation Details

### 1. `src/pages/HomePage.jsx` — Full Rewrite of Hero Section

**Branch SVG**: Redraw the SVG paths so the main trunk enters from the **left edge** (x=0) and extends rightward with sub-branches curving upward and downward. Apply CSS `perspective: 1200px` and `rotateY(8deg) rotateX(-3deg)` to the branch container to create 3D depth.

**Mouse parallax**: Track mouse position via `onMouseMove` on the hero container. Apply a subtle `translate3d` offset (max ~15px) to the branch container based on cursor position, creating a living depth effect.

**Blossom nodes**: Reposition all 5 nodes along the new horizontal branch layout. Each blossom gets:
- Subtle floating animation (CSS `blossom-float` keyframe, already exists)
- Hover glow effect (already exists via `blossom-3d` class)
- Click → smooth scroll to section (already works)

**Layout**: Branch occupies ~60-70% of hero width from the left. Right side shows the SAKURA title text, acronym, and CTA button.

### 2. `src/components/SakuraPetals.jsx` — Petals From Branch Blossoms

Instead of spawning petals randomly across the top, each petal's `left` position will be clustered around the 5 blossom node X-coordinates (with small random offset). The `top` starting position will match the blossom Y-coordinates instead of `-20px`.

This makes petals appear to detach from the flowers naturally.

Reduce count from 22 to ~14 for elegance. Keep existing CSS keyframe animations (they already handle sway + rotation + fade).

### 3. `src/index.css` — Minor Additions

Add a `blossom-float` idle animation for blossoms (gentle up-down bob) that plays continuously, not just on hover. The hover glow animation already exists.

### 4. Section Cards — No Major Changes

The scroll sections below the hero stay the same. Only the hero visual changes.

---

## New Branch SVG Path Structure

```text
Left edge ──────► Center-right
                    ╱  sub-branch up (blossom 1)
Main trunk ────────┤
  (enters from     │── sub-branch (blossom 2)
   left at ~40%    ╲  sub-branch down (blossom 3)
   vertical)           ╲── small twig (blossom 4)
                            ╲── tip (blossom 5)
```

Node positions (% of hero container):
1. `{ x: 35, y: 25 }` — top sub-branch
2. `{ x: 55, y: 38 }` — mid-right
3. `{ x: 45, y: 55 }` — lower mid
4. `{ x: 70, y: 30 }` — far right upper
5. `{ x: 65, y: 60 }` — far right lower

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/HomePage.jsx` | Rewrite hero: horizontal branch SVG, mouse parallax, repositioned nodes, right-side text |
| `src/components/SakuraPetals.jsx` | Petals originate from blossom positions instead of random top |
| `src/index.css` | Add continuous `blossom-float` idle animation |

## What Stays the Same
- Navigation bar (top)
- Scroll sections below hero
- Click-to-scroll interaction
- Login/Signup routing
- All other pages untouched

