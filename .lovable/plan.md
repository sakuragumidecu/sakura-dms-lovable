

# Plan: Update Upload Module to Match MySQL Schema

## Overview
Replace the hardcoded category/document-type data with a new schema-aligned data structure that mirrors the MySQL tables (`categories`, `document_types`, `document_counters`, `folders`). Add auto-generation of document numbers using prefix/year/sequence format. Update folder structure to match categories.

Since there's no backend API connected yet, I'll create the schema-aligned mock data that mirrors the MySQL tables exactly, so when the backend is ready, you just swap mock imports for API calls.

## Files to Change

### 1. `src/data/mockData.js` — Replace category/type constants with schema-aligned tables

Replace `KATEGORI_OPTIONS`, `KATEGORI_JENIS_MAP`, and `KATEGORI_DETAIL_FIELDS` with:

```javascript
// Mirror of `categories` table
export const CATEGORIES = [
  { category_id: 1, category_name: "Data Siswa" },
  { category_id: 2, category_name: "Data Guru" },
  { category_id: 3, category_name: "Sarana Prasarana" },
  { category_id: 4, category_name: "Surat Menyurat" },
];

// Mirror of `document_types` table
export const DOCUMENT_TYPES = [
  { type_id: 1, category_id: 1, type_name: "Buku Klapper", code_prefix: "BKL" },
  { type_id: 2, category_id: 1, type_name: "Buku Induk Register Peserta Didik", code_prefix: "BIR" },
  { type_id: 3, category_id: 1, type_name: "Surat Keterangan Hasil Ujian (SKHU)", code_prefix: "SKH" },
  { type_id: 4, category_id: 1, type_name: "Ijazah SMP", code_prefix: "IJZ" },
  { type_id: 5, category_id: 2, type_name: "Buku Induk Pegawai", code_prefix: "BIP" },
  { type_id: 6, category_id: 2, type_name: "Sertifikat Pendidik", code_prefix: "SRP" },
  { type_id: 7, category_id: 2, type_name: "Catatan Diklat", code_prefix: "CDK" },
  { type_id: 8, category_id: 3, type_name: "Buku Inventaris Barang dan Penghapusan Barang", code_prefix: "BIB" },
  { type_id: 9, category_id: 3, type_name: "Buku Pemeliharaan & Perbaikan", code_prefix: "BPP" },
  { type_id: 10, category_id: 4, type_name: "Buku Agenda Surat Masuk", code_prefix: "ASM" },
  { type_id: 11, category_id: 4, type_name: "Buku Agenda Surat Keluar", code_prefix: "ASK" },
  { type_id: 12, category_id: 4, type_name: "Kumpulan Surat Keputusan (SK)", code_prefix: "KSK" },
];

// Mirror of `document_counters` table (mutable state)
export const INITIAL_DOCUMENT_COUNTERS = [];

// Mirror of `folders` table
export const FOLDERS = [
  { folder_id: 1, folder_name: "Data Siswa", parent_id: null },
  { folder_id: 2, folder_name: "Data Guru", parent_id: null },
  { folder_id: 3, folder_name: "Sarana Prasarana", parent_id: null },
  { folder_id: 4, folder_name: "Surat Menyurat", parent_id: null },
];
```

Also update existing `DOCUMENTS` mock data to include `category_id`, `type_id`, `folder_id` fields. Keep `KATEGORI_OPTIONS` as a derived export for backward compatibility with ArchivePage.

### 2. `src/contexts/AppContext.jsx` — Add counter state + auto-number generator

- Add `documentCounters` state initialized from `INITIAL_DOCUMENT_COUNTERS`
- Add `generateDocumentNumber(typeId)` function that:
  1. Looks up `code_prefix` from `DOCUMENT_TYPES`
  2. Gets current year
  3. Finds/creates counter entry, increments sequence
  4. Returns formatted `PREFIX/YEAR/001`
- Add `getFolderForCategory(categoryId)` helper
- Update `uploadDocument` to accept `category_id`, `type_id`, auto-assign `folder_id`

### 3. `src/components/upload/UploadForm.jsx` — Update dropdowns + auto-number

- Replace `KATEGORI_OPTIONS` import with `CATEGORIES`
- Replace `KATEGORI_JENIS_MAP` import with `DOCUMENT_TYPES`
- Category dropdown renders from `CATEGORIES` array
- Jenis Dokumen dropdown filters `DOCUMENT_TYPES` by selected `category_id`
- When a document type is selected, auto-generate `nomorDokumen` via `generateDocumentNumber()`
- Make `nomorDokumen` field read-only (auto-generated)
- Remove "Lainnya" option from Kategori (only 4 fixed categories per schema)
- Remove `customKategori` state (no longer needed)
- Auto-set `folderTujuan` based on selected category → matching folder
- On submit, pass `category_id`, `type_id`, `folder_id` to `uploadDocument`

### 4. `src/pages/ArchivePage.jsx` — Update category filter

- Derive `KATEGORI_OPTIONS` from `CATEGORIES` for the filter dropdown (backward compatible)

## What stays the same
- All UI layout, colors, fonts, spacing, component structure
- Existing document display, approval flow, audit trail
- All other pages untouched
- `buildFolderTree` / `docMatchesFolder` helpers (updated to also work with new folder structure)

## Sequence
1. Update `mockData.js` with new schema data
2. Update `AppContext.jsx` with counter logic
3. Update `UploadForm.jsx` with new dropdown binding + auto-number
4. Update `ArchivePage.jsx` category filter import

