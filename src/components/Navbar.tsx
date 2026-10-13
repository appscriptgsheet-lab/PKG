import React from 'react';
import { 
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Eye,
  Calculator,
  Printer,
  FileSpreadsheet, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Database,
  Menu,
  X,
  Layers
} from 'lucide-react';
import { MadrasahProfile, UserSession } from '../types';

interface NavbarProps {
  session: UserSession;
  profile: MadrasahProfile;
  currentMenu?: string;
  onSelectMenu?: (menu: string) => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onOpenDatabaseModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onExportExcel: () => void;
  onOpenPrintModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  profile,
  currentMenu = 'dashboard',
  onSelectMenu,
  mobileMenuOpen = false,
  onToggleMobileMenu,
  onOpenDatabaseModal,
  onOpenAuthModal,
  onLogout,
  onExportExcel,
  onOpenPrintModal,
}) => {
  // Navigation Tabs untuk mode Multi Single Application
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guru', label: 'Data Guru', icon: Users, badge: '12' },
    { id: 'penilaian', label: 'Penilaian PKG', icon: ClipboardCheck },
    { id: 'supervisi', label: 'Supervisi', icon: Eye },
    { id: 'rekapitulasi', label: 'Rekapitulasi', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Baris Utama */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Sisi Kiri: Brand Aplikasi & Identitas MTs (Tanpa Logo) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Buka Menu Navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Icon Simbol Aplikasi Modern (Pengganti Logo) */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-5 h-5 text-emerald-300" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 uppercase truncate">
                  SIPKG PRO
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  {profile.tahunPelajaran}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate max-w-[170px] sm:max-w-xs md:max-w-md">
                {profile.namaMadrasah} · Semau
              </p>
            </div>
          </div>

          {/* Sisi Tengah: Tab Navigasi Multi Single Application (Desktop & Tablet) */}
          {session.role === 'admin' && onSelectMenu && (
            <nav className="hidden xl:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold gap-0.5">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentMenu === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectMenu(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1 rounded font-bold ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              {onOpenPrintModal && (
                <button
                  onClick={onOpenPrintModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak</span>
                </button>
              )}
            </nav>
          )}

          {/* Sisi Kanan: Aksi Cepat & Profil Pengguna */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Shortcut Database & Ekspor Excel */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <button
                onClick={onOpenDatabaseModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Kelola Basis Data Lokal & Cadangan"
              >
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">Basis Data</span>
              </button>

              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors font-semibold shadow-2xs"
                title="Unduh seluruh data ke format Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>Excel</span>
              </button>
            </div>

            {/* Pengguna & Peran */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                  {session.nama}
                </span>
                {session.role === 'admin' ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Penilai
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    <UserCheck className="w-3 h-3 mr-0.5" /> Guru
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap active:scale-95"
            >
              <span className="hidden sm:inline">Ganti Akun</span>
              <span className="sm:hidden">Akun</span>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors active:scale-95"
              title="Keluar Sesi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Sub-bar Tab Navigasi untuk Layar Sedang (Tablet / md-lg) */}
        {session.role === 'admin' && onSelectMenu && (
          <div className="hidden md:flex xl:hidden pb-2.5 pt-1 overflow-x-auto">
            <nav className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold gap-1 w-full justify-between">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentMenu === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectMenu(tab.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg flex-1 transition-all ${
                      isActive
                        ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
};
