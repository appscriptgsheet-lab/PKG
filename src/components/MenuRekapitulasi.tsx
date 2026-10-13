import React, { useState } from 'react';
import { 
  Calculator, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  TrendingUp, 
  Award, 
  CheckCircle2,
  ChevronRight,
  Database
} from 'lucide-react';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';
import { exportToCSV, exportToExcel } from '../services/googleSheetService';

interface MenuRekapitulasiProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  onOpenDatabaseModal: () => void;
  onOpenPrintModal: (guruId?: string) => void;
}

export const MenuRekapitulasi: React.FC<MenuRekapitulasiProps> = ({
  guruList,
  penilaianPKG,
  supervisiList,
  profile,
  onOpenDatabaseModal,
  onOpenPrintModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPredikat, setFilterPredikat] = useState('all');

  // Filter Data
  const filteredData = guruList.filter((guru) => {
    const pkg = penilaianPKG[guru.id];
    const matchSearch =
      guru.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guru.nip.includes(searchQuery) ||
      guru.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPredikat =
      filterPredikat === 'all' ||
      (pkg && pkg.sebutan === filterPredikat) ||
      (filterPredikat === 'Belum' && !pkg);

    return matchSearch && matchPredikat;
  });

  // Statistik Ringkasan
  const totalGuru = guruList.length;
  const sudahDinilaiCount = Object.keys(penilaianPKG).length;

  const pkgValues = Object.values(penilaianPKG).map((p) => p.nilaiPKG100);
  const avgPKG = pkgValues.length > 0 ? (pkgValues.reduce((a, b) => a + b, 0) / pkgValues.length).toFixed(1) : '0';

  const akValues = Object.values(penilaianPKG).map((p) => p.angkaKreditTahunan);
  const totalAK = akValues.reduce((a, b) => a + b, 0).toFixed(2);

  const supValues = Object.values(supervisiList).map((s) => (s.telaahRPP.persentase * 0.3) + (s.observasiPBM.persentase * 0.7));
  const avgSupervisi = supValues.length > 0 ? (supValues.reduce((a, b) => a + b, 0) / supValues.length).toFixed(1) : '0';

  const handleExportExcel = () => {
    exportToExcel(guruList, penilaianPKG, supervisiList, profile);
  };

  const handleExportCSV = () => {
    exportToCSV(guruList, penilaianPKG, supervisiList);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Rekapitulasi Otomatis Nilai PKG & Supervisi MTs
              </h1>
              <p className="text-xs text-slate-500">
                Perhitungan otomatis skor mentah (maks 56), konversi skala 100, sebutan kinerja, dan penetapan angka kredit tahunan
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            title="Unduh Berkas Excel Lengkap (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            title="Unduh format CSV"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => onOpenPrintModal()}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Resmi</span>
          </button>

          <button
            onClick={onOpenDatabaseModal}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            title="Kelola Cadangan Data"
          >
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Cadangan Data</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Ringkasan Rekap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Status Kelengkapan
          </span>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
            {sudahDinilaiCount} <span className="text-sm font-normal text-slate-500">/ {totalGuru} Guru</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {Math.round((sudahDinilaiCount / totalGuru) * 100)}% Terevaluasi Lengkap
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Rata-rata Nilai PKG
          </span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-800 mt-1">
            {avgPKG} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Predikat: Amat Baik (91-100%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Angka Kredit (AK)
          </span>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
            {totalAK}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Akumulasi dari seluruh guru MTs
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Rata-rata Supervisi
          </span>
          <div className="text-2xl font-bold font-mono-numbers text-blue-700 mt-1">
            {avgSupervisi}%
          </div>
          <div className="text-[11px] text-blue-800 font-medium mt-1">
            Kategori: Sangat Baik
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 whitespace-nowrap">Predikat:</span>
            <select
              value={filterPredikat}
              onChange={(e) => setFilterPredikat(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Predikat</option>
              <option value="Amat Baik">Amat Baik (125%)</option>
              <option value="Baik">Baik (100%)</option>
              <option value="Cukup">Cukup (75%)</option>
              <option value="Belum">Belum Dinilai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Matriks Rekapitulasi Otomatis */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 text-center border-r border-slate-200 w-10">No</th>
                <th className="px-4 py-3 border-r border-slate-200 min-w-[200px]">Identitas Guru</th>
                <th className="px-3 py-3 border-r border-slate-200">Pangkat / Gol.</th>
                <th className="px-3 py-3 border-r border-slate-200">Mata Pelajaran</th>
                <th className="px-3 py-3 border-r border-slate-200">Tugas Tambahan</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center">JTM</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-emerald-50/50">Skor (56)</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-emerald-50/50">Nilai (100)</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-emerald-50/50">Sebutan</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-emerald-50/50">NPK</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-amber-50/50 font-bold">AK / Thn</th>
                <th className="px-3 py-3 border-r border-slate-200 text-center bg-blue-50/50">Supervisi</th>
                <th className="px-3 py-3 text-center bg-blue-50/50">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((guru, index) => {
                const pkg = penilaianPKG[guru.id];
                const sup = supervisiList[guru.id];
                const nilaiAkhirSup = sup
                  ? Math.round((sup.telaahRPP.persentase * 0.3) + (sup.observasiPBM.persentase * 0.7))
                  : '-';
                const katSup = sup ? sup.observasiPBM.kategori : '-';

                return (
                  <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-center font-mono-numbers text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{guru.nama}</div>
                      <div className="text-[10px] font-mono-numbers text-slate-500 flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                        {guru.pegId && <span>PEG: <strong className="text-emerald-800">{guru.pegId}</strong></span>}
                        {guru.nik && <span>NIK: {guru.nik}</span>}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      <div>{guru.pangkatGolongan}</div>
                      <div className="text-[10px] text-slate-400">{guru.jabatan}</div>
                    </td>

                    <td className="px-3 py-3 font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {guru.mataPelajaran}
                    </td>

                    <td className="px-3 py-3 text-slate-600 border-r border-slate-200">
                      {guru.tugasTambahan || '-'}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers text-slate-700 border-r border-slate-200">
                      {guru.jamMengajarMinggu}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers font-bold text-slate-800 border-r border-slate-200 bg-emerald-50/20">
                      {pkg ? pkg.totalSkorPKG : '-'}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers font-extrabold text-emerald-800 border-r border-slate-200 bg-emerald-50/20">
                      {pkg ? pkg.nilaiPKG100.toFixed(2) : '-'}
                    </td>

                    <td className="px-3 py-3 text-center border-r border-slate-200 bg-emerald-50/20">
                      {pkg ? (
                        <span className="font-semibold text-emerald-700">
                          {pkg.sebutan}
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum</span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers text-slate-700 border-r border-slate-200 bg-emerald-50/20">
                      {pkg ? `${pkg.persentaseKinerja}%` : '-'}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers font-extrabold text-slate-900 border-r border-slate-200 bg-amber-50/30">
                      {pkg ? (
                        <span className="text-emerald-800">{pkg.angkaKreditTahunan}</span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="px-3 py-3 text-center font-mono-numbers font-bold text-blue-800 border-r border-slate-200 bg-blue-50/20">
                      {nilaiAkhirSup}
                    </td>

                    <td className="px-3 py-3 text-center font-semibold text-blue-800 bg-blue-50/20">
                      {katSup}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Kompatibilitas XLSM */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Format data tabel ini terkonfigurasi 100% kompatibel dengan format resmi <strong>REKAP_PKG_MTS</strong> Kementerian Agama dan dapat diekspor langsung ke berkas Excel (.xlsx).
          </span>
        </div>
        <button
          onClick={onOpenDatabaseModal}
          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 shrink-0 ml-4 hover:underline"
        >
          <span>Kelola Basis Data</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
