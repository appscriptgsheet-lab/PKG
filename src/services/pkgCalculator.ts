export interface ParameterGolongan {
  golongan: string;
  akk: number; // Angka Kredit Kumulatif
  akpkb: number; // Angka Kredit PKB (Pengembangan Diri + Publikasi/Karya Inovatif)
  akp: number; // Angka Kredit Unsur Penunjang
  akTarget4Tahun: number; // AKK - AKPKB - AKP
}

export const PARAMETER_GOLONGAN_MAP: Record<string, ParameterGolongan> = {
  'Penata Muda / III/a': { golongan: 'III/a', akk: 50, akpkb: 3, akp: 5, akTarget4Tahun: 42 },
  'Penata Muda Tingkat I / III/b': { golongan: 'III/b', akk: 50, akpkb: 7, akp: 5, akTarget4Tahun: 38 },
  'Penata / III/c': { golongan: 'III/c', akk: 100, akpkb: 9, akp: 10, akTarget4Tahun: 81 },
  'Penata Tingkat I / III/d': { golongan: 'III/d', akk: 100, akpkb: 12, akp: 10, akTarget4Tahun: 78 },
  'Pembina / IV/a': { golongan: 'IV/a', akk: 150, akpkb: 16, akp: 15, akTarget4Tahun: 119 },
  'Pembina Tingkat I / IV/b': { golongan: 'IV/b', akk: 150, akpkb: 16, akp: 15, akTarget4Tahun: 119 },
  'Pembina Utama Muda / IV/c': { golongan: 'IV/c', akk: 150, akpkb: 19, akp: 15, akTarget4Tahun: 116 },
};

export function getParameterGolongan(pangkatGolongan: string): ParameterGolongan {
  for (const key in PARAMETER_GOLONGAN_MAP) {
    if (pangkatGolongan.includes(key) || key.includes(pangkatGolongan)) {
      return PARAMETER_GOLONGAN_MAP[key];
    }
  }
  // Default to III/c jika tidak ada match
  return { golongan: 'III/c', akk: 100, akpkb: 9, akp: 10, akTarget4Tahun: 81 };
}

export function hitungSebutanPKG(nilaiPKG100: number): {
  sebutan: 'Amat Baik' | 'Baik' | 'Cukup' | 'Sedang' | 'Kurang';
  persentaseKinerja: number;
} {
  if (nilaiPKG100 >= 91) {
    return { sebutan: 'Amat Baik', persentaseKinerja: 125 };
  } else if (nilaiPKG100 >= 76) {
    return { sebutan: 'Baik', persentaseKinerja: 100 };
  } else if (nilaiPKG100 >= 61) {
    return { sebutan: 'Cukup', persentaseKinerja: 75 };
  } else if (nilaiPKG100 >= 51) {
    return { sebutan: 'Sedang', persentaseKinerja: 50 };
  } else {
    return { sebutan: 'Kurang', persentaseKinerja: 25 };
  }
}

export function hitungAngkaKreditTahunan(
  pangkatGolongan: string,
  nilaiPKG100: number,
  jamMengajarNyata: number = 24,
  tugasTambahan?: string
): number {
  const param = getParameterGolongan(pangkatGolongan);
  const { persentaseKinerja } = hitungSebutanPKG(nilaiPKG100);
  const npk = persentaseKinerja / 100; // 1.25, 1.0, 0.75, dll

  const jwm = 24; // Jam Wajib Mengajar standar guru
  const faktorJam = Math.min(jamMengajarNyata, jwm) / jwm; // proporsi jam jika kurang dari 24 jam

  // Rumus dasar: ((AKK - AKPKB - AKP) * (JM / JWM) * NPK) / 4
  const akDasar = (param.akTarget4Tahun * faktorJam * npk) / 4;

  // Jika memiliki tugas tambahan relevan (misal Kepala Perpustakaan / Lab / Waka),
  // di Kemenag/Kemendikbud ada pembagian proporsi (misal 50% guru + 50% tugas tambahan atau bonus)
  if (tugasTambahan && (tugasTambahan.includes('Waka') || tugasTambahan.includes('Kepala Lab') || tugasTambahan.includes('Kepala Perpus'))) {
    // Sebagai guru kelas + tugas tambahan penuh
    return parseFloat(akDasar.toFixed(2));
  }

  return parseFloat(akDasar.toFixed(2));
}

export function hitungNilaiSupervisi(telaahRPPPersen: number, observasiPBMMPersen: number): {
  nilaiAkhir: number;
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
} {
  // Bobot standar supervisi: 30% telaah administrasi perencanaan + 70% observasi proses kelas
  const nilaiAkhir = Math.round((telaahRPPPersen * 0.3) + (observasiPBMMPersen * 0.7));

  let kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' = 'Sangat Baik';
  if (nilaiAkhir >= 91) kategori = 'Sangat Baik';
  else if (nilaiAkhir >= 76) kategori = 'Baik';
  else if (nilaiAkhir >= 61) kategori = 'Cukup';
  else kategori = 'Kurang';

  return { nilaiAkhir, kategori };
}
