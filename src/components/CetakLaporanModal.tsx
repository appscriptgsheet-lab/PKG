import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  FileText, 
  Award, 
  CheckCircle2, 
  Eye, 
  Download 
} from 'lucide-react';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';
import { KOMPETENSI_PKG_14 } from '../data/standarPKG';
import { getParameterGolongan } from '../services/pkgCalculator';
import { KopMadrasahResmi } from './Logos';

interface CetakLaporanModalProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  initialGuruId?: string;
  onClose: () => void;
}

export const CetakLaporanModal: React.FC<CetakLaporanModalProps> = ({
  guruList,
  penilaianPKG,
  supervisiList,
  profile,
  initialGuruId,
  onClose,
}) => {
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    initialGuruId || guruList[0]?.id || ''
  );
  const [tipeLaporan, setTipeLaporan] = useState<'format_1b' | 'format_1c' | 'format_1d' | 'supervisi' | 'rekap_semua'>('format_1c');

  const selectedGuru = guruList.find((g) => g.id === selectedGuruId) || guruList[0];
  const pkg = selectedGuru ? penilaianPKG[selectedGuru.id] : undefined;
  const sup = selectedGuru ? supervisiList[selectedGuru.id] : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header Modal (No-print) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pratinjau Cetak Berkas Format Resmi PKG & Supervisi MTs
              </h2>
              <p className="text-[11px] text-slate-500">
                Standar formulir Kementerian Agama & Ditjen Guru Tenaga Kependidikan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kontrol Pilihan Format (No-print) */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2 no-print text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Pilih Guru:</span>
            <select
              value={selectedGuruId}
              onChange={(e) => setSelectedGuruId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {guruList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama} ({g.mataPelajaran})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setTipeLaporan('format_1c')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipeLaporan === 'format_1c' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Format 1C (Rekap PKG)
            </button>
            <button
              onClick={() => setTipeLaporan('format_1b')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipeLaporan === 'format_1b' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Format 1B (14 Kompetensi)
            </button>
            <button
              onClick={() => setTipeLaporan('format_1d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipeLaporan === 'format_1d' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Format 1D (Angka Kredit)
            </button>
            <button
              onClick={() => setTipeLaporan('supervisi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipeLaporan === 'supervisi' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Instrumen Supervisi
            </button>
            <button
              onClick={() => setTipeLaporan('rekap_semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tipeLaporan === 'rekap_semua' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Rekap Seluruh Guru
            </button>
          </div>
        </div>

        {/* Area Dokumen Kertas Cetak (A4 Friendly) */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-100 flex justify-center">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-slate-200 text-black text-xs font-sans print-page">
            
            {/* KOP RESMI SURAT KEDINASAN (STANDAR TEKS RESMI TANPA LOGO) */}
            <div className="mb-6">
              <KopMadrasahResmi 
                namaMadrasah={profile.namaMadrasah}
                nsm={profile.nsm}
                npsn={profile.npsn}
                alamat={profile.alamat}
              />
            </div>

            {/* FORMAT 1C: REKAPITULASI HASIL PENILAIAN KINERJA GURU */}
            {tipeLaporan === 'format_1c' && selectedGuru && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-xs font-bold uppercase underline">FORMAT 1C</div>
                  <div className="text-sm font-bold uppercase mt-0.5">
                    REKAPITULASI HASIL PENILAIAN KINERJA GURU KELAS / MATA PELAJARAN
                  </div>
                  <div className="text-xs">Tahun Penilaian: {profile.tahunPelajaran}</div>
                </div>

                {/* IDENTITAS */}
                <div className="border border-black p-3 mb-4 space-y-1 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nama Guru</span>
                    <span className="col-span-2">: {selectedGuru.nama}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">NIP / NUPTK</span>
                    <span className="col-span-2">: {selectedGuru.nip} / {selectedGuru.nuptk || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Pangkat / Golongan / TMT</span>
                    <span className="col-span-2">: {selectedGuru.pangkatGolongan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Jabatan Fungsional</span>
                    <span className="col-span-2">: {selectedGuru.jabatan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Mata Pelajaran Diampu</span>
                    <span className="col-span-2">: {selectedGuru.mataPelajaran}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Tugas Tambahan</span>
                    <span className="col-span-2">: {selectedGuru.tugasTambahan || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nama Penilai</span>
                    <span className="col-span-2">: {pkg?.penilaiNama || profile.kepalaMadrasah}</span>
                  </div>
                </div>

                {/* TABEL SKOR 14 KOMPETENSI */}
                <table className="w-full border-collapse border border-black text-[11px] mb-4">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-black p-1.5 w-10">No</th>
                      <th className="border border-black p-1.5 text-left">Kompetensi Guru (PKG)</th>
                      <th className="border border-black p-1.5 w-24">Skor Standar (1-4)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KOMPETENSI_PKG_14.map((komp) => {
                      const skorStandar = pkg?.skorPerKompetensi[komp.id]?.skorStandar ?? 4;
                      return (
                        <tr key={komp.id}>
                          <td className="border border-black p-1 text-center font-mono-numbers">{komp.nomor}</td>
                          <td className="border border-black p-1">{komp.nama}</td>
                          <td className="border border-black p-1 text-center font-mono-numbers font-bold">
                            {skorStandar}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="border border-black p-1.5 text-right">
                        Total Skor Penilaian Kinerja Guru (Maks 56)
                      </td>
                      <td className="border border-black p-1.5 text-center font-mono-numbers text-xs">
                        {pkg?.totalSkorPKG ?? 56}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="border border-black p-1.5 text-right">
                        Konversi Nilai PKG Skala 100 ((Skor/56) × 100)
                      </td>
                      <td className="border border-black p-1.5 text-center font-mono-numbers text-xs">
                        {pkg ? pkg.nilaiPKG100.toFixed(2) : '100.00'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="border border-black p-1.5 text-right">
                        Kategori / Sebutan Nilai Kinerja
                      </td>
                      <td className="border border-black p-1.5 text-center text-xs">
                        {pkg?.sebutan ?? 'Amat Baik'}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="border border-black p-1.5 text-right">
                        Persentase Angka Kredit (NPK)
                      </td>
                      <td className="border border-black p-1.5 text-center text-xs font-mono-numbers">
                        {pkg ? `${pkg.persentaseKinerja}%` : '125%'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* TANDA TANGAN RESMI */}
                <div className="grid grid-cols-2 text-center text-xs mt-8 pt-4">
                  <div>
                    <p>Guru yang Dinilai,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedGuru.nama}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {selectedGuru.nip}</p>
                  </div>
                  <div>
                    <p>{profile.kabupatenKota}, {pkg?.tanggalPenilaian || 'Oktober 2026'}</p>
                    <p>Kepala Madrasah / Penilai,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{profile.kepalaMadrasah}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {profile.nipKepala}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FORMAT 1D: PENGHITUNGAN ANGKA KREDIT PKG */}
            {tipeLaporan === 'format_1d' && selectedGuru && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-xs font-bold uppercase underline">FORMAT 1D</div>
                  <div className="text-sm font-bold uppercase mt-0.5">
                    FORMAT PENGHITUNGAN ANGKA KREDIT JABATAN FUNGSIONAL GURU
                  </div>
                  <div className="text-xs">Tahun Penilaian: {profile.tahunPelajaran}</div>
                </div>

                <div className="border border-black p-3 mb-5 space-y-1 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nama Guru</span>
                    <span className="col-span-2">: {selectedGuru.nama}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Pangkat / Golongan</span>
                    <span className="col-span-2">: {selectedGuru.pangkatGolongan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nilai PKG (Skala 100)</span>
                    <span className="col-span-2">: {pkg ? pkg.nilaiPKG100.toFixed(2) : '92.86'} ({pkg?.sebutan || 'Amat Baik'})</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Faktor NPK</span>
                    <span className="col-span-2">: {pkg ? `${pkg.persentaseKinerja}%` : '125%'}</span>
                  </div>
                </div>

                {/* FORMULA BOX */}
                <div className="bg-slate-50 border border-black p-4 mb-6 text-xs space-y-2">
                  <div className="font-bold text-center underline mb-2">RUMUS RESMI PENGHITUNGAN ANGKA KREDIT TAHUNAN:</div>
                  <div className="text-center font-mono-numbers font-bold text-sm bg-white p-2 border border-slate-300">
                    AK Tahunan = ((AKK - AKPKB - AKP) × (JM / JWM) × NPK) / 4
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-1 pt-2">
                    <p>• AKK (Angka Kredit Kumulatif Golongan): <strong>{getParameterGolongan(selectedGuru.pangkatGolongan).akk}</strong></p>
                    <p>• AKPKB (Pengembangan Keprofesian Berkelanjutan): <strong>{getParameterGolongan(selectedGuru.pangkatGolongan).akpkb}</strong></p>
                    <p>• AKP (Unsur Penunjang): <strong>{getParameterGolongan(selectedGuru.pangkatGolongan).akp}</strong></p>
                    <p>• Target AK Pembelajaran 4 Tahun: <strong>{getParameterGolongan(selectedGuru.pangkatGolongan).akTarget4Tahun}</strong></p>
                    <p>• Jam Mengajar Nyata (JM): <strong>{selectedGuru.jamMengajarMinggu} Jam</strong> / Jam Wajib Mengajar (JWM): 24 Jam</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-300 flex items-center justify-between font-bold">
                    <span>Angka Kredit Pembelajaran yang Diperoleh Tahun Ini:</span>
                    <span className="text-base font-mono-numbers text-emerald-800">
                      {pkg?.angkaKreditTahunan ?? 20.25} AK
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 text-center text-xs mt-12 pt-4">
                  <div>
                    <p>Guru yang Dinilai,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedGuru.nama}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {selectedGuru.nip}</p>
                  </div>
                  <div>
                    <p>{profile.kabupatenKota}, {pkg?.tanggalPenilaian || 'Oktober 2026'}</p>
                    <p>Kepala Madrasah,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{profile.kepalaMadrasah}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {profile.nipKepala}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FORMAT SUPERVISI PEMBELAJARAN */}
            {tipeLaporan === 'supervisi' && selectedGuru && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-xs font-bold uppercase underline">LEMBAR SUPERVISI</div>
                  <div className="text-sm font-bold uppercase mt-0.5">
                    INSTRUMEN SUPERVISI AKADEMIK & OBSERVASI PEMBELAJARAN DI KELAS
                  </div>
                  <div className="text-xs">Madrasah Tsanawiyah · Semester {sup?.semester || 'Ganjil'} {profile.tahunPelajaran}</div>
                </div>

                <div className="border border-black p-3 mb-4 space-y-1 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nama Guru</span>
                    <span className="col-span-2">: {selectedGuru.nama}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Mata Pelajaran</span>
                    <span className="col-span-2">: {selectedGuru.mataPelajaran}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Tanggal Pelaksanaan</span>
                    <span className="col-span-2">: {sup?.tanggal || 'September 2026'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Supervisor</span>
                    <span className="col-span-2">: {sup?.supervisorNama || profile.kepalaMadrasah}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border border-black p-3">
                    <div className="font-bold border-b border-black pb-1 mb-2">1. Telaah Modul Ajar / RPP</div>
                    <div className="flex justify-between text-xs">
                      <span>Ketercapaian:</span>
                      <strong className="font-mono-numbers">{sup?.telaahRPP.persentase ?? 95}%</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Kategori:</span>
                      <strong>{sup?.telaahRPP.kategori ?? 'Sangat Baik'}</strong>
                    </div>
                    <p className="text-[10px] text-slate-700 mt-2 italic">
                      "{sup?.telaahRPP.catatan || 'Perencanaan pembelajaran tersusun lengkap.'}"
                    </p>
                  </div>

                  <div className="border border-black p-3">
                    <div className="font-bold border-b border-black pb-1 mb-2">2. Observasi PBM di Kelas</div>
                    <div className="flex justify-between text-xs">
                      <span>Ketercapaian:</span>
                      <strong className="font-mono-numbers">{sup?.observasiPBM.persentase ?? 96}%</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Kategori:</span>
                      <strong>{sup?.observasiPBM.kategori ?? 'Sangat Baik'}</strong>
                    </div>
                    <p className="text-[10px] text-slate-700 mt-2 italic">
                      "{sup?.observasiPBM.catatan || 'Pembelajaran berlangsung aktif dan berpusat pada siswa.'}"
                    </p>
                  </div>
                </div>

                <div className="border border-black p-3 mb-6 text-xs space-y-2">
                  <div className="font-bold">Umpan Balik & Tindak Lanjut:</div>
                  <p>• <strong>Kelebihan:</strong> {sup?.catatanKelebihan || 'Komunikasi islami santun dan penguasaan materi sangat baik.'}</p>
                  <p>• <strong>Aspek Perbaikan:</strong> {sup?.catatanKelemahan || 'Pengayaan media tayang interaktif.'}</p>
                  <p>• <strong>Rekomendasi Tindak Lanjut:</strong> {sup?.tindakLanjut || 'Mengikuti workshop media pembelajaran digital.'}</p>
                </div>

                <div className="grid grid-cols-2 text-center text-xs mt-8">
                  <div>
                    <p>Guru yang Disupervisi,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedGuru.nama}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {selectedGuru.nip}</p>
                  </div>
                  <div>
                    <p>{profile.kabupatenKota}, {sup?.tanggal || 'September 2026'}</p>
                    <p>Supervisor / Kepala MTs,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{profile.kepalaMadrasah}</p>
                    <p className="font-mono-numbers text-[10px]">NIP. {profile.nipKepala}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FORMAT REKAP SELURUH GURU */}
            {tipeLaporan === 'rekap_semua' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-sm font-bold uppercase">
                    REKAPITULASI PENILAIAN KINERJA GURU (PKG) DAN SUPERVISI
                  </div>
                  <div className="text-xs uppercase font-semibold">{profile.namaMadrasah}</div>
                  <div className="text-xs">Tahun Pelajaran: {profile.tahunPelajaran}</div>
                </div>

                <table className="w-full border-collapse border border-black text-[10px] mb-6">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1 w-8">No</th>
                      <th className="border border-black p-1 text-left">Nama & NIP Guru</th>
                      <th className="border border-black p-1">Gol.</th>
                      <th className="border border-black p-1">Mapel</th>
                      <th className="border border-black p-1">PKG (56)</th>
                      <th className="border border-black p-1">Nilai 100</th>
                      <th className="border border-black p-1">Sebutan</th>
                      <th className="border border-black p-1">AK Thn</th>
                      <th className="border border-black p-1">Supervisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guruList.map((g, idx) => {
                      const p = penilaianPKG[g.id];
                      const s = supervisiList[g.id];
                      return (
                        <tr key={g.id}>
                          <td className="border border-black p-1 text-center font-mono-numbers">{idx + 1}</td>
                          <td className="border border-black p-1">
                            <div className="font-semibold">{g.nama}</div>
                            <div className="font-mono-numbers text-[9px]">{g.nip}</div>
                          </td>
                          <td className="border border-black p-1 text-center">{g.pangkatGolongan.split('/')[1] || g.pangkatGolongan}</td>
                          <td className="border border-black p-1">{g.mataPelajaran}</td>
                          <td className="border border-black p-1 text-center font-mono-numbers">{p ? p.totalSkorPKG : '-'}</td>
                          <td className="border border-black p-1 text-center font-mono-numbers font-bold">{p ? p.nilaiPKG100.toFixed(1) : '-'}</td>
                          <td className="border border-black p-1 text-center">{p ? p.sebutan : 'Belum'}</td>
                          <td className="border border-black p-1 text-center font-mono-numbers font-bold">{p ? p.angkaKreditTahunan : '-'}</td>
                          <td className="border border-black p-1 text-center font-mono-numbers">{s ? `${s.observasiPBM.persentase}%` : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="text-right text-xs pr-4">
                  <p>{profile.kabupatenKota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="mt-1">Mengetahui, Kepala Madrasah</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{profile.kepalaMadrasah}</p>
                  <p className="font-mono-numbers text-[10px]">NIP. {profile.nipKepala}</p>
                </div>
              </div>
            )}

            {/* FORMAT 1B: LAPORAN EVALUASI PKG (14 KOMPETENSI) */}
            {tipeLaporan === 'format_1b' && selectedGuru && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-xs font-bold uppercase underline">FORMAT 1B</div>
                  <div className="text-sm font-bold uppercase mt-0.5">
                    LAPORAN EVALUASI PENILAIAN KINERJA GURU MATA PELAJARAN
                  </div>
                  <div className="text-xs">{profile.namaMadrasah} · {profile.tahunPelajaran}</div>
                </div>

                <div className="space-y-4 text-xs">
                  {KOMPETENSI_PKG_14.map((komp) => {
                    const skorData = pkg?.skorPerKompetensi[komp.id];
                    return (
                      <div key={komp.id} className="border border-black p-2.5">
                        <div className="flex justify-between font-bold border-b border-black pb-1 mb-1.5">
                          <span>Kompetensi {komp.nomor}: {komp.nama}</span>
                          <span className="font-mono-numbers">Nilai: {skorData?.skorStandar ?? 4} / 4</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mb-1">{komp.deskripsi}</p>
                        <div className="text-[10px] text-slate-600 font-mono-numbers">
                          Skor Indikator Mentah: {skorData?.totalSkorMentah ?? komp.indikator.length * 2} / {komp.indikator.length * 2} ({skorData?.persentase ?? 100}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
