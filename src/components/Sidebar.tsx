import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Eye, 
  Calculator, 
  Printer, 
  FileSpreadsheet, 
  BookOpen, 
  Award, 
  FileText, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentMenu: string;
  onSelectMenu: (menu: string) => void;
  guruCount: number;
  evaluatedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentMenu,
  onSelectMenu,
  guruCount,
  evaluatedCount,
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
      id: 'googlesheet',
      label: 'Basis Data Google Sheet',
      icon: FileSpreadsheet,
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

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          {role === 'admin' ? 'Menu Kepala / Tim Penilai' : 'Menu Guru MTs'}
        </span>
        <p className="text-xs text-slate-600 mt-0.5">
          {role === 'admin' 
            ? 'Supervisi, Penilaian & Rekapitulasi' 
            : 'Portofolio & Hasil Evaluasi Kinerja'}
        </p>
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'}`} />
                <div className="truncate">
                  <div className="truncate font-semibold">{item.label}</div>
                  {'description' in item && item.description && (
                    <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1.5 ${
                  isActive 
                    ? 'bg-emerald-800 text-emerald-100' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Helper Box */}
      <div className="mt-auto p-4 m-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Panduan Standar PKG</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Mengacu pada instrumen Ditjen Pendis Kemenag & Kemendikbud: 14 Kompetensi Pedagogik, Kepribadian, Sosial, dan Profesional.
        </p>
      </div>
    </aside>
  );
};
