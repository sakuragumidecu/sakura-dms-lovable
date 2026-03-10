
# Plan: Complete TSX to JSX Migration and Cleanup

## Scope
Convert all remaining `.tsx`/`.ts` files to `.jsx`/`.js` and delete old TypeScript files. There are ~45 files to handle.

## Files to Convert (new JSX created)

### Pages (2 remaining without .jsx)
1. `src/pages/ArchivePage.tsx` → `src/pages/ArchivePage.jsx` (523 lines - remove `type` imports, typed state generics)
2. `src/pages/DashboardPage.tsx` → `src/pages/DashboardPage.jsx` (476 lines - remove `type TabKey`, typed props on sub-components)

### Components (4 remaining without .jsx)
3. `src/components/dashboard/ActivityChart.tsx` → `src/components/dashboard/ActivityChart.jsx` (390 lines - remove `interface Props`, `Period` type, `Record<>` generics)
4. `src/components/modals/PdfPreviewOverlay.tsx` → `src/components/modals/PdfPreviewOverlay.jsx` (312 lines - remove `interface Props`, typed state)
5. `src/components/scan/CameraScanModal.tsx` → `src/components/scan/CameraScanModal.jsx` (336 lines - remove `interface ScanPage`, `CameraScanModalProps`)
6. `src/components/upload/UploadForm.tsx` → `src/components/upload/UploadForm.jsx` (483 lines - remove `interface UploadFormProps`, typed refs)

### Shadcn UI Components (30 files, all follow same pattern: remove `React.forwardRef<>` generics, `ComponentPropsWithoutRef`)
7-36. All `.tsx` files in `src/components/ui/` that don't already have `.jsx` counterparts:
`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`

### Hooks/Other TS files
37. `src/hooks/use-toast.ts` → already has `.js` counterpart
38. `src/components/ui/use-toast.ts` → already has `.js` counterpart

## Files to Delete (all old .tsx/.ts files)
After creating all `.jsx` counterparts, delete every `.tsx` and `.ts` file:
- All pages: `ApprovalPage.tsx`, `ArchivePage.tsx`, `DashboardPage.tsx`, `HomePage.tsx`, `Index.tsx`, `LoginPage.tsx`, `LogPage.tsx`, `NotFound.tsx`, `OtpPage.tsx`, `PlaceholderPage.tsx`, `RoleManagementPage.tsx`, `SettingsPage.tsx`, `SignUpPage.tsx`, `UploadPage.tsx`, `UserManagementPage.tsx`, `VerifyPage.tsx`
- All components: `NavLink.tsx`, `AppHeader.tsx`, `AppLayout.tsx`, `AppSidebar.tsx`, `DashboardCard.tsx`, `ActivityChart.tsx`, `DocumentDetailModal.tsx`, `DocumentListModal.tsx`, `PdfPreviewOverlay.tsx`, `UserProfileModal.tsx`, `CameraScanModal.tsx`, `UploadForm.tsx`
- All UI: every `.tsx` file in `src/components/ui/`
- Contexts: `AppContext.tsx`, `SettingsContext.tsx`
- Hooks: `use-mobile.tsx`, `use-toast.ts`
- Data: `mockData.ts`
- Lib: `utils.ts`
- Root: `App.tsx`, `main.tsx`, `vite-env.d.ts`
- Config: `tsconfig.app.json`, `tsconfig.node.json` (keep `tsconfig.json` minimal or remove)

## Conversion Pattern
For each file, the transformation is mechanical:
- Remove `import type { ... }` → regular import or remove if unused
- Remove `interface` / `type` declarations
- `React.forwardRef<HTMLElement, Props>(...)` → `React.forwardRef((...) => ...)`
- `React.ComponentPropsWithoutRef<typeof X>` → removed from params
- `useState<Type>(init)` → `useState(init)`
- Typed function params `(x: Type)` → `(x)`
- `as const` assertions → removed

## Config Updates
- Update `vite.config` if it references `.ts` extensions
- Remove or simplify `tsconfig.json` files since TS is no longer used

## Constraints
- No UI, layout, color, or logic changes
- All imports resolve correctly (`.jsx` files don't need explicit extensions in Vite)
- Functionality remains identical
