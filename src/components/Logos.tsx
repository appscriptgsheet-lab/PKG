import React from 'react';

/**
 * Kop Resmi Madrasah Tanpa Logo Gambar
 * Menggunakan tata letak resmi kedinasan Kemenag RI dengan garis ganda tebal-tipis standar berkas negara.
 */
export function KopMadrasahResmi({
  namaMadrasah = "MTs RAUDHATUL JANNAH",
  nsm = "121215060036",
  npsn = "10505192",
  alamat = "Jl. K.H Rasyidi RT. 04 Desa Semau Kecamatan Bramitam - Kabupaten Tanjung Jabung Barat",
  compact = false,
}: {
  namaMadrasah?: string;
  nsm?: string;
  npsn?: string;
  alamat?: string;
  compact?: boolean;
}) {
  return (
    <div className={`text-center border-b-[3px] border-black pb-2 mb-4 ${compact ? 'px-1' : 'px-2'}`}>
      <div className="border-b border-black pb-2 space-y-0.5">
        <h4 className="font-bold tracking-widest text-black uppercase text-xs sm:text-sm">
          KEMENTERIAN AGAMA REPUBLIK INDONESIA
        </h4>
        <h5 className="font-semibold text-black uppercase text-[11px] sm:text-xs">
          KANTOR KEMENTERIAN AGAMA KABUPATEN TANJUNG JABUNG BARAT
        </h5>
        <h2 className="font-black text-black tracking-wider uppercase text-base sm:text-xl mt-1">
          {namaMadrasah}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-black font-semibold">
          <span>NSM: <strong>{nsm}</strong></span>
          <span className="text-gray-400">•</span>
          <span>NPSN: <strong>{npsn}</strong></span>
        </div>
        <p className="text-black text-[10px] sm:text-[11px] font-normal leading-tight">
          {alamat}
        </p>
      </div>
    </div>
  );
}

// Dummy backward compatibility if any legacy import remains
export function LogoKemenag(_props: { className?: string }) {
  return null;
}

export function LogoMTsRaudhatulJannah(_props: { className?: string }) {
  return null;
}
