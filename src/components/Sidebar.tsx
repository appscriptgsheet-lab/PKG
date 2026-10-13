import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Eye, 
  Calculator, 
  Printer, 
  Database, 
  BookOpen, 
  Award, 
  FileText, 
  X,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentMenu: string;
  onSelectMenu: (menu: string) => void;
  guruCount: number;
  evaluatedCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentMenu,
  onSelectMenu,
  guruCount,
  evaluatedCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'supervisi',
      label: 'Supervisi Guru',
      icon: Eye,
      description: 'Telaah RPP & Observasi PBM',
      badge: 'Utama',
    },
    {
      id: 'guru',
      label: 'Guru yang Dinilai',
      icon: Users,
      badge: `${guruCount} Guru`,
    },
    {
      id: 'penilaian',
      label: 'Penilaian PKG (14 Komp)',
      icon: ClipboardCheck,
      description: 'Instrumen 4 Domain Kemenag',
      badge: `${evaluatedCount}/${guruCount}`,
    },
    {
      id: 'rekapitulasi',
      label: 'Rekapitulasi Otomatis',
      icon: Calculator,
      description: 'Konversi Nilai & Angka Kredit',
      badge: null,
    },
    {
      id: 'laporan',
      label: 'Format & Cetak Resmi',
      icon: Printer,
      description: 'Format 1B, 1C, 1D Kemenag',
      badge: null,
    },
    {
      id: 'database',
      label: 'Basis Data & Cadangan',
      icon: Database,
      description: 'Cadangkan / Pulihkan / Excel',
      badge: null,
    },
  ];

  const guruMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Guru',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'hasil_pkg',
      label: 'Hasil Penilaian PKG',
      icon: Award,
      description: 'Rincian 14 Kompetensi',
      badge: null,
    },
    {
      id: 'supervisi_saya',
      label: 'Hasil Supervisi Saya',
      icon: Eye,
      description: 'Telaah Modul & Observasi Kelas',
      badge: null,
    },
    {
      id: 'berkas',
      label: 'Bukti Fisik & Dokumen',
      icon: FileText,
      description: 'Portofolio Modul Ajar & LKPD',
      badge: null,
    },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : guruMenuItems;

  const handleItemClick = (id: string) => {
    onSelectMenu(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Header with Logos & Close button */}
      <div className="p-4 border-b border-slate-100 bg-emerald-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              {role === 'admin' ? 'Portal Kepala & Penilai' : 'Portal Guru MTs'}
            </div>
            <div className="text-[11px] text-emerald-100/80 truncate max-w-[170px]">
              MTs Raudhatul Jannah
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-between group active:scale-98 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'}`} />
                <div className="truncate">
                  <div className="truncate font-bold">{item.label}</div>
                  {'description' in item && item.description && (
                    <div className={`text-[10px] truncate ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1.5 ${
                  isActive 
                    ? 'bg-emerald-950 text-emerald-200' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Info Regulasi Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Regulasi Terbaru Kemenag</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Sesuai regulasi Ditjen Pendis Kemenag & PermenpanRB No. 1/2023: 14 Kompetensi Pedagogik, Kepribadian, Sosial, dan Profesional dengan instrumen supervisi kurikulum madrasah.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
