

## Plan: Codebase Consolidation & File Restructuring

Pure refactor — no UI, logic, or styling changes. Only move, merge, rename, and update imports.

---

### Merge 1: Sakura Animation Files → `src/components/sakura/SakuraBranch.jsx`

Create `src/components/sakura/SakuraBranch.jsx` containing:
- The full `SakuraBranch` SVG component (from current `src/components/SakuraBranch.jsx`)
- `FloatingParticles` (inlined as a named function — only used in HomePage.jsx)
- `PetalBurstOverlay` + `usePetalBurst` hook (from `src/components/home/PetalBurst.jsx`)
- Export: `default SakuraBranch`, named `FloatingParticles`, named `PetalBurstOverlay`, named `usePetalBurst`, named `FLOWER_NODES`

**Keep separate** (NOT merged):
- `FallingPetals.jsx` → move to `src/components/sakura/FallingPetals.jsx` (canvas-based, self-contained, used independently)
- `SakuraPetals.jsx` → move to `src/components/sakura/SakuraPetals.jsx` (used by LoginPage + SignUpPage, separate concern)

**Delete after merge:**
- `src/components/SakuraBranch.jsx`
- `src/components/FloatingParticles.jsx`
- `src/components/home/PetalBurst.jsx`
- `src/components/FallingPetals.jsx`
- `src/components/SakuraPetals.jsx`
- `src/components/SakuraPetalsFalling.jsx` (unused — no imports found)

**Update imports in:**
- `src/pages/HomePage.jsx` — all sakura imports point to `@/components/sakura/...`
- `src/pages/LoginPage.jsx` — SakuraPetals path
- `src/pages/SignUpPage.jsx` — SakuraPetals path

---

### Merge 2: Approval Pages → `src/pages/ApprovalPage.jsx`

Rewrite `ApprovalPage.jsx` to contain tab-based UI:
- `useState('pending')` for tab state
- `PendingList` — content from current `ApprovalPendingPage.jsx` as internal function
- `ApprovedList` — content from current `ApprovalApprovedPage.jsx` as internal function

**Delete:** `ApprovalPendingPage.jsx`, `ApprovalApprovedPage.jsx`

**Update `App.jsx` routes:**
- `/approval` → `<ApprovalPage />` (no redirect)
- `/approval/pending` → `<ApprovalPage />` (tab auto-set via URL)
- `/approval/approved` → `<ApprovalPage />` (tab auto-set via URL)
- Use `useLocation` inside ApprovalPage to determine active tab from path

**Update sidebar:** Links to `/approval/pending` and `/approval/approved` still work.

---

### Merge 3: Dashboard Pages → `src/pages/DashboardPage.jsx`

Merge `HomeDashboardPage.jsx` content into `DashboardPage.jsx`:
- Add a "Beranda" tab (or route check for `/home`) that renders the system info + school info cards.
- Alternatively, since `/home` route exists separately, simply keep DashboardPage as-is and move HomeDashboardPage content as an internal `BerandaTab` function.

**Delete:** `HomeDashboardPage.jsx`

**Update `App.jsx`:** Route `/home` now also uses `<DashboardPage />` with a prop or URL param.

---

### Merge 4: Layout Renames

- `AppSidebar.jsx` → `Sidebar.jsx` (same folder)
- `AppHeader.jsx` → `Header.jsx` (same folder)
- `AppLayout.jsx` → `Layout.jsx` (same folder, inline CopyrightFooter directly)

**Delete:** `CopyrightFooter.jsx`

**Update imports (14 files):**
- `Layout.jsx` — internal imports of `Sidebar`
- `App.jsx` — `import Layout from "@/components/layout/Layout.jsx"`
- All 13 pages importing AppHeader → `import Header from "@/components/layout/Header"`

---

### Merge 5: Modals Reorganization

**5A:** `DocumentDetailModal.jsx` + `DocumentListModal.jsx` → `src/components/document/DocumentDetail.jsx`
- DocumentListModal becomes an internal function `DocumentList`
- Export both: `default DocumentDetail`, named `DocumentList`

**5B:** `PdfPreviewOverlay.jsx` → `src/components/document/PdfPreview.jsx` (rename only)

**5C:** `UserProfileModal.jsx` → `src/components/shared/UserProfile.jsx` (rename only)

**5D:** `CameraScanModal.jsx` + `CropOverlay.jsx` → `src/components/shared/CameraScan.jsx` (merge CropOverlay inline)

**Delete:** entire `src/components/modals/` and `src/components/scan/` folders

**Update imports in:** DashboardPage, ArchivePage, ApprovalPage, UploadForm, UserManagementPage

---

### Merge 6: Home Sections → `FeaturesSection.jsx`

Merge `ArchiveSection.jsx` + `WorkflowSection.jsx` + `SecuritySection.jsx` → `src/components/home/FeaturesSection.jsx`

Each becomes a `const` inside the file. Single default export `FeaturesSection` rendering all three.

**Keep separate:** `AboutSection.jsx`, `SchoolSection.jsx` (distinct enough)

**Delete:** `ArchiveSection.jsx`, `WorkflowSection.jsx`, `SecuritySection.jsx`

**Update `HomePage.jsx`:** Replace 3 imports with single `FeaturesSection` import.

---

### Delete Unused Files

- `OtpPage.jsx` — no imports found
- `PlaceholderPage.jsx` — no imports found (only self-imports AppHeader)
- `NavLink.jsx` — only imported by itself, never used elsewhere

---

### Upload Form: Keep Separate (adjusted from plan)

UploadForm.jsx is 677 lines + OcrScanner is 223 lines. Too large to inline.

- Move `src/components/upload/UploadForm.jsx` → `src/components/document/UploadForm.jsx`
- Move `src/components/upload/OcrScanner.jsx` → `src/components/document/OcrScanner.jsx`
- Delete `src/components/upload/` folder
- Update imports in `UploadPage.jsx` and `ArchivePage.jsx`

---

### Final Structure

```text
src/components/
  dashboard/        (2 files — unchanged)
  document/         (4 files: DocumentDetail, PdfPreview, UploadForm, OcrScanner)
  home/             (3 files: AboutSection, FeaturesSection, SchoolSection)
  layout/           (3 files: Layout, Sidebar, Header)
  sakura/           (3 files: SakuraBranch, FallingPetals, SakuraPetals)
  shared/           (2 files: UserProfile, CameraScan)
  ui/               (shadcn — untouched)

src/pages/          (12 files)
  HomePage, LoginPage, SignUpPage, DashboardPage,
  UploadPage, ArchivePage, ApprovalPage,
  UserManagementPage, RoleManagementPage, LogPage,
  SettingsPage, ProfilePage, ChangePasswordPage,
  VerifyPage, NotFound
```

~15 non-shadcn component files, ~15 page files. All functionality preserved.

