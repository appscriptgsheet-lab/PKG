import React, { useState } from 'react';
import { 
  Award, 
  Eye, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';
import { KOMPETENSI_PKG_14 } from '../data/standarPKG';

interface DashboardGuruProps {
  guru: Guru;
  penilaianPKG?: PenilaianPKGGuru;
  supervisi?: SupervisiGuru;
  profile: MadrasahProfile;
  onOpenPrintModal: (guruId: string) => void;
  onAddDokumenBukti: (guruId: string, nama: string, url: string, tipe: string) => void;
}

export const DashboardGuru: React.FC<DashboardGuruProps> = ({
  guru,
  penilaianPKG,
  supervisi,
  profile,
  onOpenPrintModal,
  onAddDokumenBukti,
}) => {
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docNama, setDocNama] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docTipe, setDocTipe] = useState('PDF');

  // Hitung rata-rata per 4 Domain
  const domainScores: Record<string, { totalMentah: number; maxMentah: number; count: number }> = {
    Pedagogik: { totalMentah: 0, maxMentah: 0, count: 0 },
    Kepribadian: { totalMentah: 0, maxMentah: 0, count: 0 },
    Sosial: { totalMentah: 0, maxMentah: 0, count: 0 },
    Profesional: { totalMentah: 0, maxMentah: 0, count: 0 },
  };

  if (penilaianPKG) {
    KOMPETENSI_PKG_14.forEach((komp) => {
      const skorData = penilaianPKG.skorPerKompetensi[komp.id];
      if (skorData) {
        domainScores[komp.domain].totalMentah += skorData.totalSkorMentah;
        domainScores[komp.domain].maxMentah += skorData.skorMaksimalMentah;
        domainScores[komp.domain].count += 1;
      }
    });
  }

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNama.trim() || !docUrl.trim()) return;
    onAddDokumenBukti(guru.id, docNama, docUrl, docTipe);
    setDocNama('');
    setDocUrl('');
    setShowAddDocModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Kartu Profil Guru */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {guru.nama.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{guru.nama}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                guru.statusPenilaian === 'Selesai'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {guru.statusPenilaian}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              {guru.pegId && <span>PEG ID: <strong className="font-mono-numbers text-emerald-800 font-bold">{guru.pegId}</strong></span>}
              {guru.nik && <span>NIK: <strong className="font-mono-numbers text-slate-700">{guru.nik}</strong></span>}
              <span>Pangkat: <strong className="text-slate-700">{guru.pangkatGolongan}</strong></span>
              <span>Mapel: <strong className="text-emerald-700 font-bold">{guru.mataPelajaran}</strong></span>
              {guru.tugasTambahan && guru.tugasTambahan !== '-' && (
                <span>Tugas: <strong className="text-slate-700">{guru.tugasTambahan}</strong></span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenPrintModal(guru.id)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Hasil PKG & Supervisi</span>
          </button>
        </div>
      </div>

      {/* 3 Kartu Ringkasan Kinerja Guru */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Kartu Skor PKG */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hasil PKG 14 Kompetensi</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          {penilaianPKG ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono-numbers text-slate-900">
                  {penilaianPKG.nilaiPKG100.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-100 text-emerald-800">
                  {penilaianPKG.sebutan}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Skor Mentah: <strong>{penilaianPKG.totalSkorPKG} / 56</strong></span>
                <span>Faktor NPK: <strong>{penilaianPKG.persentaseKinerja}%</strong></span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-amber-700">
              Penilaian kinerja sedang dalam penjadwalan oleh tim asesor.
            </div>
          )}
        </div>

        {/* Kartu Angka Kredit Tahunan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Angka Kredit PKG</span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          {penilaianPKG ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono-numbers text-emerald-700">
                  {penilaianPKG.angkaKreditTahunan}
                </span>
                <span className="text-xs text-slate-500">AK / Tahun</span>
              </div>
              <p className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Berdasarkan {guru.pangkatGolongan} dan {guru.jamMengajarMinggu} jam tatap muka/minggu.
              </p>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              Menunggu hasil kalkulasi nilai PKG 14 kompetensi.
            </div>
          )}
        </div>

        {/* Kartu Supervisi Pembelajaran */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Supervisi Akademik</span>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          {supervisi ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono-numbers text-slate-900">
                  {supervisi.observasiPBM.persentase}%
                </span>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-lg font-bold bg-blue-100 text-blue-800">
                  {supervisi.observasiPBM.kategori}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Telaah RPP: <strong>{supervisi.telaahRPP.persentase}%</strong></span>
                <span>PBM Kelas: <strong>{supervisi.observasiPBM.persentase}%</strong></span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              Belum ada data supervisi pada semester ini.
            </div>
          )}
        </div>

      </div>

      {/* Rincian 4 Domain Kompetensi PKG */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pencapaian 4 Domain Kompetensi Guru</h2>
            <p className="text-xs text-slate-500">Standar evaluasi kompetensi pendidik madrasah Kemenag</p>
          </div>
          <span className="text-xs font-mono-numbers text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
            Tahun Penilaian: {profile.tahunPelajaran}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(domainScores).map(([domain, data]) => {
            const persen = data.maxMentah > 0 ? Math.round((data.totalMentah / data.maxMentah) * 100) : 0;
            return (
              <div key={domain} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">{domain}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono-numbers text-slate-900">{persen}%</span>
                  <span className="text-xs text-slate-500">{data.totalMentah}/{data.maxMentah} poin</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${persen}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  {domain === 'Pedagogik' && '7 Kompetensi Mengajar'}
                  {domain === 'Kepribadian' && '3 Kompetensi Teladan'}
                  {domain === 'Sosial' && '2 Kompetensi Komunikasi'}
                  {domain === 'Profesional' && '2 Kompetensi Keilmuan'}
                </div>
              </div>
            );
          })}
        </div>

        {penilaianPKG?.catatanPenilai && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Catatan Tim Penilai / Kepala Madrasah</span>
            </div>
            <p className="text-emerald-950 leading-relaxed">{penilaianPKG.catatanPenilai}</p>
            {penilaianPKG.rekomendasiPKB && (
              <p className="text-emerald-900 mt-2 font-medium">
                <strong>Rekomendasi PKB:</strong> {penilaianPKG.rekomendasiPKB}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Dua Kolom: Hasil Supervisi Terakhir & Dokumen Bukti Fisik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom 1: Lembar Tindak Lanjut Supervisi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Umpan Balik Supervisi Pembelajaran</h3>
              <p className="text-xs text-slate-500">Catatan pengamatan langsung di ruang kelas</p>
            </div>
            {supervisi && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {supervisi.tanggal}
              </span>
            )}
          </div>

          {supervisi ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-semibold text-emerald-800">Kelebihan yang Diapresiasi:</span>
                <p className="text-slate-700 mt-1 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 leading-relaxed">
                  {supervisi.catatanKelebihan || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-amber-800">Aspek Perlu Ditingkatkan:</span>
                <p className="text-slate-700 mt-1 p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 leading-relaxed">
                  {supervisi.catatanKelemahan || '-'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-800">Rencana Tindak Lanjut:</span>
                <p className="text-slate-700 mt-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 leading-relaxed">
                  {supervisi.tindakLanjut || '-'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada catatan supervisi tersimpan untuk Anda.
            </div>
          )}
        </div>

        {/* Kolom 2: Berkas Portofolio / Bukti Fisik PKG */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Berkas Bukti Fisik & Portofolio</h3>
              <p className="text-xs text-slate-500">Modul ajar, silabus, kisi-kisi asesmen, dan LKPD</p>
            </div>
            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tambah Berkas</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {guru.dokumenBukti && guru.dokumenBukti.length > 0 ? (
              guru.dokumenBukti.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors bg-slate-50/50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate">{doc.nama}</div>
                      <div className="text-[11px] text-slate-400">
                        {doc.tipe} · Diunggah {doc.tanggalUnggah}
                      </div>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors shrink-0"
                    title="Buka Tautan Berkas"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada bukti fisik diunggah. Klik tombol di atas untuk menyematkan tautan Google Drive / Cloud.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Tambah Tautan Berkas */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Tautan Bukti Fisik</h3>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan nama dokumen dan tautan Google Drive / penyimpanan cloud Anda
            </p>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Dokumen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Kurikulum Merdeka Semester 1"
                  value={docNama}
                  onChange={(e) => setDocNama(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Berkas</label>
                <select
                  value={docTipe}
                  onChange={(e) => setDocTipe(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="PDF">Dokumen PDF (Modul / RPP)</option>
                  <option value="DOCX">Microsoft Word (.docx)</option>
                  <option value="XLSX">Spreadsheet Excel (.xlsx)</option>
                  <option value="DRIVE">Folder Google Drive</option>
                  <option value="LINK">Tautan Web / Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tautan / URL Berkas</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
