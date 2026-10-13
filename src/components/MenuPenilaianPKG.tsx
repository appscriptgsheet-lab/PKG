import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Award, 
  CheckCircle2, 
  Save, 
  Printer, 
  Calculator, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap
} from 'lucide-react';
import { DomainKompetensi, Guru, MadrasahProfile, PenilaianPKGGuru, SkorKompetensiGuru } from '../types';
import { KOMPETENSI_PKG_14 } from '../data/standarPKG';
import { hitungAngkaKreditTahunan, hitungSebutanPKG } from '../services/pkgCalculator';

interface MenuPenilaianPKGProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  profile: MadrasahProfile;
  initialSelectedGuruId?: string;
  onSavePenilaian: (penilaian: PenilaianPKGGuru) => void;
  onOpenPrintModal: (guruId: string) => void;
}

export const MenuPenilaianPKG: React.FC<MenuPenilaianPKGProps> = ({
  guruList,
  penilaianPKG,
  profile,
  initialSelectedGuruId,
  onSavePenilaian,
  onOpenPrintModal,
}) => {
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    initialSelectedGuruId || guruList[0]?.id || ''
  );
  const [activeDomain, setActiveDomain] = useState<DomainKompetensi>('Pedagogik');

  const selectedGuru = guruList.find((g) => g.id === selectedGuruId) || guruList[0];
  const existingPKG = selectedGuru ? penilaianPKG[selectedGuru.id] : undefined;

  // Metadata Form
  const [tanggalPenilaian, setTanggalPenilaian] = useState<string>(
    existingPKG?.tanggalPenilaian || new Date().toISOString().slice(0, 10)
  );
  const [penilaiNama, setPenilaiNama] = useState<string>(
    existingPKG?.penilaiNama || profile.kepalaMadrasah
  );
  const [penilaiNip, setPenilaiNip] = useState<string>(
    existingPKG?.penilaiNip || profile.nipKepala
  );
  const [catatanPenilai, setCatatanPenilai] = useState<string>(
    existingPKG?.catatanPenilai || 'Guru menunjukkan dedikasi dan profesionalitas yang sangat memadai.'
  );
  const [rekomendasiPKB, setRekomendasiPKB] = useState<string>(
    existingPKG?.rekomendasiPKB || 'Disarankan mengikuti pengembangan diri berupa bimtek kurikulum dan publikasi ilmiah.'
  );

  // State Skor per Indikator
  // Menyimpan struktur: { [kompetensiId]: { [indikatorId]: 0 | 1 | 2 } }
  const [skorIndikatorMap, setSkorIndikatorMap] = useState<Record<number, Record<number, 0 | 1 | 2>>>(() => {
    if (existingPKG) {
      const map: Record<number, Record<number, 0 | 1 | 2>> = {};
      Object.entries(existingPKG.skorPerKompetensi).forEach(([kompId, data]) => {
        map[Number(kompId)] = { ...data.skorIndikator };
      });
      return map;
    }

    const defaultMap: Record<number, Record<number, 0 | 1 | 2>> = {};
    KOMPETENSI_PKG_14.forEach((komp) => {
      defaultMap[komp.id] = {};
      komp.indikator.forEach((ind) => {
        defaultMap[komp.id][ind.id] = 2; // default terpenuhi penuh
      });
    });
    return defaultMap;
  });

  // Handler saat guru diganti
  const handleSelectGuru = (guruId: string) => {
    setSelectedGuruId(guruId);
    const pkg = penilaianPKG[guruId];
    if (pkg) {
      setTanggalPenilaian(pkg.tanggalPenilaian);
      setPenilaiNama(pkg.penilaiNama);
      setPenilaiNip(pkg.penilaiNip);
      setCatatanPenilai(pkg.catatanPenilai);
      setRekomendasiPKB(pkg.rekomendasiPKB);

      const map: Record<number, Record<number, 0 | 1 | 2>> = {};
      Object.entries(pkg.skorPerKompetensi).forEach(([kompId, data]) => {
        map[Number(kompId)] = { ...data.skorIndikator };
      });
      setSkorIndikatorMap(map);
    } else {
      // Default reset
      setTanggalPenilaian(new Date().toISOString().slice(0, 10));
      setCatatanPenilai('Menunjukkan komitmen tinggi dalam proses pembelajaran madrasah.');
      setRekomendasiPKB('Mengikuti program pelatihan keprofesian berkelanjutan (PKB) madrasah.');
      const defaultMap: Record<number, Record<number, 0 | 1 | 2>> = {};
      KOMPETENSI_PKG_14.forEach((komp) => {
        defaultMap[komp.id] = {};
        komp.indikator.forEach((ind) => {
          defaultMap[komp.id][ind.id] = 2;
        });
      });
      setSkorIndikatorMap(defaultMap);
    }
  };

  const handleSetIndicatorScore = (kompId: number, indId: number, score: 0 | 1 | 2) => {
    setSkorIndikatorMap((prev) => ({
      ...prev,
      [kompId]: {
        ...prev[kompId],
        [indId]: score,
      },
    }));
  };

  // Quick Preset Helper
  const handleQuickPreset = (preset: 'maksimal' | 'baik' | 'cukup') => {
    const newMap: Record<number, Record<number, 0 | 1 | 2>> = {};
    KOMPETENSI_PKG_14.forEach((komp) => {
      newMap[komp.id] = {};
      komp.indikator.forEach((ind, idx) => {
        if (preset === 'maksimal') {
          newMap[komp.id][ind.id] = 2;
        } else if (preset === 'baik') {
          newMap[komp.id][ind.id] = idx === 0 ? 1 : 2;
        } else {
          newMap[komp.id][ind.id] = idx % 2 === 0 ? 1 : 2;
        }
      });
    });
    setSkorIndikatorMap(newMap);
  };

  // Hitung Skor per Kompetensi (1 s/d 14)
  const skorPerKompetensiCalc: Record<number, SkorKompetensiGuru> = {};
  let totalSkorPKG = 0;

  KOMPETENSI_PKG_14.forEach((komp) => {
    const indMap = skorIndikatorMap[komp.id] || {};
    let totalMentah = 0;
    const maxMentah = komp.indikator.length * 2;

    komp.indikator.forEach((ind) => {
      const s = indMap[ind.id] ?? 2;
      totalMentah += s;
    });

    const persentase = maxMentah > 0 ? (totalMentah / maxMentah) * 100 : 0;
    let skorStandar: 1 | 2 | 3 | 4 = 4;
    if (persentase <= 25) skorStandar = 1;
    else if (persentase <= 50) skorStandar = 2;
    else if (persentase <= 75) skorStandar = 3;
    else skorStandar = 4;

    totalSkorPKG += skorStandar;

    skorPerKompetensiCalc[komp.id] = {
      kompetensiId: komp.id,
      skorIndikator: indMap,
      totalSkorMentah: totalMentah,
      skorMaksimalMentah: maxMentah,
      persentase: Math.round(persentase),
      skorStandar,
    };
  });

  // Konversi Nilai PKG Skala 100: (totalSkorPKG / 56) * 100
  const nilaiPKG100 = (totalSkorPKG / 56) * 100;
  const { sebutan, persentaseKinerja } = hitungSebutanPKG(nilaiPKG100);
  const angkaKreditTahunan = selectedGuru
    ? hitungAngkaKreditTahunan(
        selectedGuru.pangkatGolongan,
        nilaiPKG100,
        selectedGuru.jamMengajarMinggu,
        selectedGuru.tugasTambahan
      )
    : 0;

  const handleSave = () => {
    if (!selectedGuru) return;

    const dataPenilaian: PenilaianPKGGuru = {
      guruId: selectedGuru.id,
      tahun: profile.tahunPelajaran.split('/')[0] || '2026',
      tanggalPenilaian,
      penilaiNama,
      penilaiNip,
      skorPerKompetensi: skorPerKompetensiCalc,
      totalSkorPKG,
      nilaiPKG100,
      sebutan,
      persentaseKinerja,
      angkaKreditTahunan,
      catatanPenilai,
      rekomendasiPKB,
    };

    onSavePenilaian(dataPenilaian);
    alert(`Penilaian PKG 14 Kompetensi untuk ${selectedGuru.nama} berhasil disimpan dan disinkronkan ke Rekapitulasi!`);
  };

  const domainList: DomainKompetensi[] = ['Pedagogik', 'Kepribadian', 'Sosial', 'Profesional'];
  const kompetensiFiltered = KOMPETENSI_PKG_14.filter((k) => k.domain === activeDomain);

  return (
    <div className="space-y-6">
      {/* Header Penilaian */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Instrumen Penilaian Kinerja Guru (PKG) 14 Kompetensi
              </h1>
              <p className="text-xs text-slate-500">
                Format resmi guru kelas / mata pelajaran MTs Kementerian Agama & Kemendikbudristek
              </p>
            </div>
          </div>
        </div>

        {/* Pemilihan Guru MTs */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-slate-600">Pilih Guru:</label>
          <select
            value={selectedGuruId}
            onChange={(e) => handleSelectGuru(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {guruList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nama} ({g.mataPelajaran}) - {g.pangkatGolongan.split('/')[1] || g.pangkatGolongan}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ringkasan Skor Live & Estimasi Angka Kredit */}
      {selectedGuru && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Guru Dinilai</span>
              <div className="font-bold text-slate-900 text-xs truncate mt-0.5">{selectedGuru.nama}</div>
              <div className="text-[11px] text-slate-500 truncate">{selectedGuru.mataPelajaran} · {selectedGuru.pangkatGolongan}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Skor PKG (Maks 56)</span>
              <div className="text-2xl font-extrabold font-mono-numbers text-slate-900 mt-0.5">
                {totalSkorPKG} <span className="text-xs text-slate-400 font-normal">/ 56</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nilai PKG (Skala 100)</span>
              <div className="text-2xl font-extrabold font-mono-numbers text-emerald-800 mt-0.5">
                {nilaiPKG100.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Sebutan & NPK</span>
              <div className="text-sm font-extrabold text-emerald-950 mt-1">
                {sebutan} ({persentaseKinerja}%)
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Estimasi Angka Kredit</span>
              <div className="text-2xl font-extrabold font-mono-numbers text-emerald-400 mt-0.5">
                {angkaKreditTahunan} <span className="text-[10px] font-normal text-slate-300">AK / Thn</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Preset Cepat & Filter 4 Domain */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        {/* Tab 4 Domain */}
        <div className="flex flex-wrap gap-1">
          {domainList.map((domain) => {
            const count = KOMPETENSI_PKG_14.filter((k) => k.domain === domain).length;
            const isActive = activeDomain === domain;
            return (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {domain} ({count} Kompetensi)
              </button>
            );
          })}
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Isi Cepat:</span>
          <button
            onClick={() => handleQuickPreset('maksimal')}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors"
            title="Set semua indikator = 2 (Terpenuhi Seluruhnya)"
          >
            Amat Baik (Semua 2)
          </button>
          <button
            onClick={() => handleQuickPreset('baik')}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 transition-colors"
            title="Set rata-rata baik"
          >
            Baik
          </button>
        </div>
      </div>

      {/* Formulir Rubrik Kompetensi Terpilih */}
      <div className="space-y-6">
        {kompetensiFiltered.map((komp) => {
          const calcData = skorPerKompetensiCalc[komp.id];
          const indMap = skorIndikatorMap[komp.id] || {};

          return (
            <div
              key={komp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              {/* Header Kompetensi */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {komp.nomor}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Kompetensi {komp.nomor}: {komp.nama}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 pl-8 leading-relaxed">
                    {komp.deskripsi}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-start bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Skor Mentah</span>
                    <span className="font-bold font-mono-numbers text-slate-800">
                      {calcData.totalSkorMentah} / {calcData.skorMaksimalMentah} ({calcData.persentase}%)
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nilai (1-4)</span>
                    <span className="text-base font-extrabold font-mono-numbers text-emerald-800">
                      {calcData.skorStandar}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabel Indikator Perilaku */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Indikator Pengamatan & Fakta Lapangan
                </span>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {komp.indikator.map((ind, idx) => {
                    const currentScore = indMap[ind.id] ?? 2;

                    return (
                      <div
                        key={ind.id}
                        className="p-3 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-slate-400 font-mono-numbers font-medium shrink-0 pt-0.5">
                            {idx + 1}.
                          </span>
                          <span className="text-slate-700 leading-relaxed">
                            {ind.pernyataan}
                          </span>
                        </div>

                        {/* Pilihan Skor 0, 1, 2 */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center p-1 bg-slate-100 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleSetIndicatorScore(komp.id, ind.id, 0)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                              currentScore === 0
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            title="0 = Tidak Ada Bukti / Tidak Terpenuhi"
                          >
                            0: Tidak
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetIndicatorScore(komp.id, ind.id, 1)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                              currentScore === 1
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            title="1 = Terpenuhi Sebagian"
                          >
                            1: Sebagian
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetIndicatorScore(komp.id, ind.id, 2)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                              currentScore === 2
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            title="2 = Terpenuhi Seluruhnya"
                          >
                            2: Lengkap
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bagian Catatan Penilai & Rekomendasi PKB */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Catatan Penilai & Rekomendasi Pengembangan Keprofesian Berkelanjutan (PKB)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tanggal Penilaian PKG</label>
            <input
              type="date"
              value={tanggalPenilaian}
              onChange={(e) => setTanggalPenilaian(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Asesor / Kepala Madrasah</label>
            <input
              type="text"
              value={penilaiNama}
              onChange={(e) => setPenilaiNama(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">NIP Asesor</label>
            <input
              type="text"
              value={penilaiNip}
              onChange={(e) => setPenilaiNip(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Catatan Evaluasi / Evaluasi Diri Guru
          </label>
          <textarea
            rows={2}
            value={catatanPenilai}
            onChange={(e) => setCatatanPenilai(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Kinerja pedagogik dan kepribadian guru sangat baik..."
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Rekomendasi PKB (Pengembangan Diri / Publikasi Ilmiah / Karya Inovatif)
          </label>
          <input
            type="text"
            value={rekomendasiPKB}
            onChange={(e) => setRekomendasiPKB(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Direkomendasikan menulis artikel ilmiah di jurnal madrasah..."
          />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Skor Total: <strong className="font-mono-numbers text-slate-900">{totalSkorPKG} / 56</strong> · Nilai: <strong className="font-mono-numbers text-emerald-800">{nilaiPKG100.toFixed(1)} ({sebutan})</strong> · AK Tahunan: <strong className="font-mono-numbers text-slate-900">{angkaKreditTahunan}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedGuru && (
            <button
              onClick={() => onOpenPrintModal(selectedGuru.id)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar PKG</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Nilai PKG Guru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
