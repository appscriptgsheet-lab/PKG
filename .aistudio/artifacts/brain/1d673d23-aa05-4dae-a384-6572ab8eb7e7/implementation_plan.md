# Sistem Penilaian Kinerja Guru (PKG) & Supervisi MTs

Aplikasi komprehensif untuk evaluasi kinerja guru Madrasah Tsanawiyah (MTs) berbasis instrumen resmi Kementerian Agama/Kemendikbudristek (14 Kompetensi Pedagogik, Kepribadian, Sosial, dan Profesional serta Supervisi Administrasi & Observasi Pembelajaran), dilengkapi portal autentikasi terpisah untuk Tim Admin/Supervisor dan Guru yang dinilai, rekapitulasi otomatis (Nilai PKG, Konversi Skala 100, Angka Kredit PKG), dan integrasi basis data Google Sheets.

## User Review & Critical Decisions

> [!IMPORTANT]
> Pertanyaan klarifikasi telah diantisipasi dengan rekomendasi standar pendidikan madrasah (Kemenag/MTs):
> 1. **Mekanisme Database Google Sheets**: Aplikasi menyediakan konektivitas fleksibel ganda — sinkronisasi langsung dengan Google Sheets (via Google Sheet ID & Web Connector/Google API) serta cadangan lokal browser (IndexedDB/LocalStorage) dengan tombol sinkronisasi real-time dan ekspor/impor file `.xlsx`/`.csv`.
> 2. **Instrumen Evaluasi**: Mengacu pada format standar PKG MTs (14 Kompetensi Guru Mata Pelajaran/Bimbingan Konseling) plus instrumen Supervisi Akademik (Telaah Modul Ajar/RPP dan Supervisi Observasi PBM di Kelas).
> 3. **Autentikasi Terpisah**: Sistem login role-based independen (Admin/Kepala Madrasah/Pengawas vs Guru Yang Dinilai) menggunakan kredensial NIP/Akun dan PIN/Password, ditambah opsi Google Sign-In terintegrasi.

- **Admin/Penilai/Kepala MTs**: Akses penuh manajemen data guru, input instrumen PKG 14 kompetensi, input supervisi kelas & administrasi, penentuan jadwal supervisi, verifikasi bukti fisik, rekapitulasi otomatis, penetapan angka kredit, dan cetak laporan/ekspor ke Google Sheets.
- **Guru yang Dinilai**: Akses personal mandiri untuk melihat biodata tugas mengajar, mengunggah/mengecek tautan bukti fisik (RPP/Modul Ajar, Silabus, Penilaian Siswa), melihat hasil supervisi & catatan tindak lanjut, melihat rekap skor PKG, serta mengajukan refleksi diri.

---

## 1. Overview & Core Concept

- **What It Does**: Memfasilitasi proses evaluasi guru madrasah secara terstruktur mulai dari perencanaan supervisi, penilaian berkas modul/administrasi, observasi proses belajar mengajar di kelas (PBM), penilaian 14 kompetensi PKG, perhitungan matematis otomatis rumus PKG (Persentase Skor -> Nilai PKG 100 -> Kategori Predikat -> Konversi Angka Kredit tahunan), hingga pelaporan rekapitulasi dan sinkronisasi ke lembar kerja Google Sheets.
- **Target Audience / Persona**:
  - *Kepala Madrasah & Tim Penilai/Supervisor MTs*: Menilai objektif, mengisi rubrik indikator, memberikan catatan perbaikan/rekomendasi supervisi, dan mencetak lembar instrumen format Kemenag.
  - *Guru MTs (Mata Pelajaran Umum & Agama)*: Meninjau instrumen penilaian, memantau skor ketercapaian, mencermati catatan umpan balik supervisor, dan memantau Angka Kredit (AK).
- **Key Value**: Menggantikan berkas XLSM manual yang rawan rusak formula dengan antarmuka web modern yang responsif, validasi data otomatis, bebas eror rumus, sinkron ke Google Sheet madrasah, dan laporan siap cetak (PDF/Print-friendly format resmi PKG).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Autentikasi & Seleksi Peran**:
   - Pengguna memilih portal login: **Portal Admin & Penilai** atau **Portal Guru Yang Dinilai**.
   - Dilengkapi kredensial demo sekali-klik (misal: Kepala Madrasah / NIP Penilai dan Akun Guru MTs) untuk kemudahan evaluasi langsung.
