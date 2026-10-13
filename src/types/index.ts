export type UserRole = 'admin' | 'guru';

export interface UserSession {
  role: UserRole;
  guruId?: string; // jika role 'guru'
  nama: string;
  nip?: string;
  jabatan?: string;
}

export interface Guru {
  id: string;
  nip: string;
  nuptk?: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  pangkatGolongan: string; // misal: Penata Muda / III/a, Penata / III/c, Pembina / IV/a
  jabatan: string; // Guru Pertama, Guru Muda, Guru Madya, Guru Utama
  mataPelajaran: string;
  tugasTambahan?: string; // Kepala Laboratorium, Kepala Perpustakaan, Wali Kelas, Waka Kurikulum
  pendidikanTerakhir: string;
  tmtGuru?: string;
  nomorHP?: string;
  email?: string;
  jamMengajarMinggu: number; // default 24 jam
  statusPenilaian: 'Belum Dinilai' | 'Dalam Proses' | 'Selesai';
  dokumenBukti?: {
    nama: string;
    tipe: string;
    url: string;
    tanggalUnggah: string;
  }[];
}

export type DomainKompetensi = 'Pedagogik' | 'Kepribadian' | 'Sosial' | 'Profesional';

export interface IndikatorKompetensi {
  id: number;
  pernyataan: string;
}

export interface DefinisiKompetensi {
  id: number; // 1 s/d 14
  nomor: number;
  nama: string;
  domain: DomainKompetensi;
  deskripsi: string;
  indikator: IndikatorKompetensi[];
}

export interface SkorKompetensiGuru {
  kompetensiId: number;
  skorIndikator: Record<number, 0 | 1 | 2>; // id indikator -> skor (0: tidak ada, 1: sebagian, 2: lengkap)
  totalSkorMentah: number;
  skorMaksimalMentah: number;
  persentase: number;
  skorStandar: 1 | 2 | 3 | 4; // skala 1-4 per kompetensi
}

export interface PenilaianPKGGuru {
  guruId: string;
  tahun: string;
  tanggalPenilaian: string;
  penilaiNama: string;
  penilaiNip: string;
  skorPerKompetensi: Record<number, SkorKompetensiGuru>;
  totalSkorPKG: number; // Maks 56
  nilaiPKG100: number; // (totalSkorPKG / 56) * 100
  sebutan: 'Amat Baik' | 'Baik' | 'Cukup' | 'Sedang' | 'Kurang';
  persentaseKinerja: number; // 125, 100, 75, 50, 25
  angkaKreditTahunan: number;
  catatanPenilai: string;
  rekomendasiPKB: string;
}

export interface InstrumenSupervisiItem {
  id: number;
  aspek: string;
  kriteria: string;
}

export interface SupervisiGuru {
  id: string;
  guruId: string;
  tanggal: string;
  supervisorNama: string;
  supervisorNip: string;
  semester: 'Ganjil' | 'Genap';
  tahunPelajaran: string;
  // Telaah RPP / Modul Ajar (Administrasi Perencanaan)
  telaahRPP: {
    skorItems: Record<number, number>; // 0 - 2 atau 1 - 4
    skorTotal: number;
    skorMaksimal: number;
    persentase: number;
    kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
    catatan: string;
  };
  // Observasi Kelas (Pelaksanaan PBM)
  observasiPBM: {
    skorItems: Record<number, number>;
    skorTotal: number;
    skorMaksimal: number;
    persentase: number;
    kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
    catatan: string;
  };
  catatanKelebihan: string;
  catatanKelemahan: string;
  tindakLanjut: string;
  targetWaktu: string;
  status: 'Terjadwal' | 'Selesai';
}

export interface MadrasahProfile {
  namaMadrasah: string;
  nsm: string;
  npsn: string;
  alamat: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kepalaMadrasah: string;
  nipKepala: string;
  tahunPelajaran: string;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  sheetNameRekap: string;
  webAppUrl: string;
  apiKey?: string;
  lastSyncedAt?: string;
  isAutoSync: boolean;
}
