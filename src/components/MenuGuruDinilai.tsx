import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  ClipboardCheck, 
  Printer, 
  Edit, 
  Trash2, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Guru, PenilaianPKGGuru, SupervisiGuru } from '../types';

interface MenuGuruDinilaiProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  onNavigate: (menu: string, guruId?: string) => void;
  onOpenPrintModal: (guruId: string) => void;
  onAddGuru: (guru: Omit<Guru, 'id'>) => void;
  onUpdateGuru: (guru: Guru) => void;
  onDeleteGuru: (id: string) => void;
}

export const MenuGuruDinilai: React.FC<MenuGuruDinilaiProps> = ({
  guruList,
  penilaianPKG,
  supervisiList,
  onNavigate,
  onOpenPrintModal,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDetailGuru, setSelectedDetailGuru] = useState<Guru | null>(null);

  // Form modal tambah/edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingGuruId, setEditingGuruId] = useState<string | null>(null);

  const [formNama, setFormNama] = useState('');
  const [formPegId, setFormPegId] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formNuptk, setFormNuptk] = useState('');
  const [formJK, setFormJK] = useState<'L' | 'P'>('L');
  const [formGolongan, setFormGolongan] = useState('Penata / III/c');
  const [formJabatan, setFormJabatan] = useState('Guru Muda');
  const [formMapel, setFormMapel] = useState('Fiqih');
  const [formTugas, setFormTugas] = useState('');
  const [formPendidikan, setFormPendidikan] = useState('S1 Pendidikan');
  const [formJam, setFormJam] = useState(24);
  const [formHP, setFormHP] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const filteredGuru = guruList.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      g.nama.toLowerCase().includes(q) ||
      g.nip.includes(q) ||
      (g.pegId && g.pegId.includes(q)) ||
      (g.nik && g.nik.includes(q)) ||
      g.mataPelajaran.toLowerCase().includes(q) ||
      (g.jabatan && g.jabatan.toLowerCase().includes(q));

    const matchStatus = filterStatus === 'all' || g.statusPenilaian === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenAddModal = () => {
    setEditingGuruId(null);
    setFormNama('');
    setFormPegId('');
    setFormNik('');
    setFormNip('');
    setFormNuptk('');
    setFormJK('L');
    setFormGolongan('Penata / III/c');
    setFormJabatan('Guru Muda');
    setFormMapel('Fiqih');
    setFormTugas('');
    setFormPendidikan('S1 Pendidikan Islam');
    setFormJam(24);
    setFormHP('');
    setFormEmail('');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (guru: Guru) => {
    setEditingGuruId(guru.id);
    setFormNama(guru.nama);
    setFormPegId(guru.pegId || '');
    setFormNik(guru.nik || '');
    setFormNip(guru.nip);
    setFormNuptk(guru.nuptk || '');
    setFormJK(guru.jenisKelamin);
    setFormGolongan(guru.pangkatGolongan);
    setFormJabatan(guru.jabatan);
    setFormMapel(guru.mataPelajaran);
    setFormTugas(guru.tugasTambahan || '');
    setFormPendidikan(guru.pendidikanTerakhir);
    setFormJam(guru.jamMengajarMinggu);
    setFormHP(guru.nomorHP || '');
    setFormEmail(guru.email || '');
    setShowFormModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formNip.trim()) return;

    if (editingGuruId) {
      const existing = guruList.find((g) => g.id === editingGuruId);
      if (existing) {
        onUpdateGuru({
          ...existing,
          nama: formNama,
          pegId: formPegId,
          nik: formNik,
          nip: formNip,
          nuptk: formNuptk,
          jenisKelamin: formJK,
          pangkatGolongan: formGolongan,
          jabatan: formJabatan,
          mataPelajaran: formMapel,
          tugasTambahan: formTugas,
          pendidikanTerakhir: formPendidikan,
          jamMengajarMinggu: Number(formJam) || 24,
          nomorHP: formHP,
          email: formEmail,
        });
      }
    } else {
      onAddGuru({
        nama: formNama,
        pegId: formPegId,
        nik: formNik,
        nip: formNip,
        nuptk: formNuptk,
        jenisKelamin: formJK,
        pangkatGolongan: formGolongan,
        jabatan: formJabatan,
        mataPelajaran: formMapel,
        tugasTambahan: formTugas,
        pendidikanTerakhir: formPendidikan,
        jamMengajarMinggu: Number(formJam) || 24,
        nomorHP: formHP,
        email: formEmail,
        statusPenilaian: 'Belum Dinilai',
        dokumenBukti: [],
      });
    }

    setShowFormModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Guru yang Dinilai (Database MTs)</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
              {guruList.length} Pendidik Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen profil guru, status supervisi, dan progres penilaian kinerja 14 kompetensi
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru MTs</span>
        </button>
      </div>

      {/* Filter & Pencarian Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau mapel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Semua Status ({guruList.length})</option>
            <option value="Selesai">Selesai Dinilai</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Belum Dinilai">Belum Dinilai</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Guru MTs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">Nama & NIP Guru</th>
                <th className="px-3 py-3">Mata Pelajaran</th>
                <th className="px-3 py-3">Pangkat / Gol.</th>
                <th className="px-3 py-3">Tugas Tambahan</th>
                <th className="px-3 py-3 text-center">Hasil PKG</th>
                <th className="px-3 py-3 text-center">Supervisi</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuru.length > 0 ? (
                filteredGuru.map((guru, index) => {
                  const pkg = penilaianPKG[guru.id];
                  const sup = supervisiList[guru.id];

                  return (
                    <tr key={guru.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 text-center font-mono-numbers text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{guru.nama}</div>
                        <div className="text-[10px] font-mono-numbers text-slate-500 flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                          {guru.pegId && (
                            <span>PEG: <strong className="text-emerald-800">{guru.pegId}</strong></span>
                          )}
                          {guru.nik && (
                            <span>NIK: <span className="text-slate-600">{guru.nik}</span></span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3 font-medium text-slate-700">
                        {guru.mataPelajaran}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        <div>{guru.pangkatGolongan}</div>
                        <div className="text-[10px] text-slate-400">{guru.jabatan}</div>
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {guru.tugasTambahan || '-'}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {pkg ? (
                          <div>
                            <span className="font-bold font-mono-numbers text-slate-900">
                              {pkg.nilaiPKG100.toFixed(1)}
                            </span>
                            <div className="text-[10px] font-semibold text-emerald-700">
                              {pkg.sebutan}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {sup ? (
                          <div>
                            <span className="font-bold font-mono-numbers text-slate-900">
                              {sup.observasiPBM.persentase}%
                            </span>
                            <div className="text-[10px] font-semibold text-blue-700">
                              {sup.observasiPBM.kategori}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          guru.statusPenilaian === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : guru.statusPenilaian === 'Dalam Proses'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {guru.statusPenilaian}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDetailGuru(guru)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Detail Biodata & Berkas"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onNavigate('penilaian', guru.id)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Form Penilaian 14 Kompetensi"
                          >
                            Nilai PKG
                          </button>

                          <button
                            onClick={() => onNavigate('supervisi', guru.id)}
                            className="px-2 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Supervisi Kelas & Telaah RPP"
                          >
                            Supervisi
                          </button>

                          <button
                            onClick={() => onOpenPrintModal(guru.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Cetak Format Penilaian"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(guru)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Data Guru"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus data guru ${guru.nama}?`)) {
                                onDeleteGuru(guru.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Tidak ditemukan data guru yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Biodata & Portofolio Guru */}
      {selectedDetailGuru && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedDetailGuru.nama}</h3>
                <p className="text-xs text-slate-500 font-mono-numbers">
                  NIP. {selectedDetailGuru.nip} · NUPTK: {selectedDetailGuru.nuptk || '-'}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetailGuru(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">Pangkat / Golongan:</span>
                  <strong className="text-slate-800">{selectedDetailGuru.pangkatGolongan}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Jabatan Fungsional:</span>
                  <strong className="text-slate-800">{selectedDetailGuru.jabatan}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Mata Pelajaran:</span>
                  <strong className="text-emerald-700">{selectedDetailGuru.mataPelajaran}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Tugas Tambahan:</span>
                  <strong className="text-slate-800">{selectedDetailGuru.tugasTambahan || 'Tidak Ada'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Jam Mengajar Tatap Muka:</span>
                  <strong className="text-slate-800">{selectedDetailGuru.jamMengajarMinggu} Jam / Minggu</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Pendidikan Terakhir:</span>
                  <strong className="text-slate-800">{selectedDetailGuru.pendidikanTerakhir}</strong>
                </div>
              </div>

              {/* Berkas Bukti Fisik */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Berkas Portofolio / Bukti Fisik</h4>
                {selectedDetailGuru.dokumenBukti && selectedDetailGuru.dokumenBukti.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDetailGuru.dokumenBukti.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <div>
                            <div className="font-semibold text-slate-800">{doc.nama}</div>
                            <div className="text-[10px] text-slate-400">{doc.tipe} · {doc.tanggalUnggah}</div>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Buka</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Belum ada bukti fisik diunggah.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedDetailGuru(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const id = selectedDetailGuru.id;
                  setSelectedDetailGuru(null);
                  onNavigate('penilaian', id);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              >
                Mulai Penilaian PKG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Guru */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingGuruId ? 'Edit Data Guru MTs' : 'Tambah Guru MTs Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lengkapi biodata dan jabatan fungsional untuk instrumen PKG dan supervisi
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Ridwan, S.Pd.I"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    required
                    placeholder="19820315 200801 1 012"
                    value={formNip}
                    onChange={(e) => setFormNip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PEG ID (Simpatika / EMIS)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 91000078102708"
                    value={formPegId}
                    onChange={(e) => setFormPegId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1506022009780002"
                    value={formNik}
                    onChange={(e) => setFormNik(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NUPTK (Opsional)</label>
                  <input
                    type="text"
                    placeholder="16 digit NUPTK"
                    value={formNuptk}
                    onChange={(e) => setFormNuptk(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formJK}
                    onChange={(e) => setFormJK(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <select
                    value={formGolongan}
                    onChange={(e) => setFormGolongan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Penata Muda / III/a">Penata Muda / III/a</option>
                    <option value="Penata Muda Tingkat I / III/b">Penata Muda Tingkat I / III/b</option>
                    <option value="Penata / III/c">Penata / III/c</option>
                    <option value="Penata Tingkat I / III/d">Penata Tingkat I / III/d</option>
                    <option value="Pembina / IV/a">Pembina / IV/a</option>
                    <option value="Pembina Tingkat I / IV/b">Pembina Tingkat I / IV/b</option>
                    <option value="Pembina Utama Muda / IV/c">Pembina Utama Muda / IV/c</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan Fungsional</label>
                  <select
                    value={formJabatan}
                    onChange={(e) => setFormJabatan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Guru Pertama">Guru Pertama</option>
                    <option value="Guru Muda">Guru Muda</option>
                    <option value="Guru Madya">Guru Madya</option>
                    <option value="Guru Utama">Guru Utama</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran Diampu</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fiqih, IPA, Matematika"
                    value={formMapel}
                    onChange={(e) => setFormMapel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tugas Tambahan</label>
                  <input
                    type="text"
                    placeholder="Wali Kelas VII-A / Waka Kurikulum"
                    value={formTugas}
                    onChange={(e) => setFormTugas(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    placeholder="S1 Pendidikan Agama Islam"
                    value={formPendidikan}
                    onChange={(e) => setFormPendidikan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mengajar Tatap Muka (JTM)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formJam}
                    onChange={(e) => setFormJam(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                >
                  {editingGuruId ? 'Simpan Perubahan' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
