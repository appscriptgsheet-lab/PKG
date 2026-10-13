import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  Eye, 
  FileSpreadsheet, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  Printer, 
  ChevronRight, 
  Database,
  Download,
  Sparkles
} from 'lucide-react';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';

interface DashboardAdminProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  onNavigate: (menu: string, guruId?: string) => void;
  onExportExcel: () => void;
  onOpenDatabaseModal: () => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  guruList,
  penilaianPKG,
  supervisiList,
  profile,
  onNavigate,
  onExportExcel,
  onOpenDatabaseModal,
}) => {
  const totalGuru = guruList.length;
  const selesaiPKG = guruList.filter((g) => g.statusPenilaian === 'Selesai').length;
  const prosesPKG = guruList.filter((g) => g.statusPenilaian === 'Dalam Proses').length;
  const belumPKG = guruList.filter((g) => g.statusPenilaian === 'Belum Dinilai').length;

  const totalSupervisi = Object.keys(supervisiList).length;

  // Rata-rata Nilai PKG
  const nilaiList = Object.values(penilaianPKG).map((p) => p.nilaiPKG100);
  const avgNilaiPKG = nilaiList.length > 0 
    ? (nilaiList.reduce((acc, curr) => acc + curr, 0) / nilaiList.length).toFixed(1)
    : '0';

  // Distribusi predikat
  const predikatCounts = {
    'Amat Baik': Object.values(penilaianPKG).filter((p) => p.sebutan === 'Amat Baik').length,
    'Baik': Object.values(penilaianPKG).filter((p) => p.sebutan === 'Baik').length,
    'Cukup': Object.values(penilaianPKG).filter((p) => p.sebutan === 'Cukup').length,
    'Sedang': Object.values(penilaianPKG).filter((p) => p.sebutan === 'Sedang').length,
    'Kurang': Object.values(penilaianPKG).filter((p) => p.sebutan === 'Kurang').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Selamat Datang Eksekutif (Tanpa Logo Gambar) */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border border-emerald-800/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-white flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-300">SIPKG</span>
            <span className="text-lg font-black tracking-tight text-white leading-none">PRO</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                Portal Penilaian Kinerja Guru MTs & Supervisi
              </span>
              <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-700/60 text-emerald-100 font-semibold">
                NSM: {profile.nsm} · NPSN: {profile.npsn}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              {profile.namaMadrasah} SEMAU
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              {profile.alamat} · {profile.kecamatan} · {profile.kabupatenKota}
            </p>
            <div className="mt-2 text-[11px] text-emerald-200 flex flex-wrap gap-x-3 gap-y-1">
              <span>Kepala Madrasah / Penilai: <strong className="text-white font-bold">{profile.kepalaMadrasah}</strong></span>
              <span>•</span>
              <span>Regulasi: <strong className="text-white font-semibold">PermenpanRB No. 1/2023 & Standar Kemenag</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('supervisi')}
            className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Supervisi Guru</span>
          </button>
          <button
            onClick={() => onNavigate('penilaian')}
            className="px-4 py-2.5 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Nilai PKG (14 Komp)</span>
          </button>
          <button
            onClick={onExportExcel}
            className="px-4 py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-colors flex items-center gap-1.5"
            title="Unduh seluruh rekapitulasi dalam file Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Guru MTs</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-slate-900">{totalGuru}</span>
            <span className="text-xs text-slate-500">Pendidik Terdaftar</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Telah Dinilai: <strong className="text-slate-800">{selesaiPKG}</strong></span>
            <span>Belum: <strong className="text-amber-700">{belumPKG + prosesPKG}</strong></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Supervisi Akademik</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-slate-900">{totalSupervisi}</span>
            <span className="text-xs text-slate-500">dari {totalGuru} Guru</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Telaah RPP & Kelas</span>
            <span className="text-emerald-700 font-semibold">{Math.round((totalSupervisi / totalGuru) * 100)}% selesai</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Rata-rata Nilai PKG</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono-numbers text-slate-900">{avgNilaiPKG}</span>
            <span className="text-xs text-slate-500">Skala 100</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Sebutan Umum</span>
            <span className="font-semibold text-emerald-700">Amat Baik (91-100)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Penyimpanan Sistem</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900">Mandiri (Offline)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button 
              onClick={onOpenDatabaseModal} 
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Cadangan / Pulihkan</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-emerald-700 font-medium">Tersimpan</span>
          </div>
        </div>
      </div>

      {/* Grid: Status Kinerja & Daftar Guru Dinilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom 1 & 2: Daftar Guru MTs & Status Evaluasi */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Daftar Guru & Status Penilaian</h2>
              <p className="text-xs text-slate-500">Monitoring penilaian PKG 14 kompetensi dan supervisi kelas</p>
            </div>
            <button
              onClick={() => onNavigate('guru')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Kelola Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Guru MTs</th>
                  <th className="px-3 py-3">Mata Pelajaran</th>
                  <th className="px-3 py-3">Golongan</th>
                  <th className="px-3 py-3 text-center">Nilai PKG</th>
                  <th className="px-3 py-3 text-center">Supervisi</th>
                  <th className="px-4 py-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guruList.map((guru) => {
                  const pkg = penilaianPKG[guru.id];
                  const sup = supervisiList[guru.id];

                  return (
                    <tr key={guru.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{guru.nama}</div>
                        <div className="text-[11px] font-mono-numbers text-slate-500">NIP. {guru.nip}</div>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-700">{guru.mataPelajaran}</td>
                      <td className="px-3 py-3 text-slate-600">{guru.pangkatGolongan.split('/')[1] || guru.pangkatGolongan}</td>
                      
                      <td className="px-3 py-3 text-center">
                        {pkg ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold font-mono-numbers text-slate-900">
                              {pkg.nilaiPKG100.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">{pkg.sebutan}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Belum
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {sup ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold font-mono-numbers text-slate-900">
                              {sup.observasiPBM.persentase}%
                            </span>
                            <span className="text-[10px] text-blue-700 font-medium">{sup.observasiPBM.kategori}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Belum</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onNavigate('penilaian', guru.id)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            {pkg ? 'Edit PKG' : 'Nilai PKG'}
                          </button>
                          <button
                            onClick={() => onNavigate('supervisi', guru.id)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Supervisi
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom 3: Distribusi Kinerja & Panduan Konversi */}
        <div className="space-y-6">
          {/* Card Distribusi Predikat */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Distribusi Predikat Kinerja</h3>
            <p className="text-xs text-slate-500 mb-4">Klasifikasi nilai PKG hasil evaluasi madrasah</p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="font-medium text-slate-700">Amat Baik (91-100%)</span>
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">{predikatCounts['Amat Baik']} Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="font-medium text-slate-700">Baik (76-90%)</span>
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">{predikatCounts['Baik']} Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-slate-700">Cukup (61-75%)</span>
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">{predikatCounts['Cukup']} Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="font-medium text-slate-700">Sedang (51-60%)</span>
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">{predikatCounts['Sedang']} Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-slate-700">Kurang (&lt;51%)</span>
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">{predikatCounts['Kurang']} Guru</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate('rekapitulasi')}
                className="w-full py-2 px-3 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Buka Rekapitulasi Otomatis Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Guide PKG & Angka Kredit */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 mb-1">Rumus Standar Kemenag/Kemendikbud</h4>
            <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <p>• <strong>Nilai PKG (100)</strong> = (Total Skor 14 Komp / 56) × 100</p>
              <p>• <strong>Angka Kredit (AK)</strong> = ((AKK - AKPKB - AKP) × (JM/24) × NPK) / 4</p>
              <p>• <strong>Faktor NPK</strong>: Amat Baik = 125%, Baik = 100%, Cukup = 75%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
