import React, { useState } from 'react';
import { 
  Eye, 
  FileText, 
  CheckCircle2, 
  Save, 
  Printer, 
  UserCheck, 
  Award, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Guru, MadrasahProfile, SupervisiGuru } from '../types';
import { INSTRUMEN_OBSERVASI_KELAS, INSTRUMEN_TELAAH_RPP } from '../data/standarPKG';
import { hitungNilaiSupervisi } from '../services/pkgCalculator';

interface MenuSupervisiProps {
  guruList: Guru[];
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  initialSelectedGuruId?: string;
  onSaveSupervisi: (supervisi: SupervisiGuru) => void;
  onOpenPrintModal: (guruId: string) => void;
}

export const MenuSupervisi: React.FC<MenuSupervisiProps> = ({
  guruList,
  supervisiList,
  profile,
  initialSelectedGuruId,
  onSaveSupervisi,
  onOpenPrintModal,
}) => {
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    initialSelectedGuruId || guruList[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'rpp' | 'kelas' | 'tindak_lanjut'>('rpp');

  const selectedGuru = guruList.find((g) => g.id === selectedGuruId) || guruList[0];
  const existingSupervisi = selectedGuru ? supervisiList[selectedGuru.id] : undefined;

  // Form State
  const [tanggal, setTanggal] = useState<string>(
    existingSupervisi?.tanggal || new Date().toISOString().slice(0, 10)
  );
  const [supervisorNama, setSupervisorNama] = useState<string>(
    existingSupervisi?.supervisorNama || profile.kepalaMadrasah
  );
  const [supervisorNip, setSupervisorNip] = useState<string>(
    existingSupervisi?.supervisorNip || profile.nipKepala
  );
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(
    existingSupervisi?.semester || 'Ganjil'
  );

  // Skor RPP: 10 butir (nilai 1-4)
  const [skorRPP, setSkorRPP] = useState<Record<number, number>>(() => {
    if (existingSupervisi?.telaahRPP.skorItems) {
      return { ...existingSupervisi.telaahRPP.skorItems };
    }
    const initial: Record<number, number> = {};
    INSTRUMEN_TELAAH_RPP.forEach((item) => {
      initial[item.id] = 4;
    });
    return initial;
  });

  const [catatanRPP, setCatatanRPP] = useState<string>(
    existingSupervisi?.telaahRPP.catatan || 'Perencanaan pembelajaran telah memenuhi standar madrasah.'
  );

  // Skor Observasi Kelas: 15 butir (nilai 1-4)
  const [skorKelas, setSkorKelas] = useState<Record<number, number>>(() => {
    if (existingSupervisi?.observasiPBM.skorItems) {
      return { ...existingSupervisi.observasiPBM.skorItems };
    }
    const initial: Record<number, number> = {};
    INSTRUMEN_OBSERVASI_KELAS.forEach((item) => {
      initial[item.id] = 4;
    });
    return initial;
  });

  const [catatanKelas, setCatatanKelas] = useState<string>(
    existingSupervisi?.observasiPBM.catatan || 'Pelaksanaan pembelajaran berlangsung interaktif dan tertib.'
  );

  // Catatan Tindak Lanjut
  const [catatanKelebihan, setCatatanKelebihan] = useState<string>(
    existingSupervisi?.catatanKelebihan || 'Komunikasi santun, pemahaman materi bagus, siswa dilibatkan aktif.'
  );
  const [catatanKelemahan, setCatatanKelemahan] = useState<string>(
    existingSupervisi?.catatanKelemahan || 'Dapat mengoptimalkan media presentasi interaktif dan ragam pertanyaan analitis.'
  );
  const [tindakLanjut, setTindakLanjut] = useState<string>(
    existingSupervisi?.tindakLanjut || 'Mengikuti workshop pembuatan media pembelajaran digital MGMP MTs.'
  );
  const [targetWaktu, setTargetWaktu] = useState<string>(
    existingSupervisi?.targetWaktu || 'Semester Berjalan'
  );

  // Handler saat guru diganti
  const handleSelectGuru = (guruId: string) => {
    setSelectedGuruId(guruId);
    const sup = supervisiList[guruId];
    if (sup) {
      setTanggal(sup.tanggal);
      setSupervisorNama(sup.supervisorNama);
      setSupervisorNip(sup.supervisorNip);
      setSemester(sup.semester);
      setSkorRPP({ ...sup.telaahRPP.skorItems });
      setCatatanRPP(sup.telaahRPP.catatan);
      setSkorKelas({ ...sup.observasiPBM.skorItems });
      setCatatanKelas(sup.observasiPBM.catatan);
      setCatatanKelebihan(sup.catatanKelebihan);
      setCatatanKelemahan(sup.catatanKelemahan);
      setTindakLanjut(sup.tindakLanjut);
      setTargetWaktu(sup.targetWaktu);
    } else {
      // Nilai default
      const rppInit: Record<number, number> = {};
      INSTRUMEN_TELAAH_RPP.forEach((item) => { rppInit[item.id] = 4; });
      setSkorRPP(rppInit);

      const kelasInit: Record<number, number> = {};
      INSTRUMEN_OBSERVASI_KELAS.forEach((item) => { kelasInit[item.id] = 4; });
      setSkorKelas(kelasInit);

      setCatatanRPP('Modul ajar telah sesuai standar kurikulum madrasah.');
      setCatatanKelas('Proses pembelajaran kondusif dan melibatkan keaktifan siswa.');
      setCatatanKelebihan('Apersepsi menyenangkan dan penguasaan bahan ajar memadai.');
      setCatatanKelemahan('Perkaya instrumen evaluasi formatif selama diskusi kelompok.');
      setTindakLanjut('Melakukan pendampingan pembuatan rubrik asesmen autentik.');
      setTargetWaktu('Semester Ganjil 2026/2027');
    }
  };

  // Kalkulasi Skor RPP
  const totalSkorRPP = Object.values(skorRPP).reduce((a, b) => a + b, 0);
  const maxSkorRPP = INSTRUMEN_TELAAH_RPP.length * 4; // 40
  const persenRPP = Math.round((totalSkorRPP / maxSkorRPP) * 100);
  const kategoriRPP = persenRPP >= 91 ? 'Sangat Baik' : persenRPP >= 76 ? 'Baik' : persenRPP >= 61 ? 'Cukup' : 'Kurang';

  // Kalkulasi Skor Kelas
  const totalSkorKelas = Object.values(skorKelas).reduce((a, b) => a + b, 0);
  const maxSkorKelas = INSTRUMEN_OBSERVASI_KELAS.length * 4; // 60
  const persenKelas = Math.round((totalSkorKelas / maxSkorKelas) * 100);
  const kategoriKelas = persenKelas >= 91 ? 'Sangat Baik' : persenKelas >= 76 ? 'Baik' : persenKelas >= 61 ? 'Cukup' : 'Kurang';

  // Kalkulasi Nilai Akhir Supervisi
  const { nilaiAkhir, kategori: kategoriAkhir } = hitungNilaiSupervisi(persenRPP, persenKelas);

  const handleSave = () => {
    if (!selectedGuru) return;

    const dataSupervisi: SupervisiGuru = {
      id: existingSupervisi?.id || `sup-${Date.now()}`,
      guruId: selectedGuru.id,
      tanggal,
      supervisorNama,
      supervisorNip,
      semester,
      tahunPelajaran: profile.tahunPelajaran,
      telaahRPP: {
        skorItems: skorRPP,
        skorTotal: totalSkorRPP,
        skorMaksimal: maxSkorRPP,
        persentase: persenRPP,
        kategori: kategoriRPP,
        catatan: catatanRPP,
      },
      observasiPBM: {
        skorItems: skorKelas,
        skorTotal: totalSkorKelas,
        skorMaksimal: maxSkorKelas,
        persentase: persenKelas,
        kategori: kategoriKelas,
        catatan: catatanKelas,
      },
      catatanKelebihan,
      catatanKelemahan,
      tindakLanjut,
      targetWaktu,
      status: 'Selesai',
    };

    onSaveSupervisi(dataSupervisi);
    alert(`Data supervisi akademik guru ${selectedGuru.nama} berhasil disimpan!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel Supervisi */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Supervisi Akademik & Pembelajaran Guru MTs
              </h1>
              <p className="text-xs text-slate-500">
                Instrumen telaah perencanaan (Modul Ajar/RPP) dan observasi pelaksanaan pembelajaran di kelas
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
                {g.nama} — {g.mataPelajaran} ({g.pangkatGolongan.split('/')[1] || g.pangkatGolongan})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profil Guru Terpilih & Skor Ringkas */}
      {selectedGuru && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 text-sm">{selectedGuru.nama}</div>
            <div className="text-slate-500 mt-0.5">
              NIP. <span className="font-mono-numbers">{selectedGuru.nip}</span> · Mapel: <strong className="text-emerald-700">{selectedGuru.mataPelajaran}</strong> · Gol: {selectedGuru.pangkatGolongan}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Telaah RPP (30%)</div>
              <div className="text-base font-extrabold font-mono-numbers text-slate-900">{persenRPP}%</div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Observasi PBM (70%)</div>
              <div className="text-base font-extrabold font-mono-numbers text-slate-900">{persenKelas}%</div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Nilai Akhir</div>
              <div className="text-base font-extrabold font-mono-numbers text-emerald-700">{nilaiAkhir}</div>
              <span className="text-[10px] font-bold text-emerald-800">{kategoriAkhir}</span>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Supervisi (Tanggal, Supervisor, Semester) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tanggal Supervisi</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Nama Supervisor</label>
          <input
            type="text"
            value={supervisorNama}
            onChange={(e) => setSupervisorNama(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">NIP Supervisor</label>
          <input
            type="text"
            value={supervisorNip}
            onChange={(e) => setSupervisorNip(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Tab Kontrol Supervisi */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rpp')}
          className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'rpp'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Telaah Modul Ajar / RPP ({persenRPP}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('kelas')}
          className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'kelas'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>2. Observasi PBM di Kelas ({persenKelas}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('tindak_lanjut')}
          className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tindak_lanjut'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>3. Umpan Balik & Rekomendasi</span>
        </button>
      </div>

      {/* Konten Tab 1: Telaah RPP / Modul Ajar */}
      {activeTab === 'rpp' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Instrumen Telaah Administrasi Perencanaan Pembelajaran (Modul Ajar / RPP)
              </h3>
              <p className="text-xs text-slate-500">
                Kriteria penilaian: 1 (Kurang), 2 (Cukup), 3 (Baik), 4 (Sangat Baik)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Skor Diperoleh: </span>
              <strong className="text-sm font-mono-numbers text-emerald-800">
                {totalSkorRPP} / {maxSkorRPP} ({persenRPP}%)
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center">No</th>
                  <th className="px-3 py-2.5 w-48">Aspek Pengamatan</th>
                  <th className="px-3 py-2.5">Kriteria / Indikator Modul Ajar</th>
                  <th className="px-3 py-2.5 w-48 text-center">Skor (1 - 4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INSTRUMEN_TELAAH_RPP.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 text-center font-mono-numbers text-slate-500">
                      {item.id}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      {item.aspek}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 leading-relaxed">
                      {item.kriteria}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                        {[1, 2, 3, 4].map((skorVal) => (
                          <button
                            key={skorVal}
                            type="button"
                            onClick={() => setSkorRPP((prev) => ({ ...prev, [item.id]: skorVal }))}
                            className={`w-7 h-7 text-xs font-bold rounded-md transition-colors ${
                              skorRPP[item.id] === skorVal
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {skorVal}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 text-xs mb-1">
              Catatan Khusus Telaah Perencanaan (RPP / Modul Ajar)
            </label>
            <textarea
              rows={3}
              value={catatanRPP}
              onChange={(e) => setCatatanRPP(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Tuliskan catatan apresiasi atau penyempurnaan RPP..."
            />
          </div>
        </div>
      )}

      {/* Konten Tab 2: Observasi Kelas (PBM) */}
      {activeTab === 'kelas' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Instrumen Observasi Pelaksanaan Proses Pembelajaran di Kelas (PBM)
              </h3>
              <p className="text-xs text-slate-500">
                Tahapan: Pendahuluan, Kegiatan Inti (Student-Centered & HOTS), dan Penutup
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Skor Diperoleh: </span>
              <strong className="text-sm font-mono-numbers text-emerald-800">
                {totalSkorKelas} / {maxSkorKelas} ({persenKelas}%)
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center">No</th>
                  <th className="px-3 py-2.5 w-52">Aspek Pengamatan PBM</th>
                  <th className="px-3 py-2.5">Kriteria Perilaku Guru & Siswa</th>
                  <th className="px-3 py-2.5 w-48 text-center">Skor (1 - 4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INSTRUMEN_OBSERVASI_KELAS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 text-center font-mono-numbers text-slate-500">
                      {item.id}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      {item.aspek}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 leading-relaxed">
                      {item.kriteria}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                        {[1, 2, 3, 4].map((skorVal) => (
                          <button
                            key={skorVal}
                            type="button"
                            onClick={() => setSkorKelas((prev) => ({ ...prev, [item.id]: skorVal }))}
                            className={`w-7 h-7 text-xs font-bold rounded-md transition-colors ${
                              skorKelas[item.id] === skorVal
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {skorVal}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 text-xs mb-1">
              Catatan Pengamatan Langsung di Kelas
            </label>
            <textarea
              rows={3}
              value={catatanKelas}
              onChange={(e) => setCatatanKelas(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Catatan suasana kelas, antusiasme siswa, penggunaan TIK..."
            />
          </div>
        </div>
      )}

      {/* Konten Tab 3: Umpan Balik & Tindak Lanjut */}
      {activeTab === 'tindak_lanjut' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Kesimpulan Hasil Supervisi & Rekomendasi Tindak Lanjut
            </h3>
            <p className="text-xs text-slate-500">
              Formulir umpan balik resmi kepala madrasah/pengawas untuk pengembangan profesional guru
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Telaah RPP (30%)</span>
              <strong className="text-xl font-bold font-mono-numbers text-slate-900">{persenRPP}%</strong>
              <div className="text-xs text-emerald-700 font-semibold mt-1">{kategoriRPP}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Observasi PBM (70%)</span>
              <strong className="text-xl font-bold font-mono-numbers text-slate-900">{persenKelas}%</strong>
              <div className="text-xs text-blue-700 font-semibold mt-1">{kategoriKelas}</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[11px] text-emerald-700 block">Nilai Gabungan Supervisi</span>
              <strong className="text-2xl font-bold font-mono-numbers text-emerald-900">{nilaiAkhir}</strong>
              <div className="text-xs text-emerald-800 font-bold mt-1">Predikat: {kategoriAkhir}</div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Catatan Kelebihan / Aspek Positif yang Diapresiasi
              </label>
              <textarea
                rows={2}
                value={catatanKelebihan}
                onChange={(e) => setCatatanKelebihan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Contoh: Sangat menguasai materi, pembelajaran komunikatif..."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Catatan Aspek yang Perlu Ditingkatkan / Diperbaiki
              </label>
              <textarea
                rows={2}
                value={catatanKelemahan}
                onChange={(e) => setCatatanKelemahan(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Contoh: Perlu memperbanyak variasi media tayang dan manajemen waktu..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Rencana / Rekomendasi Tindak Lanjut
                </label>
                <input
                  type="text"
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Mengikuti pelatihan media digital MGMP MTs..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Target Waktu Penyelesaian
                </label>
                <input
                  type="text"
                  value={targetWaktu}
                  onChange={(e) => setTargetWaktu(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Semester Ganjil 2026/2027"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating / Bottom Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Supervisi {selectedGuru?.nama} · Nilai Akhir: <strong className="text-slate-900 font-mono-numbers">{nilaiAkhir} ({kategoriAkhir})</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedGuru && (
            <button
              onClick={() => onOpenPrintModal(selectedGuru.id)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil Supervisi</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Supervisi Guru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
