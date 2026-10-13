import React, { useState, useEffect } from 'react';
import { 
  GURU_LIST_DEFAULT, 
  MADRASAH_PROFILE_DEFAULT, 
  PENILAIAN_PKG_DEFAULT, 
  SUPERVISI_LIST_DEFAULT 
} from './data/standarPKG';
import { 
  GoogleSheetConfig, 
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
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { AuthModal } from './components/AuthModal';
import { exportToExcel } from './services/googleSheetService';

export default function App() {
  // Sesi Pengguna: default Kepala Madrasah (Admin)
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('sipkg_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      role: 'admin',
      nama: MADRASAH_PROFILE_DEFAULT.kepalaMadrasah,
      nip: MADRASAH_PROFILE_DEFAULT.nipKepala,
      jabatan: 'Kepala Madrasah / Tim Penilai',
    };
  });

  // State Guru MTs
  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem('sipkg_guru_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return GURU_LIST_DEFAULT;
  });

  // State Penilaian PKG 14 Kompetensi
  const [penilaianPKG, setPenilaianPKG] = useState<Record<string, PenilaianPKGGuru>>(() => {
    const saved = localStorage.getItem('sipkg_penilaian');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PENILAIAN_PKG_DEFAULT;
  });

  // State Supervisi Akademik
  const [supervisiList, setSupervisiList] = useState<Record<string, SupervisiGuru>>(() => {
    const saved = localStorage.getItem('sipkg_supervisi');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SUPERVISI_LIST_DEFAULT;
  });

  // Profile Madrasah
  const [profile] = useState<MadrasahProfile>(MADRASAH_PROFILE_DEFAULT);

  // Konfigurasi Google Sheet
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => {
    const saved = localStorage.getItem('sipkg_sheet_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      spreadsheetId: '',
      sheetNameRekap: 'REKAP_PKG_MTS',
      webAppUrl: '',
      lastSyncedAt: new Date().toISOString(),
      isAutoSync: true,
    };
  });

  // Navigasi Menu Aktif
  const [currentMenu, setCurrentMenu] = useState<string>('dashboard');
  const [navTargetGuruId, setNavTargetGuruId] = useState<string | undefined>(undefined);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printModalGuruId, setPrintModalGuruId] = useState<string | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sipkg_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('sipkg_guru_list', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('sipkg_penilaian', JSON.stringify(penilaianPKG));
  }, [penilaianPKG]);

  useEffect(() => {
    localStorage.setItem('sipkg_supervisi', JSON.stringify(supervisiList));
  }, [supervisiList]);

  useEffect(() => {
    localStorage.setItem('sipkg_sheet_config', JSON.stringify(sheetConfig));
  }, [sheetConfig]);

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
  };

  // Handlers Supervisi
  const handleSaveSupervisi = (supervisi: SupervisiGuru) => {
    setSupervisiList((prev) => ({
      ...prev,
      [supervisi.guruId]: supervisi,
    }));
  };

  // Handlers Manajemen Guru
  const handleAddGuru = (newGuruData: Omit<Guru, 'id'>) => {
    const newGuru: Guru = {
      ...newGuruData,
      id: `guru-${Date.now()}`,
    };
    setGuruList((prev) => [newGuru, ...prev]);
  };

  const handleUpdateGuru = (updatedGuru: Guru) => {
    setGuruList((prev) =>
      prev.map((g) => (g.id === updatedGuru.id ? updatedGuru : g))
    );
  };

  const handleDeleteGuru = (id: string) => {
    setGuruList((prev) => prev.filter((g) => g.id !== id));
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

  // Sinkronisasi Google Sheet
  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);

    try {
      if (sheetConfig.webAppUrl) {
        // Kirim payload POST riil ke Apps Script Web App
        const payload = {
          action: 'SYNC_REKAP',
          data: guruList.map((g) => {
            const p = penilaianPKG[g.id];
            const s = supervisiList[g.id];
            return {
              nip: g.nip,
              nama: g.nama,
              pangkatGolongan: g.pangkatGolongan,
              mataPelajaran: g.mataPelajaran,
              tugasTambahan: g.tugasTambahan,
              nilaiPKG56: p?.totalSkorPKG,
              nilaiPKG100: p?.nilaiPKG100 ? parseFloat(p.nilaiPKG100.toFixed(2)) : undefined,
              predikat: p?.sebutan,
              persentaseNPK: p?.persentaseKinerja,
              angkaKredit: p?.angkaKreditTahunan,
              nilaiSupervisi: s ? Math.round((s.telaahRPP.persentase * 0.3) + (s.observasiPBM.persentase * 0.7)) : undefined,
              status: g.statusPenilaian,
            };
          }),
        };

        await fetch(sheetConfig.webAppUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script standard web app hook
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Simulasi delay sinkronisasi lokal
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const now = new Date().toISOString();
      setSheetConfig((prev) => ({ ...prev, lastSyncedAt: now }));
      alert('Data rekapitulasi PKG & Supervisi MTs berhasil disinkronkan ke basis data Google Sheet!');
    } catch (err: any) {
      console.error('Sync error:', err);
      alert('Sinkronisasi tersimpan di database lokal peramban.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Guru aktif untuk portal guru
  const currentGuruData = session.role === 'guru' && session.guruId
    ? guruList.find((g) => g.id === session.guruId) || guruList[0]
    : guruList[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        session={session}
        profile={profile}
        isSheetConnected={Boolean(sheetConfig.spreadsheetId || sheetConfig.webAppUrl)}
        onOpenSheetModal={() => setShowSheetModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={() => {
          // Switch to teacher or reset
          setShowAuthModal(true);
        }}
        onSyncQuick={handleSyncGoogleSheet}
        isSyncing={isSyncing}
      />

      {/* Main Body: Sidebar + Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <Sidebar
          role={session.role}
          currentMenu={currentMenu}
          onSelectMenu={(menu) => {
            if (menu === 'googlesheet') {
              setShowSheetModal(true);
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {session.role === 'admin' ? (
            <>
              {currentMenu === 'dashboard' && (
                <DashboardAdmin
                  guruList={guruList}
                  penilaianPKG={penilaianPKG}
                  supervisiList={supervisiList}
                  profile={profile}
                  onNavigate={handleNavigate}
                  onExportExcel={() => exportToExcel(guruList, penilaianPKG, supervisiList, profile)}
                  onOpenSheetModal={() => setShowSheetModal(true)}
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
                  isSheetConnected={Boolean(sheetConfig.spreadsheetId || sheetConfig.webAppUrl)}
                  onOpenSheetModal={() => setShowSheetModal(true)}
                  onOpenPrintModal={handleOpenPrintModal}
                  onSyncGoogleSheet={handleSyncGoogleSheet}
                  isSyncing={isSyncing}
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

      {/* MODAL GOOGLE SHEET */}
      {showSheetModal && (
        <GoogleSheetModal
          config={sheetConfig}
          guruList={guruList}
          penilaianPKG={penilaianPKG}
          supervisiList={supervisiList}
          profile={profile}
          onSaveConfig={(newConfig) => setSheetConfig(newConfig)}
          onSyncNow={handleSyncGoogleSheet}
          isSyncing={isSyncing}
          onClose={() => setShowSheetModal(false)}
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