2. **Dashboard Khusus Sesuai Peran**:
   - *Tampilan Admin*: Kartu rekapitulasi total guru dinilai, progress supervisi, rata-rata skor PKG madrasah, status sinkronisasi Google Sheets, dan tabel ringkasan guru yang dinilai.
   - *Tampilan Guru*: Ringkasan skor PKG pribadi, status supervisi kelas, grafik ketercapaian 14 kompetensi, serta daftar rekomendasi perbaikan dari kepala madrasah.
3. **Menu Penilaian Kinerja Guru (PKG 14 Kompetensi)**:
   - Evaluator memilih guru yang dinilai.
   - Menampilkan 4 domain standar (Pedagogik [Komp 1-7], Kepribadian [Komp 8-10], Sosial [Komp 11-12], Profesional [Komp 13-14]).
   - Setiap kompetensi memiliki indikator perilaku terperinci (Skor 0 = Tidak Terpenuhi, 1 = Terpenuhi Sebagian, 2 = Terpenuhi Seluruhnya).
   - Perhitungan otomatis nilai per kompetensi, nilai total PKG (maks 56), konversi persentase, dan klasifikasi predikat (Amat Baik: 91-100%, Baik: 76-90%, Cukup: 61-75%, Sedang: 51-60%, Kurang: <51%).
4. **Menu Supervisi Pembelajaran & Akademik**:
   - Sub-menu 1: *Supervisi Administrasi Perencanaan Pembelajaran* (Telaah RPP / Modul Ajar, Prota, Promes, Alur Tujuan Pembelajaran / Silabus, Kriteria Ketuntasan, dsb).
   - Sub-menu 2: *Supervisi Pelaksanaan Pembelajaran (Observasi Kelas)*: Kegiatan pendahuluan, inti (metode, media, keterlibatan peserta didik), dan penutup.
   - Sub-menu 3: *Umpan Balik & Tindak Lanjut Supervisi*: Catatan temuan, solusi pembinaan, dan target perbaikan.
5. **Menu Guru yang Dinilai (Database & Portofolio Guru)**:
   - Daftar guru MTs (Nama, NIP/NUPTK, Pangkat/Golongan, Mata Pelajaran, Tugas Tambahan seperti Wali Kelas/Waka/Kepala Lab).
   - Modal detail guru dengan riwayat penilaian dari tahun ke tahun.
   - Form tambah/edit guru dengan validasi data.
6. **Menu Rekapitulasi Otomatis & Cetak Laporan**:
   - Tabel rekapitulasi lengkap seluruh guru dengan kolom: No, Nama Guru, NIP, Golongan/Ruang, Tugas Tambahan, Nilai PKG, Nilai Supervisi, Predikat, dan Estimasi Angka Kredit Tahunan.
   - Filter berdasarkan mata pelajaran, status penilaian (Selesai/Belum), atau predikat.
   - Fitur Ekspor ke Google Sheet, Download CSV/Excel, dan tombol Pratinjau Cetak Format Resmi (Cover, Identitas, Format 1B/1C/1D standar PKG).
7. **Integrasi & Pengaturan Google Sheets**:
   - Modal konfigurasi Google Sheets: Masukkan Spreadsheet ID atau URL Google Apps Script Web App.
   - Tombol "Tarik Data dari Sheet" dan "Kirim/Sinkronkan Rekap ke Sheet".
   - Dokumentasi struktur kolom Google Sheet yang kompatibel langsung dengan template XLSM.

### Visual Identity & Theme

