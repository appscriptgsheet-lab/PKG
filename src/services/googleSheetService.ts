import * as XLSX from 'xlsx';
import { Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';

export interface RekapRowExport {
  No: number;
  NIP: string;
  NUPTK: string;
  Nama_Guru: string;
  Pangkat_Golongan: string;
  Jabatan: string;
  Mata_Pelajaran: string;
  Tugas_Tambahan: string;
  Jam_Mengajar: number;
  Nilai_PKG_Maks56: number | string;
  Nilai_PKG_Skala100: number | string;
  Predikat_PKG: string;
  Persentase_NPK: string;
  Angka_Kredit_Tahunan: number | string;
  Supervisi_RPP_Persen: number | string;
  Supervisi_PBM_Persen: number | string;
  Nilai_Akhir_Supervisi: number | string;
  Kategori_Supervisi: string;
  Status_Penilaian: string;
}

export function generateRekapDataRows(
  guruList: Guru[],
  penilaianPKG: Record<string, PenilaianPKGGuru>,
  supervisiList: Record<string, SupervisiGuru>
): RekapRowExport[] {
  return guruList.map((guru, index) => {
    const pkg = penilaianPKG[guru.id];
    const sup = supervisiList[guru.id];

    const supRPP = sup ? sup.telaahRPP.persentase : '-';
    const supPBM = sup ? sup.observasiPBM.persentase : '-';
    const supAkhir = sup ? Math.round((sup.telaahRPP.persentase * 0.3) + (sup.observasiPBM.persentase * 0.7)) : '-';
    const supKat = sup ? (sup.observasiPBM.persentase >= 91 ? 'Sangat Baik' : sup.observasiPBM.persentase >= 76 ? 'Baik' : 'Cukup') : 'Belum';

    return {
      No: index + 1,
      NIP: guru.nip,
      NUPTK: guru.nuptk || '-',
      Nama_Guru: guru.nama,
      Pangkat_Golongan: guru.pangkatGolongan,
      Jabatan: guru.jabatan,
      Mata_Pelajaran: guru.mataPelajaran,
      Tugas_Tambahan: guru.tugasTambahan || '-',
      Jam_Mengajar: guru.jamMengajarMinggu,
      Nilai_PKG_Maks56: pkg ? pkg.totalSkorPKG : '-',
      Nilai_PKG_Skala100: pkg ? parseFloat(pkg.nilaiPKG100.toFixed(2)) : '-',
      Predikat_PKG: pkg ? pkg.sebutan : 'Belum Dinilai',
      Persentase_NPK: pkg ? `${pkg.persentaseKinerja}%` : '-',
      Angka_Kredit_Tahunan: pkg ? pkg.angkaKreditTahunan : '-',
      Supervisi_RPP_Persen: supRPP,
      Supervisi_PBM_Persen: supPBM,
      Nilai_Akhir_Supervisi: supAkhir,
      Kategori_Supervisi: supKat,
      Status_Penilaian: guru.statusPenilaian,
    };
  });
}

/**
 * Ekspor spreadsheet multi-sheet (.xlsx) kompatibel dengan format berkas XLSM penilaian guru
 */
export function exportToExcel(
  guruList: Guru[],
  penilaianPKG: Record<string, PenilaianPKGGuru>,
  supervisiList: Record<string, SupervisiGuru>,
  profile: MadrasahProfile
) {
  const rekapRows = generateRekapDataRows(guruList, penilaianPKG, supervisiList);

  const wb = XLSX.utils.book_new();

  // Sheet 1: REKAPITULASI_PKG_MTS
  const wsRekap = XLSX.utils.json_to_sheet(rekapRows);
  XLSX.utils.book_append_sheet(wb, wsRekap, 'REKAP_PKG_MTS');

  // Sheet 2: DATA_GURU_MTS
  const dataGuruExport = guruList.map((g, idx) => ({
    No: idx + 1,
    NIP: g.nip,
    NUPTK: g.nuptk || '',
    Nama_Lengkap: g.nama,
    Jenis_Kelamin: g.jenisKelamin,
    Pangkat_Golongan: g.pangkatGolongan,
    Jabatan_Fungsional: g.jabatan,
    Mata_Pelajaran: g.mataPelajaran,
    Tugas_Tambahan: g.tugasTambahan || '',
    Pendidikan_Terakhir: g.pendidikanTerakhir,
    Jam_Mengajar_Minggu: g.jamMengajarMinggu,
    Nomor_HP: g.nomorHP || '',
    Email: g.email || '',
    Status_Penilaian: g.statusPenilaian,
  }));
  const wsGuru = XLSX.utils.json_to_sheet(dataGuruExport);
  XLSX.utils.book_append_sheet(wb, wsGuru, 'DATA_GURU_MTS');

  // Sheet 3: HASIL_SUPERVISI
  const dataSupervisiExport = Object.values(supervisiList).map((s, idx) => {
    const guru = guruList.find((g) => g.id === s.guruId);
    return {
      No: idx + 1,
      Nama_Guru: guru?.nama || s.guruId,
      NIP_Guru: guru?.nip || '',
      Tanggal_Supervisi: s.tanggal,
      Supervisor: s.supervisorNama,
      Semester: s.semester,
      Tahun_Pelajaran: s.tahunPelajaran,
      Skor_Telaah_RPP: s.telaahRPP.skorTotal,
      Persen_Telaah_RPP: `${s.telaahRPP.persentase}%`,
      Kategori_RPP: s.telaahRPP.kategori,
      Skor_Observasi_Kelas: s.observasiPBM.skorTotal,
      Persen_Observasi_Kelas: `${s.observasiPBM.persentase}%`,
      Kategori_Observasi: s.observasiPBM.kategori,
      Catatan_Kelebihan: s.catatanKelebihan,
      Catatan_Kelemahan: s.catatanKelemahan,
      Rekomendasi_Tindak_Lanjut: s.tindakLanjut,
    };
  });
  const wsSupervisi = XLSX.utils.json_to_sheet(dataSupervisiExport);
  XLSX.utils.book_append_sheet(wb, wsSupervisi, 'SUPERVISI_AKADEMIK');

  // Unduh file
  const filename = `REKAP_PKG_SUPERVISI_MTS_${profile.tahunPelajaran.replace('/', '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Ekspor ke CSV
 */
export function exportToCSV(
  guruList: Guru[],
  penilaianPKG: Record<string, PenilaianPKGGuru>,
  supervisiList: Record<string, SupervisiGuru>
) {
  const rekapRows = generateRekapDataRows(guruList, penilaianPKG, supervisiList);
  const ws = XLSX.utils.json_to_sheet(rekapRows);
  const csv = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `REKAP_PKG_MTS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Kode Google Apps Script siap tempel di Google Sheet
 */
export function generateGoogleAppsScriptCode(): string {
  return `/**
 * GOOGLE APPS SCRIPT CONNECTOR UNTUK SIPKG-MTS
 * 
 * CARA PEMASANGAN:
 * 1. Buka Google Sheet Anda.
 * 2. Klik menu 'Ekstensi' (Extensions) > 'Apps Script'.
 * 3. Hapus kode default, tempelkan seluruh kode ini.
 * 4. Klik 'Terapkan' (Deploy) > 'Penerapan Baru' (New Deployment).
 * 5. Pilih jenis: 'Aplikasi Web' (Web App).
 * 6. Set Akses: 'Siapa saja' (Anyone).
 * 7. Salin URL Aplikasi Web yang diberikan, lalu masukkan ke SIPKG-MTs!
 */

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var data = contents.data;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "SYNC_ALL" || action === "SYNC_REKAP") {
      var sheetName = "REKAP_PKG_MTS";
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      }
      sheet.clearContents();

      // Header kolom
      var headers = [
        "No", "NIP", "Nama Guru", "Pangkat / Golongan", "Mata Pelajaran",
        "Tugas Tambahan", "Nilai PKG (56)", "Nilai Skala 100", "Predikat PKG",
        "Persentase NPK", "Angka Kredit Tahunan", "Nilai Supervisi", "Status Penilaian"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#D1E7DD");

      // Isi Data
      if (data && data.length > 0) {
        var rows = data.map(function(item, index) {
          return [
            index + 1,
            item.nip || "",
            item.nama || "",
            item.pangkatGolongan || "",
            item.mataPelajaran || "",
            item.tugasTambahan || "-",
            item.nilaiPKG56 || "-",
            item.nilaiPKG100 || "-",
            item.predikat || "-",
            item.persentaseNPK ? item.persentaseNPK + "%" : "-",
            item.angkaKredit || "-",
            item.nilaiSupervisi || "-",
            item.status || "Selesai"
          ];
        });
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Data PKG & Supervisi MTs berhasil disinkronkan ke Google Sheet!",
        rowCount: data ? data.length : 0,
        syncedAt: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Action tidak dikenali"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Sheet Connector SIPKG-MTs Aktif dan Siap Digunakan!"
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
}
