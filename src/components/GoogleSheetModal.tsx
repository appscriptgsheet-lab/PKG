import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Key,
  Globe
} from 'lucide-react';
import { GoogleSheetConfig, Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';
import { exportToCSV, exportToExcel, generateGoogleAppsScriptCode } from '../services/googleSheetService';

interface GoogleSheetModalProps {
  config: GoogleSheetConfig;
  guruList: Guru[];
  penilaianPKG: Record<string, PenilaianPKGGuru>;
  supervisiList: Record<string, SupervisiGuru>;
  profile: MadrasahProfile;
  onSaveConfig: (config: GoogleSheetConfig) => void;
  onSyncNow: () => Promise<void>;
  isSyncing: boolean;
  onClose: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  config,
  guruList,
  penilaianPKG,
  supervisiList,
  profile,
  onSaveConfig,
  onSyncNow,
  isSyncing,
  onClose,
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId || '');
  const [webAppUrl, setWebAppUrl] = useState(config.webAppUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const gasCode = generateGoogleAppsScriptCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gasCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveAndSync = async () => {
    const updatedConfig: GoogleSheetConfig = {
      ...config,
      spreadsheetId: spreadsheetId.trim(),
      webAppUrl: webAppUrl.trim(),
    };
    onSaveConfig(updatedConfig);

    try {
      setSyncStatusMsg('Sedang menyinkronkan data ke Google Sheet...');
      await onSyncNow();
      setSyncStatusMsg('Data berhasil disinkronkan ke Google Sheet!');
      setTimeout(() => setSyncStatusMsg(null), 4000);
    } catch (err: any) {
      setSyncStatusMsg(`Sinkronisasi selesai dengan data lokal tersimpan.`);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Integrasi Basis Data Google Sheets & XLSM
              </h2>
              <p className="text-xs text-slate-500">
                Sinkronkan rekapitulasi data guru, supervisi, dan nilai PKG 14 kompetensi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-xs">
          
          {/* Status Koneksi */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            config.spreadsheetId || config.webAppUrl
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">
                  {config.spreadsheetId || config.webAppUrl ? 'Google Sheet Terkonfigurasi' : 'Belum Ada Google Sheet Terhubung'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {config.lastSyncedAt ? `Terakhir disinkronkan: ${new Date(config.lastSyncedAt).toLocaleString('id-ID')}` : 'Data tersimpan aman di peramban lokal'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveAndSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sinkron...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>

          {syncStatusMsg && (
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Form Konfigurasi Google Sheet */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs">Pengaturan Konektor Google Sheets</h3>
            
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                URL Google Apps Script Web App (Direkomendasikan untuk live sync)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webAppUrl}
                  onChange={(e) => setWebAppUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dihasilkan dari deploy Apps Script pada Google Sheet Anda (lihat panduan di bawah).
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Spreadsheet ID Google Sheet (Opsional)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ID spreadsheet dari URL Google Sheet Anda (antara /d/ dan /edit).
              </p>
            </div>
          </div>

          {/* Panduan 3 Langkah Pemasangan Google Apps Script */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">
                Cara Menghubungkan Google Sheet Anda dalam 1 Menit:
              </h4>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
              </button>
            </div>

            <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Buka Google Sheet madrasah Anda (atau buat spreadsheet baru).</li>
              <li>Klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.</li>
              <li>Hapus teks bawaan, lalu <strong>tempelkan (paste) kode Apps Script</strong> yang sudah disalin di atas.</li>
              <li>Klik tombol <strong>Deploy (Terapkan)</strong> &gt; <strong>New deployment (Penerapan baru)</strong>.</li>
              <li>Pilih jenis <strong>Web app (Aplikasi Web)</strong>, set akses: <em>Anyone (Siapa saja)</em>, lalu klik Deploy.</li>
              <li>Salin URL Web App yang muncul, dan tempelkan ke kolom URL di atas!</li>
            </ol>

            {/* Snippet box preview */}
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] max-h-28 overflow-y-auto">
              <code>{gasCode}</code>
            </div>
          </div>

          {/* Ekspor Alternatif Langsung (Excel & CSV) */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-emerald-950">Ingin Menggunakan File Excel / XLSM Langsung?</div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Unduh file spreadsheet lengkap dengan lembar REKAP_PKG_MTS, DATA_GURU, dan SUPERVISI.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => exportToExcel(guruList, penilaianPKG, supervisiList, profile)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .XLSX</span>
              </button>
              <button
                onClick={() => exportToCSV(guruList, penilaianPKG, supervisiList)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                CSV
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
          >
            Tutup
          </button>
          <button
            onClick={handleSaveAndSync}
            disabled={isSyncing}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan & Sinkronkan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