- **Aesthetic Direction**: *Educational Administrative SaaS* — bersih, profesional, terstruktur rapi, mencerminkan integritas madrasah kementerian agama.
- **Color Palette**:
  - Dominan Kanvas: Netral sejuk `#F8FAFC` (Slate 50) dengan kartu putih bersih `#FFFFFF`.
  - Warna Primer & Aksen: Deep Islamic Green / Emerald Kemenag (`#059669` / `#047857`) dipadukan dengan Navy Slate (`#0F172A`) untuk kesan institusional yang tepercaya.
  - Warna Indikator Kategori: Emerald untuk 'Amat Baik', Blue untuk 'Baik', Amber untuk 'Cukup', Rose untuk 'Kurang'.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` dengan visual weight tegas (SemiBold 600, Bold 700).
  - Body Text: `Plus Jakarta Sans` / `Public Sans` untuk keterbacaan tinggi formulir dan rubrik penilaian.
  - Tabular & Skor: Font monospace tabular (`font-mono tabular-nums`) untuk skor, NIP, dan angka kredit agar sejajar sempurna.
- **Spatial Presence**:
  - Sidebar navigasi tetap (260px) di desktop dengan menu terorganisir per peran.
  - Container padding konsisten (min. 16px - 24px) dengan hairline border halus (`border-slate-200`).
  - Tidak ada pill badges dekoratif berlapis; status disajikan dalam label teks tipografis yang jelas.

---

## 3. Key Product Decisions & Trade-Offs

- **Sinkronisasi Google Sheet Dual-Mode (Direct + Export/Import + Web Connector)**:
  - *Pendekatan*: Menyediakan konektor Google Sheet dua arah yang dapat menerima Google Sheet ID / Web App Hook, didukung oleh parser format CSV/XLSX dan penyimpanan lokal reaktif. Jika Google Sheet belum dihubungkan, sistem tetap 100% berfungsi mandiri dan dapat dihubungkan kapan saja tanpa kehilangan data.
  - *Alasan*: Sekolah atau madrasah memiliki tingkat izin akun Google yang berbeda-beda; dukungan multi-metode menjamin aplikasi selalu dapat digunakan tanpa hambatan otorisasi GCP.
- **Struktur Rubrik Penilaian Standar PKG 14 Kompetensi**:
  - *Pendekatan*: Mengadopsi buku pedoman resmi PKG Kementerian Pendidikan dan Kebudayaan & Ditjen Pendis Kemenag untuk guru kelas/mata pelajaran.
  - *Alasan*: Memastikan perhitungan dan butir evaluasi 100% valid secara administratif untuk kenaikan pangkat dan SKP guru.
- **Autentikasi Terpisah dengan Role Guard**:
  - *Pendekatan*: Context autentikasi berbasis sesi dengan pemisahan mutlak hak akses (`admin` vs `guru`). Guru hanya dapat membaca skor dan mengisi dokumen miliknya sendiri, sedangkan Admin berwenang menginput nilai evaluasi dan melakukan verifikasi rekapitulasi.
  - *Alasan*: Menjamin kerahasiaan dan integritas data penilaian kinerja.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SIPKG-MTs APPLICATION                           │
└────────────────────────────────────────────────────────────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │     Portal Admin      │                 │      Portal Guru      │
   │ (Kepala / Tim Penilai)│                 │   (Guru Yang Dinilai) │
   └───────────┬───────────┘                 └───────────┬───────────┘
               │                                         │
               ├─────────────────────────────────────────┤
               ▼                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Core Feature Modules                          │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Manajemen Guru MTs          │ • Biodata, NIP, Golongan, Tugas       │
│ 2. Instrumen PKG (14 Komp)     │ • 4 Domain: Pedagogik, Kepribadian,   │
│                                │   Sosial, Profesional (Auto-Score)    │
│ 3. Supervisi Akademik & Kelas  │ • Telaah Modul/RPP, Observasi PBM,   │
│                                │   Catatan Umpan Balik & Tindak Lanjut │
│ 4. Rekapitulasi Otomatis       │ • Kalkulasi Nilai PKG, Konversi 100,  │
│                                │   Angka Kredit, Status Predikat       │
│ 5. Cetak Laporan & Berkas PKG  │ • Format Surat Resmi Kemenag / Cetak  │
│ 6. Google Sheet Data Connector │ • Sinkronisasi 2-Arah & Backup        │
└────────────────────────────────┴───────────────────────────────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │  Local State & Cache  │                 │  Google Sheets Engine │
   │  (Zustand / Reactive  │                 │  (Sheet ID / Web App  │
   │  Persistence Engine)  │                 │  REST API Sync)       │
   └───────────────────────┘                 └───────────────────────┘
```

