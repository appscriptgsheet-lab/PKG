import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { MadrasahProfile, UserSession } from '../types';

interface NavbarProps {
  session: UserSession;
  profile: MadrasahProfile;
  isSheetConnected: boolean;
  onOpenSheetModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onSyncQuick: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  profile,
  isSheetConnected,
  onOpenSheetModal,
  onOpenAuthModal,
  onLogout,
  onSyncQuick,
  isSyncing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  SIPKG-MTs
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800">
                  {profile.tahunPelajaran}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {profile.namaMadrasah}
              </p>
            </div>
          </div>

          {/* Zone 2: Fast Meta & Integrasi */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <button
              onClick={onOpenSheetModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                isSheetConnected 
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              title="Kelola Koneksi Google Sheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">
                {isSheetConnected ? 'Google Sheet Terhubung' : 'Hubungkan Google Sheet'}
              </span>
            </button>

            {isSheetConnected && (
              <button
                onClick={onSyncQuick}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Sinkronkan data rekap sekarang"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{isSyncing ? 'Sinkron...' : 'Sinkron Data'}</span>
              </button>
            )}
          </div>

          {/* Zone 3: Sesi Akun & Switch Peran */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                  {session.nama}
                </span>
                {session.role === 'admin' ? (
                  <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    <UserCheck className="w-3 h-3 mr-0.5" /> Guru MTs
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {session.jabatan || (session.role === 'admin' ? 'Kepala Madrasah / Penilai' : 'Guru yang Dinilai')}
              </p>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
            >
              Ganti Akun / Peran
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Keluar Sesi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
