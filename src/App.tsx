import React, { useState, useEffect } from 'react';
import { 
  GURU_LIST_DEFAULT, 
  MADRASAH_PROFILE_DEFAULT, 
  PENILAIAN_PKG_DEFAULT, 
  SUPERVISI_LIST_DEFAULT 
} from './data/standarPKG';
import { 
  Guru, 
  MadrasahProfile, 
  PenilaianPKGGuru, 
  SupervisiGuru, 
  UserSession 
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardGuru } from './components/DashboardGuru';
import { MenuGuruDinilai } from './components/MenuGuruDinilai';
import { MenuSupervisi } from './components/MenuSupervisi';
import { MenuPenilaianPKG } from './components/MenuPenilaianPKG';
import { MenuRekapitulasi } from './components/MenuRekapitulasi';
import { CetakLaporanModal } from './components/CetakLaporanModal';
import { DatabaseModal } from './components/DatabaseModal';
import { AuthModal } from './components/AuthModal';
import { exportToExcel } from './services/googleSheetService';
import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Eye, 
  Calculator, 
  Printer 
} from 'lucide-react';

export interface AppToast {
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  // Sesi Pengguna: default Kepala Madrasah (Admin)
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('sipkg_session_rj');
    if (saved) {
      try { 
        const p = JSON.parse(saved);
        if (p && p.nama) return p;
      } catch (e) {}
    }
    return {
      role: 'admin',
      nama: MADRASAH_PROFILE_DEFAULT.kepalaMadrasah,
      nip: MADRASAH_PROFILE_DEFAULT.nipKepala,
      jabatan: 'Kepala Madrasah / Tim Penilai',
    };
  });

  // State Guru MTs (Penyimpanan Lokal Mandiri MTs Raudhatul Jannah)
  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem('sipkg_guru_list_rj');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((g: any) => g.nama === 'AHMAD MUZANI')) {
          return parsed;
        }
      } catch (e) {}
    }
    return GURU_LIST_DEFAULT;
  });

  // State Penilaian PKG 14 Kompetensi
  const [penilaianPKG, setPenilaianPKG] = useState<Record<string, PenilaianPKGGuru>>(() => {
    const saved = localStorage.getItem('sipkg_penilaian_rj');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['guru-1'] && parsed['guru-1'].penilaiNama === 'AHMAD MUZANI') {
          return parsed;
        }
      } catch (e) {}
    }
    return PENILAIAN_PKG_DEFAULT;
  });

  // State Supervisi Akademik
  const [supervisiList, setSupervisiList] = useState<Record<string, SupervisiGuru>>(() => {
    const saved = localStorage.getItem('sipkg_supervisi_rj');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['guru-2'] && parsed['guru-2'].supervisorNama === 'AHMAD MUZANI') {
          return parsed;
        }
      } catch (e) {}
    }
    return SUPERVISI_LIST_DEFAULT;
  });

  // Profile Madrasah
  const [profile] = useState<MadrasahProfile>(MADRASAH_PROFILE_DEFAULT);

  // Navigasi Menu Aktif & Mobile Drawer
  const [currentMenu, setCurrentMenu] = useState<string>('dashboard');
  const [navTargetGuruId, setNavTargetGuruId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals & Notifikasi
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printModalGuruId, setPrintModalGuruId] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<AppToast | null>(null);

  // Persistence Effects ke LocalStorage
  useEffect(() => {
    localStorage.setItem('sipkg_session_rj', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('sipkg_guru_list_rj', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('sipkg_penilaian_rj', JSON.stringify(penilaianPKG));
  }, [penilaianPKG]);

  useEffect(() => {
    localStorage.setItem('sipkg_supervisi_rj', JSON.stringify(supervisiList));
  }, [supervisiList]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handlers Penilaian PKG
  const handleSavePenilaian = (penilaian: PenilaianPKGGuru) => {
    setPenilaianPKG((prev) => ({
      ...prev,
      [penilaian.guruId]: penilaian,
    }));

    // Update status guru menjadi Selesai
    setGuruList((prev) =>
      prev.map((g) => (g.id === penilaian.guruId ? { ...g, statusPenilaian: 'Selesai' } : g))
    );

    setToast({
      message: 'Penilaian PKG 14 Kompetensi berhasil disimpan ke database lokal dan diperbarui di Rekapitulasi!',
      type: 'success',
    });
  };

  // Handlers Supervisi
  const handleSaveSupervisi = (supervisi: SupervisiGuru) => {
    setSupervisiList((prev) => ({
      ...prev,
      [supervisi.guruId]: supervisi,
    }));

    setToast({
      message: 'Data supervisi akademik guru berhasil disimpan!',
      type: 'success',
    });
  };

  // Handlers Manajemen Guru
  const handleAddGuru = (newGuruData: Omit<Guru, 'id'>) => {
    const newGuru: Guru = {
      ...newGuruData,
      id: `guru-${Date.now()}`,
    };
    setGuruList((prev) => [newGuru, ...prev]);
    setToast({
      message: `Guru ${newGuru.nama} berhasil ditambahkan ke database MTs.`,
      type: 'success',
    });
  };

  const handleUpdateGuru = (updatedGuru: Guru) => {
    setGuruList((prev) =>
      prev.map((g) => (g.id === updatedGuru.id ? updatedGuru : g))
    );
    setToast({
      message: `Data guru ${updatedGuru.nama} berhasil diperbarui.`,
      type: 'success',
    });
  };

  const handleDeleteGuru = (id: string) => {
    setGuruList((prev) => prev.filter((g) => g.id !== id));
    setToast({
      message: 'Data guru telah dihapus dari daftar.',
      type: 'info',
    });
  };

  const handleAddDokumenBukti = (guruId: string, nama: string, url: string, tipe: string) => {
    setGuruList((prev) =>
      prev.map((g) => {
        if (g.id === guruId) {
          const docs = g.dokumenBukti || [];
          return {
            ...g,
            dokumenBukti: [
              ...docs,
              {
                nama,
                url,
                tipe,
                tanggalUnggah: new Date().toISOString().slice(0, 10),
              },
            ],
          };
        }
        return g;
      })
    );
    setToast({
      message: 'Bukti fisik berhasil ditambahkan ke portofolio Anda.',
      type: 'success',
    });
  };

  // Restore & Reset Database
  const handleRestoreData = (backup: {
    guruList: Guru[];
    penilaianPKG: Record<string, PenilaianPKGGuru>;
    supervisiList: Record<string, SupervisiGuru>;
  }) => {
    setGuruList(backup.guruList);
    setPenilaianPKG(backup.penilaianPKG);
    setSupervisiList(backup.supervisiList);
    setToast({
      message: 'Database berhasil dipulihkan dari file cadangan!',
      type: 'success',
    });
  };

  const handleResetData = () => {
    setGuruList(GURU_LIST_DEFAULT);
    setPenilaianPKG(PENILAIAN_PKG_DEFAULT);
    setSupervisiList(SUPERVISI_LIST_DEFAULT);
    setToast({
      message: 'Data telah direset ke data awal madrasah.',
      type: 'info',
    });
  };

  // Navigasi cepat dengan parameter guruId
  const handleNavigate = (menu: string, guruId?: string) => {
    setCurrentMenu(menu);
    if (guruId) {
      setNavTargetGuruId(guruId);
    }
  };

  // Modal Print Opener
  const handleOpenPrintModal = (guruId?: string) => {
    setPrintModalGuruId(guruId);
    setShowPrintModal(true);
  };

  // Ekspor Excel (.xlsx) langsung
  const handleExportExcel = () => {
    exportToExcel(guruList, penilaianPKG, supervisiList, profile);
    setToast({
      message: 'Berkas Excel (.xlsx) berhasil diunduh ke komputer Anda!',
      type: 'success',
    });
  };

  // Guru aktif untuk portal guru
  const currentGuruData = session.role === 'guru' && session.guruId
    ? guruList.find((g) => g.id === session.guruId) || guruList[0]
    : guruList[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Floating Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full shadow-xl rounded-xl border p-4 bg-white flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-semibold text-slate-900 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar dengan Multi Single App Navigation Tabs */}
      <Navbar
        session={session}
        profile={profile}
        currentMenu={currentMenu}
        onSelectMenu={(menu) => {
          if (menu === 'database') {
            setShowDatabaseModal(true);
          } else if (menu === 'laporan') {
            setShowPrintModal(true);
          } else {
            setCurrentMenu(menu);
          }
        }}
        onOpenPrintModal={() => setShowPrintModal(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenDatabaseModal={() => setShowDatabaseModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={() => setShowAuthModal(true)}
        onExportExcel={handleExportExcel}
      />

      {/* Main Body: Sidebar + Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <Sidebar
          role={session.role}
          currentMenu={currentMenu}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onSelectMenu={(menu) => {
            if (menu === 'database') {
              setShowDatabaseModal(true);
            } else if (menu === 'laporan') {
              setShowPrintModal(true);
            } else {
              setCurrentMenu(menu);
            }
          }}
          guruCount={guruList.length}
          evaluatedCount={guruList.filter((g) => g.statusPenilaian === 'Selesai').length}
        />

        {/* Konten Utama */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          {session.role === 'admin' ? (
            <>
              {currentMenu === 'dashboard' && (
                <DashboardAdmin
                  guruList={guruList}
                  penilaianPKG={penilaianPKG}
                  supervisiList={supervisiList}
                  profile={profile}
                  onNavigate={handleNavigate}
                  onExportExcel={handleExportExcel}
                  onOpenDatabaseModal={() => setShowDatabaseModal(true)}
                />
              )}

              {currentMenu === 'guru' && (
                <MenuGuruDinilai
                  guruList={guruList}
                  penilaianPKG={penilaianPKG}
                  supervisiList={supervisiList}
                  onNavigate={handleNavigate}
                  onOpenPrintModal={handleOpenPrintModal}
                  onAddGuru={handleAddGuru}
                  onUpdateGuru={handleUpdateGuru}
                  onDeleteGuru={handleDeleteGuru}
                />
              )}

              {currentMenu === 'supervisi' && (
                <MenuSupervisi
                  guruList={guruList}
                  supervisiList={supervisiList}
                  profile={profile}
                  initialSelectedGuruId={navTargetGuruId}
                  onSaveSupervisi={handleSaveSupervisi}
                  onOpenPrintModal={handleOpenPrintModal}
                />
              )}

              {currentMenu === 'penilaian' && (
                <MenuPenilaianPKG
                  guruList={guruList}
                  penilaianPKG={penilaianPKG}
                  profile={profile}
                  initialSelectedGuruId={navTargetGuruId}
                  onSavePenilaian={handleSavePenilaian}
                  onOpenPrintModal={handleOpenPrintModal}
                />
              )}

              {currentMenu === 'rekapitulasi' && (
                <MenuRekapitulasi
                  guruList={guruList}
                  penilaianPKG={penilaianPKG}
                  supervisiList={supervisiList}
                  profile={profile}
                  onOpenDatabaseModal={() => setShowDatabaseModal(true)}
                  onOpenPrintModal={handleOpenPrintModal}
                />
              )}
            </>
          ) : (
            // PORTAL GURU YANG DINILAI
            <DashboardGuru
              guru={currentGuruData}
              penilaianPKG={currentGuruData ? penilaianPKG[currentGuruData.id] : undefined}
              supervisi={currentGuruData ? supervisiList[currentGuruData.id] : undefined}
              profile={profile}
              onOpenPrintModal={handleOpenPrintModal}
              onAddDokumenBukti={handleAddDokumenBukti}
            />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION DOCK (Multi Single Application Navigasi HP / Tablet) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentMenu('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentMenu === 'dashboard'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${currentMenu === 'dashboard' ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        {session.role === 'admin' ? (
          <>
            <button
              onClick={() => setCurrentMenu('guru')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                currentMenu === 'guru'
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Users className={`w-5 h-5 ${currentMenu === 'guru' ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
                <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[8px] font-bold px-1 rounded-full">
                  12
                </span>
              </div>
              <span className="text-[10px] mt-0.5">Guru</span>
            </button>

            <button
              onClick={() => setCurrentMenu('penilaian')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                currentMenu === 'penilaian'
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <ClipboardCheck className={`w-5 h-5 ${currentMenu === 'penilaian' ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">Nilai PKG</span>
            </button>

            <button
              onClick={() => setCurrentMenu('supervisi')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                currentMenu === 'supervisi'
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Eye className={`w-5 h-5 ${currentMenu === 'supervisi' ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">Supervisi</span>
            </button>

            <button
              onClick={() => setCurrentMenu('rekapitulasi')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                currentMenu === 'rekapitulasi'
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Calculator className={`w-5 h-5 ${currentMenu === 'rekapitulasi' ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">Rekap</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleOpenPrintModal(session.guruId)}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-900 font-medium"
            >
              <Printer className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Cetak Format</span>
            </button>
          </>
        )}
      </nav>

      {/* MODAL AUTH PERAN */}
      {showAuthModal && (
        <AuthModal
          currentSession={session}
          guruList={guruList}
          profile={profile}
          onLogin={(newSession) => {
            setSession(newSession);
            setCurrentMenu('dashboard');
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* MODAL BASIS DATA & CADANGAN MANDIRI */}
      {showDatabaseModal && (
        <DatabaseModal
          guruList={guruList}
          penilaianPKG={penilaianPKG}
          supervisiList={supervisiList}
          profile={profile}
          onRestoreData={handleRestoreData}
          onResetData={handleResetData}
          onClose={() => setShowDatabaseModal(false)}
        />
      )}

      {/* MODAL CETAK LAPORAN RESMI */}
      {showPrintModal && (
        <CetakLaporanModal
          guruList={guruList}
          penilaianPKG={penilaianPKG}
          supervisiList={supervisiList}
          profile={profile}
          initialGuruId={printModalGuruId || (session.role === 'guru' ? session.guruId : undefined)}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
}