### Data Models

```typescript
export interface Guru {
  id: string;
  nip: string;
  nuptk?: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  pangkatGolongan: string; // e.g., Penata Muda / III/a
  jabatan: string; // Guru Muda, Guru Madya, dll
  mataPelajaran: string;
  tugasTambahan?: string; // Wali Kelas, Kepala Lab, dsb
  nomorHP?: string;
  statusPenilaian: 'Belum Dinilai' | 'Dalam Proses' | 'Selesai';
}

export interface NilaiKompetensi {
  kompetensiId: number; // 1 s/d 14
  namaKompetensi: string;
  domain: 'Pedagogik' | 'Kepribadian' | 'Sosial' | 'Profesional';
  skorMaksimal: number;
  skorDiperoleh: number; // Jumlah skor indikator (0, 1, 2)
  persentase: number;
  skorStandar: 1 | 2 | 3 | 4; // Konversi skala 1-4 per kompetensi
}

export interface SupervisiAkademik {
  guruId: string;
  tanggalSupervisi: string;
  supervisorNama: string;
  semester: 'Ganjil' | 'Genap';
  tahunPelajaran: string;
  telaahRPP: {
    skorTotal: number;
    skorMaksimal: number;
    kategori: string;
    catatan: string;
  };
  observasiKelas: {
    skorTotal: number;
    skorMaksimal: number;
    kategori: string;
    catatan: string;
  };
  tindakLanjut: string;
}

export interface RekapitulasiPKG {
  guruId: string;
  tahun: string;
  skorMentahPKG: number; // maks 56
  nilaiPKG100: number; // (skorMentah / 56) * 100
  sebutan: 'Amat Baik' | 'Baik' | 'Cukup' | 'Sedang' | 'Kurang';
  persentaseKinerja: number; // 125%, 100%, 75%, 50%, 25%
  angkaKreditTahunan: number; // Rumus: ((AKK - AKPKB - AKP) * (JM / JWM) * NPK) / 4
}
```

---

## 5. Implementation Steps

1. **Konfigurasi State & Database**:
   - Skema data master guru MTs, 14 kompetensi PKG lengkap indikator penilaian, dan instrumen supervisi telaah RPP serta observasi kelas.
   - Engine kalkulasi rumus resmi PKG dan Angka Kredit.
   - Connector sinkronisasi Google Sheet (Sheet ID & Google API / Apps Script sync).
2. **Sistem Autentikasi & Navigasi**:
   - Switcher peran Admin (Kepala MTs / Supervisor) dan Guru Yang Dinilai dengan akun bawaan instan untuk pengujian langsung.
   - Header dan Sidebar responsif dengan kontrak top-bar yang bersih.
3. **Modul Supervisi Akademik**:
   - Form telaah RPP/Modul Ajar dengan rubrik terinci (tujuan, kegiatan, asesmen).
   - Form observasi proses belajar mengajar (PBM) di ruang kelas.
   - Lembar kesimpulan & rekomendasi tindak lanjut pembinaan.
4. **Modul Penilaian Kinerja Guru (PKG 14 Kompetensi)**:
   - Formulir terstruktur 4 domain kompetensi dengan toggle indikator (0, 1, 2).
   - Real-time calculator skor total dan preview konversi predikat.
5. **Modul Guru yang Dinilai**:
   - Halaman daftar dan manajemen profil guru untuk Admin.
   - Portal Guru untuk mengecek hasil nilai, mencetak lembar evaluasi, dan mengunggah catatan mandiri.
6. **Modul Rekapitulasi Otomatis & Cetak Resmi**:
   - Tabel rekapitulasi interaktif dengan filter pencarian dan pengurutan ranking.
   - Pratinjau cetak lembar format resmi PKG & Supervisi siap print/PDF (kertas A4).
   - Fitur ekspor/sinkronisasi ke Google Sheet dengan panduan integrasi sheet.
