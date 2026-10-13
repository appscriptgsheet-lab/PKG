import React, { useRef } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  HardDrive,
  ShieldCheck
} from 'lucide-react';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';
import { exportToCSV, exportToExcel } from '../services/googleSheetService';

interface DatabaseModalProps {
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  onRestoreData: (backup: {
    guruList: Guru[];
    penilaianPKG: Record<string, PenilaianPKGGuru>;
    supervisiList: Record<string, SupervisiGuru>;
  }) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  guruList,
  penilaianPKG,
  supervisiList,
  profile,
  onRestoreData,
  onResetData,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Backup JSON
  const handleDownloadBackupJSON = () => {
    const backupData = {
      app: 'SIPKG-MTS',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      madrasah: profile,
      data: {
        guruList,
        penilaianPKG,
        supervisiList,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BACKUP_DATABASE_SIPKG_MTS_${profile.tahunPelajaran.replace('/', '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restore JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.data && json.data.guruList) {
          onRestoreData({
            guruList: json.data.guruList,
            penilaianPKG: json.data.penilaianPKG || {},
            supervisiList: json.data.supervisiList || {},
          });
          onClose();
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pusat Basis Data & Cadangan Sistem (Mandiri)
              </h2>
              <p className="text-xs text-slate-500">
                Aplikasi bekerja 100% mandiri secara offline dengan penyimpanan lokal aman
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          
          {/* Status Database */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Database Lokal Sistem Aktif</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Tersimpan otomatis: <strong>{guruList.length} Guru</strong> · <strong>{Object.keys(penilaianPKG).length} Nilai PKG</strong> · <strong>{Object.keys(supervisiList).length} Supervisi</strong>
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              100% Offline
            </span>
          </div>

          {/* Opsi Ekspor Spreadsheet Excel (.XLSX) */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Unduh Berkas Excel (.XLSX)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Format Multi-Sheet</span>
            </div>
            <p className="text-slate-500 text-[11px] mb-3 leading-relaxed">
              Dapatkan file spreadsheet lengkap siap cetak berisi lembar <strong>REKAP_PKG_MTS</strong>, <strong>DATA_GURU_MTS</strong>, dan <strong>SUPERVISI_AKADEMIK</strong> langsung ke komputer Anda tanpa memerlukan login Google Sheet.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToExcel(guruList, penilaianPKG, supervisiList, profile)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => exportToCSV(guruList, penilaianPKG, supervisiList)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
              >
                Unduh CSV
              </button>
            </div>
          </div>

          {/* Opsi Cadangan JSON (Backup & Restore) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Cadangkan Data (.JSON)</span>
              </div>
              <p className="text-slate-500 text-[11px] mb-3">
                Simpan seluruh data evaluasi dan biodata guru ke dalam 1 file cadangan aman.
              </p>
              <button
                onClick={handleDownloadBackupJSON}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition-colors"
              >
                Unduh File Cadangan
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Pulihkan Data (.JSON)</span>
              </div>
              <p className="text-slate-500 text-[11px] mb-3">
                Muat kembali data dari file cadangan yang telah disimpan sebelumnya.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold transition-colors"
              >
                Pilih File Cadangan
              </button>
            </div>
          </div>

          {/* Reset ke Data Awal */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Reset Data MTs Raudhatul Jannah</div>
              <p className="text-[11px] text-slate-500">
                Kembalikan data 12 guru dan supervisi resmi MTs Raudhatul Jannah Semau.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset semua data ke data resmi 12 Guru MTs Raudhatul Jannah Semau?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs shrink-0"
            >
              Reset Data
            </button>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
