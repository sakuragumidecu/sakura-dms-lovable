

## Plan: Multi-Feature Enhancement for SAKURA App

This plan covers 4 major features across ~12 files. No changes to homepage, hero, petals, or branch.

---

### Feature 1 — Document Detail: "Lokasi" Field with Navigation

**Files to modify:**
- `src/components/modals/DocumentDetailModal.jsx` — Add a "Lokasi" row after existing detail grid showing a clickable folder pill (Lucide `Folder` icon + `doc.kategori`). On click, `navigate('/archive?kategori=' + doc.kategori)`.
- `src/pages/ArchivePage.jsx` — On mount, read `searchParams.get('kategori')` and auto-select/filter that category in the folder tree.

---

### Feature 2 — Sidebar Dropdown + Approval Redesign + Upload Restriction

**2A — Sidebar Persetujuan Dropdown**

Modify `src/components/layout/AppSidebar.jsx`:
- Replace the single "Persetujuan" nav item with a collapsible group containing two sub-items: "Pending" (`/approval/pending`) and "Disetujui" (`/approval/approved`).
- Show pending document count badge on "Pending" sub-item.
- Use `useState` for expand/collapse with `max-height` CSS transition.
- In collapsed sidebar mode, keep single icon behavior.

**2B — Pending Approval Page Redesign**

Create `src/pages/ApprovalPendingPage.jsx`:
- Top: 3-step horizontal flow diagram (Upload → Review → Approved/Rejected) with styled circles and arrows.
- Note: "Hanya Operator TU yang dapat mengunggah dokumen"
- Full-width document cards with: uploader info + role badge, urgent badge (if `doc.urgent`), document title, tag pills, notes box (left-bordered), and action buttons (Lihat Detail, Setujui, Tolak).

Create `src/pages/ApprovalApprovedPage.jsx`:
- Simple list of approved/archived/rejected documents reusing existing "recent decisions" pattern.

**2C — Upload Restriction**

Modify `src/pages/UploadPage.jsx`:
- If `currentUser.role !== "Operator/TU"`, show info banner with restriction message and disable the form submit button.

**Routing:** Update `src/App.jsx` to add routes `/approval/pending` and `/approval/approved`, redirect `/approval` to `/approval/pending`.

---

### Feature 3 — Urgent Flag on Upload

Modify `src/components/upload/UploadForm.jsx`:
- Add an "Tandai sebagai Urgent" toggle (using existing Switch component or custom toggle) at the top of the form before the file upload section.
- When ON, show amber warning notice below.
- Store `isUrgent` in form state; include `urgent: true/false` in `uploadDocument()` call.

Modify `src/contexts/AppContext.jsx` — `uploadDocument` already spreads the doc object, so `urgent` will be preserved automatically.

The pending approval cards (Feature 2B) will read `doc.urgent` to display the URGENT badge.

---

### Feature 4 — Auth Changes: Remove Google/OTP + Admin Approval

**4A — Remove Google Login + OTP**

Modify `src/pages/LoginPage.jsx`:
- Remove Google button, divider, and `handleGoogleLogin`.
- Remove OTP step: `handleLogin` calls `login(email)` directly → navigate to `/dashboard`.
- Remove `OtpPage` import.

`src/pages/OtpPage.jsx` — Keep file but it becomes unreachable (no deletion needed).

**4B — Teacher Signup with NIP + Pending Approval**

Modify `src/pages/SignUpPage.jsx`:
- Restructure form: Nama, NIP (18 digits, required, with validation), Email, Departemen (dropdown of subjects), Password, Konfirmasi Password.
- On submit: add user to context with `status: "menunggu_approval"` via new `registerUser` function.
- Success page: hourglass icon, "Pendaftaran Berhasil!", message about waiting for Operator TU approval, "Kembali ke Beranda" button.

Modify `src/contexts/AppContext.jsx`:
- Add `registerUser(userData)` that creates user with `status: "menunggu_approval"`.
- Add `activateUser(userId)` and `rejectRegistration(userId)` functions.
- Modify `login()`: check if user has `status === "menunggu_approval"` and return a specific error.
- Add `pendingUsers` derived state (users with `status === "menunggu_approval"`).

**4C — NIP-based Document Access**

Modify document filtering logic in archive/document list pages:
- Documents with `sensitif: true` only visible if `doc.ownerNIP === currentUser.nip` or user is Operator/TU.
- Show lock icon on sensitive documents.
- Access denied message for unauthorized access attempts.

Modify `src/components/upload/UploadForm.jsx`:
- Add "Dokumen Sensitif" toggle after Urgent toggle.
- When ON, show "NIP Pemilik Dokumen" input field.
- Include `sensitif: true` and `ownerNIP` in upload data.

**4D — User Management: Approval Queue**

Modify `src/pages/UserManagementPage.jsx`:
- Split into two sections with divider.
- Section 1 (top): "Menunggu Persetujuan" — pending user cards with amber styling, Aktifkan/Tolak buttons, confirmation dialog.
- Section 2 (bottom): "Pengguna Aktif" — existing table with green "Aktif" dot added.

---

### Summary of Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/modals/DocumentDetailModal.jsx` | Add Lokasi field |
| `src/pages/ArchivePage.jsx` | Read kategori query param |
| `src/components/layout/AppSidebar.jsx` | Collapsible Persetujuan dropdown |
| `src/pages/ApprovalPendingPage.jsx` | **Create** — redesigned pending page |
| `src/pages/ApprovalApprovedPage.jsx` | **Create** — approved list page |
| `src/pages/ApprovalPage.jsx` | Redirect to /approval/pending |
| `src/App.jsx` | Add new approval routes |
| `src/pages/UploadPage.jsx` | Role restriction banner |
| `src/components/upload/UploadForm.jsx` | Urgent + Sensitif toggles |
| `src/pages/LoginPage.jsx` | Remove Google + OTP |
| `src/pages/SignUpPage.jsx` | NIP validation + pending approval flow |
| `src/contexts/AppContext.jsx` | registerUser, activateUser, login check |
| `src/pages/UserManagementPage.jsx` | Approval queue section |
| `src/data/mockData.js` | Add status field to USERS |

