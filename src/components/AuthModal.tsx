import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  X, 
  Lock, 
  User, 
  ArrowRight, 
  Building2,
  Sparkles
} from 'lucide-react';
import { Guru, MadrasahProfile, UserRole, UserSession } from '../types';

interface AuthModalProps {
  currentSession: UserSession;
  guruList: Guru[];
  profile: MadrasahProfile;
  onLogin: (session: UserSession) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentSession,
  guruList,
  profile,
  onLogin,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentSession.role || 'admin');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(guruList[0]?.id || '');
  const [nipInput, setNipInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      role: 'admin',
      nama: profile.kepalaMadrasah,
      nip: profile.nipKepala,
      jabatan: 'Kepala Madrasah / Penilai',
    });
    onClose();
  };

  const handleGuruLogin = (guruIdToUse?: string) => {
    const targetId = guruIdToUse || selectedGuruId;
    const guru = guruList.find((g) => g.id === targetId) || guruList[0];
    if (guru) {
      onLogin({
        role: 'guru',
        guruId: guru.id,
        nama: guru.nama,
        nip: guru.nip,
        jabatan: `${guru.mataPelajaran} (${guru.pangkatGolongan})`,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Autentikasi Terpisah SIPKG-MTs</h2>
              <p className="text-xs text-slate-500">Pilih portal peran akun untuk mengakses sistem</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Role Switcher */}
        <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'admin'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Portal Admin & Penilai</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('guru')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'guru'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>Portal Guru MTs</span>
          </button>
        </div>

        {/* Form Role: ADMIN */}
        {selectedRole === 'admin' && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl">
              <span className="font-bold text-emerald-950 block">Hak Akses Portal Admin:</span>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                Manajemen data seluruh guru, input evaluasi PKG 14 kompetensi, penilaian supervisi kelas & RPP, rekapitulasi nilai otomatis, ekspor Excel, dan sinkronisasi Google Sheet.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala / Pengawas</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    defaultValue={profile.nipKepala}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono-numbers text-xs"
                    placeholder="19740512 200003 1 002"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm text-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk sebagai Admin / Kepala Madrasah</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Form Role: GURU YANG DINILAI */}
        {selectedRole === 'guru' && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl">
              <span className="font-bold text-blue-950 block">Hak Akses Portal Guru:</span>
              <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                Melihat hasil nilai PKG 14 kompetensi pribadi, melihat hasil supervisi & tindak lanjut dari supervisor, mengunggah portofolio bukti fisik, dan mengunduh format penilaian pribadi.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Pilih Akun Guru MTs untuk Masuk:
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {guruList.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGuruLogin(g.id)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-800">
                        {g.nama}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Mapel: <strong className="text-slate-700">{g.mataPelajaran}</strong> · NIP: <span className="font-mono-numbers">{g.nip}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{profile.namaMadrasah}</span>
          <span>Tahun: {profile.tahunPelajaran}</span>
        </div>

      </div>
    </div>
  );
};
