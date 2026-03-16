

# Plan: Modernisasi UI/UX SAKURA DMS — Full Redesign

## Overview

Redesign menyeluruh UI/UX SAKURA DMS dengan font Poppins, palet warna baru (deep purple/maroon), animasi kelopak sakura di Home, dark mode toggle, dan perbaikan UX di semua halaman. Semua business logic, RBAC, dan data flow tetap tidak berubah.

---

## Phase 1: Design Foundation

### 1a. Font & Color Tokens

**Files**: `index.css`, `tailwind.config.js`

- Ganti font Inter → **Poppins** (weight 300/400/500/600/700)
- Update CSS variables:
  - Primary: `#602080` (deep purple) → HSL `~270 60% 31%`
  - Sidebar bg: `#5e2730` (deep maroon) → HSL `~350 42% 26%`
  - Accent shades: `#B030B0`, `#8F1383`, `#E47676`
  - Main bg: `#F9FAFB`, Card: `#FFFFFF`
- Add dark mode variables (sudah ada partial, perlu update ke palet baru)
- Add `--sakura-purple`, `--sakura-maroon` custom tokens

### 1b. Dark Mode Toggle

**File**: `src/pages/SettingsPage.jsx`, `src/contexts/SettingsContext.jsx`

- Dark mode toggle sudah ada di Settings (tema section). Pastikan applies `dark` class ke `<html>` element
- Verify all dark mode CSS variables match new palette

---

## Phase 2: Home Page — Sakura Petal Animation

**File**: `src/pages/HomePage.jsx`

- Full redesign layout:
  - **Left side**: Logo SAKURA + full acronym text ("Secure Archiving and Keeping of Unified Records for Administration") — displayed only on Home
  - Deskripsi sekolah + gambar sekolah placeholder
  - CTA buttons: Login / Signup (pojok kanan atas nav)
- **Center-right**: Sakura branch illustration (copy uploaded image `image-21.png` to `src/assets/sakura_branch.png`)
- **Petal animation**: CSS keyframe particle system — 15-20 floating petal elements with randomized fall paths, opacity, rotation, size. Reduced-motion media query disables animation
- **No footer** on Home page (per requirement)
- Inspiration from sutera.ch: clean typography, generous whitespace, artistic visual centerpiece

### Technical: Petal Animation
```text
Component: SakuraPetals.jsx
- Renders 15-20 absolute-positioned petal <div>s
- Each petal: random size (8-16px), random starting X position, 
  random animation-duration (6-12s), random animation-delay
- CSS keyframes: fall from top with slight horizontal sway + rotation
- @media (prefers-reduced-motion: reduce) → display: none
- Optional toggle in Settings (reduced-motion preference)
```

---

## Phase 3: Login / Signup Redesign

**Files**: `src/pages/LoginPage.jsx`, `src/pages/SignUpPage.jsx`

- Keep split-panel layout, update colors to new purple/maroon palette
- Left panel: gradient maroon/purple with SAKURA branding
- Right panel: clean form with new styling
- Google OAuth button (simulasi, sudah ada)
- Footer: `© 2026 SAKURA · Developed by Group 5` (tampil di login/signup)

---

## Phase 4: Sidebar & Header

**File**: `src/components/layout/AppSidebar.jsx`

- Update colors to new maroon sidebar (`#5e2730`)
- Keep icon-above-label layout (sudah ada)
- Sidebar sticky (`position: sticky; top: 0; height: 100vh`)
- Collapse/expand button aligned with logo (sudah ada)
- Settings item with separator (sudah ada)

**File**: `src/components/layout/AppHeader.jsx`

- Update styling to match new palette
- Profile dropdown (sudah ada) — no changes needed except color update

---

## Phase 5: Dashboard

**File**: `src/pages/DashboardPage.jsx`, `src/components/dashboard/ActivityChart.jsx`

- Update hero greeting to new palette
- Summary cards: add "Ditolak" card (sudah ada with 5 cards)
- **Chart changes**:
  - Only 3 lines: Disetujui, Menunggu, Ditolak (remove Upload/Persetujuan lines)
  - Remove "Pilih Tanggal" global → replace with range selector (Weekly: pick start date → auto 7 days; Monthly: pick month)
  - Click on chart point → modal with document list for that date + status
  - Click legend → toggle line visibility (sudah ada)
- Bottom sections: Dokumen Terbaru + Aktivitas Terbaru (sudah ada, update styling)

---

## Phase 6: Upload Form

**File**: `src/components/upload/UploadForm.jsx`

- **Field visibility**: Hide detail fields until Kategori + Jenis selected (sudah partially implemented)
- Ensure "Masukkan ke Folder" auto-fills from category/type mapping (sudah ada)
- Update styling to new palette
- Toast notifications on success (sudah ada)

---

## Phase 7: Archive Page

**File**: `src/pages/ArchivePage.jsx`

- Update styling to new palette
- Resizable folder tree (sudah ada with react-resizable-panels)
- Folder tree tooltip with name + description on hover (sudah ada)
- Admin CRUD: Create/Edit/Delete folder modals (sudah ada)
- Search filters: add date range filter, class filter
- Document grid: show status badge, uploader avatar, action buttons respecting RBAC

---

## Phase 8: Document Detail & Audit Trail

**File**: `src/components/modals/DocumentDetailModal.jsx`

- Audit trail entries with avatar, nama, jabatan, timestamp, action in Bahasa Indonesia
- QR Code: only when status = "Diarsipkan" — positioned bottom-right, medium size
- "Masukkan ke Arsip" button: visible when status = "Disetujui" for Operator/TU role
- Add "Syarat & Ketentuan Verifikasi QR" link below QR → modal explanation

---

## Phase 9: Footer

**File**: `src/components/layout/CopyrightFooter.jsx`

- Text: `© 2026 SAKURA · Developed by Group 5`
- Show on all pages **except** Home
- Keep pinned layout (sudah fixed)

---

## Files Changed Summary

```text
src/index.css                              — Poppins font, new HSL palette
tailwind.config.js                         — Updated design tokens
src/assets/sakura_branch.png               — New asset (from upload)
src/pages/HomePage.jsx                     — Full redesign with petal animation
src/components/SakuraPetals.jsx            — NEW: Petal particle component
src/pages/LoginPage.jsx                    — Color palette update
src/pages/SignUpPage.jsx                   — Color palette update
src/components/layout/AppSidebar.jsx       — Sticky sidebar, color update
src/components/layout/AppHeader.jsx        — Color update
src/components/layout/AppLayout.jsx        — Conditional footer
src/components/layout/CopyrightFooter.jsx  — Updated text
src/pages/DashboardPage.jsx               — Palette + chart changes
src/components/dashboard/ActivityChart.jsx — 3 lines only, range selector
src/components/dashboard/DashboardCard.jsx — Palette update
src/components/upload/UploadForm.jsx       — Palette + field visibility
src/pages/ArchivePage.jsx                  — Palette + search filters
src/components/modals/DocumentDetailModal.jsx — QR logic, archive button, audit trail
src/pages/SettingsPage.jsx                 — Dark mode integration check
src/contexts/SettingsContext.jsx           — Dark mode class toggle
```

### Implementation Order (8 implementation messages estimated)

1. Design tokens (index.css + tailwind.config.js + Poppins)
2. Home page + SakuraPetals component + sakura_branch asset
3. Login/Signup palette + Footer conditional logic
4. Sidebar + Header palette
5. Dashboard + Chart redesign (3 lines, range selector)
6. Upload form + Archive page palette
7. Document Detail (QR, archive button, audit trail)
8. Dark mode verification + responsive polish

