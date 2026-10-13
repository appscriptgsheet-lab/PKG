import { DefinisiKompetensi, Guru, MadrasahProfile, PenilaianPKGGuru, SupervisiGuru } from '../types';

export const MADRASAH_PROFILE_DEFAULT: MadrasahProfile = {
  namaMadrasah: 'MTs Negeri 1 Model Terpadu',
  nsm: '121232010001',
  npsn: '20278912',
  alamat: 'Jl. Pendidikan No. 45, Kompleks Madrasah Terpadu',
  kecamatan: 'Kecamatan Cendekia',
  kabupatenKota: 'Kota Prestasi',
  provinsi: 'Jawa Barat',
  kepalaMadrasah: 'Dr. H. Ahmad Fauzi, M.Pd.I',
  nipKepala: '19740512 200003 1 002',
  tahunPelajaran: '2026/2027',
};

// 14 Standar Kompetensi PKG Guru Mata Pelajaran / Guru Kelas Kemenag
export const KOMPETENSI_PKG_14: DefinisiKompetensi[] = [
  // DOMAIN PEDAGOGIK (1 - 7)
  {
    id: 1,
    nomor: 1,
    nama: 'Mengenal Karakteristik Peserta Didik',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu mencatat dan menggunakan informasi tentang karakteristik peserta didik secara individual dan kelompok untuk membantu proses pembelajaran.',
    indikator: [
      { id: 101, pernyataan: 'Guru dapat mengidentifikasi karakteristik belajar setiap peserta didik di kelasnya.' },
      { id: 102, pernyataan: 'Guru memastikan bahwa semua peserta didik mendapatkan kesempatan yang sama untuk berpartisipasi aktif dalam kegiatan pembelajaran.' },
      { id: 103, pernyataan: 'Guru dapat mengatur kelas untuk memberikan kesempatan belajar yang sama pada semua peserta didik dengan kelainan fisik dan kemampuan belajar yang berbeda.' },
      { id: 104, pernyataan: 'Guru mencoba mengetahui penyebab penyimpangan perilaku peserta didik untuk mencegah agar perilaku tersebut tidak merugikan peserta didik lainnya.' },
      { id: 105, pernyataan: 'Guru membantu mengembangkan potensi dan mengatasi kekurangan peserta didik.' },
    ],
  },
  {
    id: 2,
    nomor: 2,
    nama: 'Menguasai Teori Belajar dan Prinsip Pembelajaran yang Mendidik',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu menetapkan berbagai pendekatan, strategi, metode, dan teknik pembelajaran yang mendidik secara kreatif sesuai dengan standar kompetensi guru.',
    indikator: [
      { id: 201, pernyataan: 'Guru memberi kesempatan kepada peserta didik untuk menguasai materi pembelajaran sesuai usia dan kemampuan belajarnya.' },
      { id: 202, pernyataan: 'Guru selalu memastikan tingkat pemahaman peserta didik terhadap materi pembelajaran tertentu dan menyesuaikan aktivitas pembelajaran berikutnya.' },
      { id: 203, pernyataan: 'Guru dapat menjelaskan alasan pelaksanaan kegiatan/aktivitas yang dilakukannya, baik yang sesuai maupun yang berbeda dengan rencana.' },
      { id: 204, pernyataan: 'Guru menggunakan berbagai teknik untuk memotivasi kemauan belajar peserta didik.' },
      { id: 205, pernyataan: 'Guru mengintegrasikan pendekatan pembelajaran aktif, kreatif, efektif, dan menyenangkan (PAKEM) serta nilai-nilai madrasah.' },
    ],
  },
  {
    id: 3,
    nomor: 3,
    nama: 'Pengembangan Kurikulum / Modul Ajar Madrasah',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu menyusun silabus/alur tujuan pembelajaran (ATP) dan rencana pelaksanaan pembelajaran (RPP/Modul Ajar) sesuai dengan standar kurikulum yang berlaku di madrasah.',
    indikator: [
      { id: 301, pernyataan: 'Guru dapat menyusun silabus / alur tujuan pembelajaran yang sesuai dengan kurikulum.' },
      { id: 302, pernyataan: 'Guru merancang rencana pembelajaran yang sesuai dengan silabus untuk mencapai kompetensi/tujuan pembelajaran tertentu.' },
      { id: 303, pernyataan: 'Guru mengikuti urutan materi pembelajaran dengan memperhatikan kesinambungan materi dan mengaitkannya dengan kehidupan nyata.' },
      { id: 304, pernyataan: 'Guru memilih materi pembelajaran yang sesuai dengan tujuan pembelajaran, tepat dan mutakhir, serta bernilai kontekstual islami.' },
    ],
  },
  {
    id: 4,
    nomor: 4,
    nama: 'Kegiatan Pembelajaran yang Mendidik',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu menyusun dan melaksanakan rancangan pembelajaran yang mendidik secara lengkap dan mengkondisikan pembelajaran interaktif.',
    indikator: [
      { id: 401, pernyataan: 'Guru melaksanakan aktivitas pembelajaran sesuai dengan rancangan yang telah disusun secara lengkap.' },
      { id: 402, pernyataan: 'Guru melaksanakan aktivitas pembelajaran yang bertujuan untuk membantu proses belajar peserta didik, bukan untuk menguji sehingga membuat peserta didik merasa tertekan.' },
      { id: 403, pernyataan: 'Guru mengomunikasikan informasi baru dengan menyenangkan dan mengaitkannya dengan pengetahuan peserta didik sebelumnya.' },
      { id: 404, pernyataan: 'Guru menyikapi kesalahan yang dilakukan peserta didik sebagai tahapan proses pembelajaran.' },
      { id: 405, pernyataan: 'Guru mengelola alokasi waktu pembelajaran secara efektif sesuai dengan rencana yang telah ditetapkan.' },
    ],
  },
  {
    id: 5,
    nomor: 5,
    nama: 'Memahami dan Mengembangkan Potensi Peserta Didik',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu menganalisis potensi pembelajaran setiap peserta didik dan mengidentifikasi pengembangan potensi peserta didik melalui program pembelajaran.',
    indikator: [
      { id: 501, pernyataan: 'Guru menganalisis potensi pembelajaran setiap peserta didik dan mengidentifikasi peserta didik yang membutuhkan perlakuan khusus.' },
      { id: 502, pernyataan: 'Guru merancang dan melaksanakan aktivitas pembelajaran yang mendorong peserta didik untuk belajar sesuai dengan kecakapan dan pola belajar masing-masing.' },
      { id: 503, pernyataan: 'Guru merancang dan melaksanakan aktivitas pembelajaran untuk memunculkan daya kreativitas dan kemampuan berfikir kritis (HOTS) peserta didik.' },
      { id: 504, pernyataan: 'Guru memberikan bimbingan remedial dan pengayaan secara terprogram.' },
    ],
  },
  {
    id: 6,
    nomor: 6,
    nama: 'Komunikasi Efektif dengan Peserta Didik',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu berkomunikasi secara santun, empatik, dan efektif dengan peserta didik selama proses pembelajaran.',
    indikator: [
      { id: 601, pernyataan: 'Guru menggunakan pertanyaan untuk mengetahui pemahaman dan menjaga partisipasi peserta didik.' },
      { id: 602, pernyataan: 'Guru memberikan perhatian dan mendengarkan semua pertanyaan dan tanggapan peserta didik tanpa menginterupsi.' },
      { id: 603, pernyataan: 'Guru menanggapi pertanyaan peserta didik secara benar, jelas, dan tidak membingungkan.' },
      { id: 604, pernyataan: 'Guru menyajikan kegiatan pembelajaran yang dapat menumbuhkan kerja sama yang baik antarpeserta didik.' },
    ],
  },
  {
    id: 7,
    nomor: 7,
    nama: 'Penilaian dan Evaluasi Pembelajaran',
    domain: 'Pedagogik',
    deskripsi: 'Guru mampu menyelenggarakan penilaian proses dan hasil belajar secara berkesinambungan serta memanfaatkan hasil penilaian untuk perbaikan pembelajaran.',
    indikator: [
      { id: 701, pernyataan: 'Guru menyusun alat penilaian yang sesuai dengan tujuan pembelajaran untuk mencapai kompetensi tertentu.' },
      { id: 702, pernyataan: 'Guru melaksanakan penilaian dengan berbagai teknik dan jenis penilaian sesuai dengan instrumen yang telah disiapkan.' },
      { id: 703, pernyataan: 'Guru menganalisis hasil penilaian untuk mengidentifikasi topik/kompetensi dasar yang sulit sehingga diketahui kekuatan dan kelemahan masing-masing peserta didik.' },
      { id: 704, pernyataan: 'Guru memanfaatkan masukan dari peserta didik dan merefleksikannya untuk meningkatkan pembelajaran selanjutnya.' },
      { id: 705, pernyataan: 'Guru mendokumentasikan hasil penilaian secara transparan dan akuntabel.' },
    ],
  },

  // DOMAIN KEPRIBADIAN (8 - 10)
  {
    id: 8,
    nomor: 8,
    nama: 'Bertindak Sesuai Norma Agama, Hukum, Sosial, dan Kebudayaan Nasional',
    domain: 'Kepribadian',
    deskripsi: 'Guru bertindak konsisten sesuai dengan nilai-nilai agama, hukum, dan norma sosial yang berlaku di lingkungan madrasah dan masyarakat.',
    indikator: [
      { id: 801, pernyataan: 'Guru menghargai dan mempromosikan prinsip-prinsip pancasila dan nilai-nilai moderasi beragama.' },
      { id: 802, pernyataan: 'Guru mengembangkan suasana belajar yang menjunjung tinggi toleransi dan persaudaraan islami (ukhuwah).' },
      { id: 803, pernyataan: 'Guru bertindak konsisten dan adil serta tidak membeda-bedakan latar belakang sosial, ekonomi, maupun gender peserta didik.' },
      { id: 804, pernyataan: 'Guru menerapkan aturan disiplin madrasah secara adil dan konsisten bagi seluruh warga madrasah.' },
    ],
  },
  {
    id: 9,
    nomor: 9,
    nama: 'Menunjukkan Pribadi yang Dewasa dan Menjadi Teladan',
    domain: 'Kepribadian',
    deskripsi: 'Guru menampilkan diri sebagai pribadi yang mantap, stabil, dewasa, arif, dan berwibawa serta menjadi teladan bagi peserta didik.',
    indikator: [
      { id: 901, pernyataan: 'Guru bertingkah laku sopan dalam berbicara, berpenampilan, dan berbuat terhadap semua peserta didik, orang tua, dan teman sejawat.' },
      { id: 902, pernyataan: 'Guru mau membagi pengalamannya dengan teman sejawat, termasuk mengundang mereka untuk mengobservasi cara mengajarnya.' },
      { id: 903, pernyataan: 'Guru mampu mengelola emosi dalam menghadapi situasi kritis serta bersikap bijaksana dalam mengambil keputusan.' },
      { id: 904, pernyataan: 'Guru memperlakukan semua peserta didik secara adil dan menunjukkan kepedulian yang tulus.' },
    ],
  },
  {
    id: 10,
    nomor: 10,
    nama: 'Etos Kerja, Tanggung Jawab Tinggi, dan Rasa Bangga Menjadi Guru',
    domain: 'Kepribadian',
    deskripsi: 'Guru menunjukkan etos kerja dan tanggung jawab yang tinggi, bangga menjadi pendidik madrasah, dan percaya pada diri sendiri.',
    indikator: [
      { id: 1001, pernyataan: 'Guru mengawali dan mengakhiri pembelajaran dengan tepat waktu sesuai jadwal yang ditetapkan madrasah.' },
      { id: 1002, pernyataan: 'Jika guru harus meninggalkan kelas, guru mengabarkan kepada pihak madrasah dan memberikan tugas mandiri yang bermanfaat.' },
      { id: 1003, pernyataan: 'Guru menyelesaikan semua tugas administratif dan tugas kedinasan dengan penuh tanggung jawab dan tepat waktu.' },
      { id: 1004, pernyataan: 'Guru menunjukkan rasa bangga dan dedikasi dalam mendidik generasi penerus madrasah.' },
    ],
  },

  // DOMAIN SOSIAL (11 - 12)
  {
    id: 11,
    nomor: 11,
    nama: 'Bersikap Inklusif, Bertindak Obyektif, serta Tidak Diskriminatif',
    domain: 'Sosial',
    deskripsi: 'Guru bersikap inklusif, bertindak obyektif, serta tidak diskriminatif karena pertimbangan jenis kelamin, agama, ras, kondisi fisik, latar belakang keluarga, dan status sosial ekonomi.',
    indikator: [
      { id: 1101, pernyataan: 'Guru memperlakukan semua peserta didik secara adil, tidak membedakan anak pejabat maupun warga biasa.' },
      { id: 1102, pernyataan: 'Guru menjaga hubungan profesional yang sehat dan harmonis dengan rekan kerja serta pimpinan madrasah.' },
      { id: 1103, pernyataan: 'Guru terbuka terhadap kritik dan saran yang konstruktif dari pimpinan, sesama guru, maupun peserta didik.' },
    ],
  },
  {
    id: 12,
    nomor: 12,
    nama: 'Komunikasi dengan Sesama Guru, Tenaga Kependidikan, Orang Tua, dan Masyarakat',
    domain: 'Sosial',
    deskripsi: 'Guru berkomunikasi secara efektif, empatik, dan santun dengan sesama pendidik, tenaga kependidikan, orang tua peserta didik, dan masyarakat sekitar madrasah.',
    indikator: [
      { id: 1201, pernyataan: 'Guru berkomunikasi dengan orang tua peserta didik mengenai kemajuan belajar dan hambatan yang dialami anak.' },
      { id: 1202, pernyataan: 'Guru aktif berpartisipasi dalam kegiatan musyawarah guru mata pelajaran (MGMP) tingkat MTs/madrasah.' },
      { id: 1203, pernyataan: 'Guru ikut serta dalam kegiatan kemasyarakatan dan memelihara nama baik madrasah di lingkungan sosial.' },
    ],
  },

  // DOMAIN PROFESIONAL (13 - 14)
  {
    id: 13,
    nomor: 13,
    nama: 'Penguasaan Materi, Struktur, Konsep, dan Pola Pikir Keilmuan',
    domain: 'Profesional',
    deskripsi: 'Guru menguasai materi pembelajaran, struktur keilmuan, dan konsep-konsep esensial mata pelajaran yang diampu di jenjang MTs secara komprehensif.',
    indikator: [
      { id: 1301, pernyataan: 'Guru memilih materi pembelajaran yang sesuai dengan tingkat perkembangan dan kemampuan peserta didik.' },
      { id: 1302, pernyataan: 'Guru mengolah materi pembelajaran secara integratif dan mengaitkannya dengan konteks kekinian dan nilai keislaman.' },
      { id: 1303, pernyataan: 'Guru memberikan contoh dan analogi yang tepat dan mudah dipahami dalam menerangkan konsep-konsep materi yang rumit.' },
      { id: 1304, pernyataan: 'Guru memanfaatkan kemajuan teknologi informasi dan komunikasi (TIK) dalam memperkaya materi ajar.' },
    ],
  },
  {
    id: 14,
    nomor: 14,
    nama: 'Mengembangkan Keprofesian Melalui Tindakan Reflektif',
    domain: 'Profesional',
    deskripsi: 'Guru mampu melakukan refleksi terhadap kinerja sendiri secara terus menerus, dan memanfaatkan hasil refleksi demi peningkatan keprofesian berkelanjutan (PKB).',
    indikator: [
      { id: 1401, pernyataan: 'Guru melakukan evaluasi diri dan refleksi terhadap pelaksanaan pembelajaran secara berkala.' },
      { id: 1402, pernyataan: 'Guru memanfaatkan hasil refleksi untuk merancang dan melaksanakan Penelitian Tindakan Kelas (PTK) atau karya inovatif.' },
      { id: 1403, pernyataan: 'Guru aktif mengikuti pelatihan, webinar, bimtek, workshop, atau seminar peningkatan kompetensi guru madrasah.' },
      { id: 1404, pernyataan: 'Guru memanfaatkan teknologi informasi untuk mencari referensi ilmiah dan media pembelajaran terbaru.' },
    ],
  },
];

// Instrumen Supervisi: Telaah Modul Ajar / RPP (Perencanaan Pembelajaran)
export const INSTRUMEN_TELAAH_RPP = [
  { id: 1, aspek: 'Identitas Mata Pelajaran', kriteria: 'Kelengkapan identitas madrasah, kelas/semester, alokasi waktu, dan mata pelajaran.' },
  { id: 2, aspek: 'Tujuan Pembelajaran / Capaian', kriteria: 'Kesesuaian tujuan pembelajaran dengan alur tujuan pembelajaran (ATP) dan kaidah ABCD/operasional.' },
  { id: 3, aspek: 'Materi Pembelajaran', kriteria: 'Keluasan, kedalaman, dan kemutakhiran materi serta integrasi nilai moderasi beragama.' },
  { id: 4, aspek: 'Model dan Metode Pembelajaran', kriteria: 'Kesesuaian model (PBL, PJBL, Discovery, Inkuiri) dengan karakteristik materi dan peserta didik MTs.' },
  { id: 5, aspek: 'Media dan Sumber Belajar', kriteria: 'Pemanfaatan media ajar interaktif digital/alat peraga nyata yang relevan.' },
  { id: 6, aspek: 'Skenario Pendahuluan', kriteria: 'Memuat apersepsi, motivasi, penyampaian tujuan, dan pemantik minat belajar.' },
  { id: 7, aspek: 'Skenario Kegiatan Inti', kriteria: 'Memuat langkah pembelajaran aktif berpusat pada siswa (student-centered) dan memicu nalar kritis (HOTS).' },
  { id: 8, aspek: 'Skenario Penutup', kriteria: 'Memuat kegiatan simpulan, refleksi bersama peserta didik, dan tindak lanjut tugas.' },
  { id: 9, aspek: 'Rancangan Asesmen Diagnostik & Formatif', kriteria: 'Tersedia instrumen asesmen proses untuk memantau kemajuan belajar peserta didik.' },
  { id: 10, aspek: 'Rancangan Asesmen Sumatif & Rubrik', kriteria: 'Instrumen penilaian hasil belajar dilengkapi kisi-kisi dan rubrik penilaian yang jelas.' },
];

// Instrumen Supervisi: Observasi Pelaksanaan PBM di Kelas
export const INSTRUMEN_OBSERVASI_KELAS = [
  // Pendahuluan
  { id: 1, aspek: 'Pendahuluan: Pembiasaan & Doa', kriteria: 'Membuka pembelajaran dengan salam santun, doa bersama, dan presensi tertib.' },
  { id: 2, aspek: 'Pendahuluan: Apersepsi & Kaitan Materi', kriteria: 'Mengaitkan materi sekarang dengan materi sebelumnya atau fenomena nyata sehari-hari.' },
  { id: 3, aspek: 'Pendahuluan: Tujuan & Motivasi', kriteria: 'Menyampaikan tujuan pembelajaran dan manfaatnya secara memotivasi.' },
  // Inti
  { id: 4, aspek: 'Inti: Penguasaan Materi Ajar', kriteria: 'Menyampaikan materi dengan jelas, benar secara konsep, tanpa keraguan.' },
  { id: 5, aspek: 'Inti: Strategi Pembelajaran Aktif', kriteria: 'Melibatkan peserta didik aktif berdiskusi, bertanya, berkreasi, bukan sekadar ceramah pasif.' },
  { id: 6, aspek: 'Inti: Pemanfaatan Media/TIK', kriteria: 'Mengoperasikan media tayang/alat bantu peraga secara efektif dan terampil.' },
  { id: 7, aspek: 'Inti: Pembelajaran Berbasis HOTS', kriteria: 'Memicu pertanyaan analitis tingkat tinggi dan kemampuan problem solving peserta didik.' },
  { id: 8, aspek: 'Inti: Diferensiasi & Inklusivitas', kriteria: 'Merespons perbedaan kecepatan belajar siswa dan memberikan pendampingan yang ramah.' },
  { id: 9, aspek: 'Inti: Pengelolaan Kelas & Disiplin Positif', kriteria: 'Menjaga suasana belajar tertib, dinamis, aman, dan tanpa intimidasi atau hukuman fisik.' },
  { id: 10, aspek: 'Inti: Interaksi & Komunikasi Santun', kriteria: 'Berbahasa santun, komunikatif, dan mengapresiasi partisipasi setiap peserta didik.' },
  { id: 11, aspek: 'Inti: Asesmen Proses Formatif', kriteria: 'Mengamati dan mengecek pemahaman peserta didik selama kegiatan berlangsung.' },
  { id: 12, aspek: 'Inti: Manajemen Alokasi Waktu', kriteria: 'Melaksanakan tahapan pembelajaran sesuai proporsi alokasi jam mengajar.' },
  // Penutup
  { id: 13, aspek: 'Penutup: Simpulan Pembelajaran', kriteria: 'Membimbing peserta didik merangkum poin-poin penting esensi pembelajaran.' },
  { id: 14, aspek: 'Penutup: Refleksi Peserta Didik', kriteria: 'Melakukan refleksi pengalaman belajar, perasaan, dan hal yang masih perlu dipelajari.' },
  { id: 15, aspek: 'Penutup: Tindak Lanjut & Doa', kriteria: 'Memberikan arahan tugas/persiapan pekan depan dan menutup dengan doa serta salam.' },
];

// Data Default Guru Madrasah Tsanawiyah (MTs)
export const GURU_LIST_DEFAULT: Guru[] = [
  {
    id: 'guru-1',
    nip: '19820315 200801 1 012',
    nuptk: '4539760662200023',
    nama: 'Muhammad Ridwan, S.Pd.I',
    jenisKelamin: 'L',
    pangkatGolongan: 'Penata / III/c',
    jabatan: 'Guru Muda',
    mataPelajaran: 'Fiqih',
    tugasTambahan: 'Wali Kelas VII-A',
    pendidikanTerakhir: 'S1 Pendidikan Agama Islam (UIN)',
    tmtGuru: '2008-01-01',
    nomorHP: '081234567891',
    email: 'm.ridwan.mts@gmail.com',
    jamMengajarMinggu: 24,
    statusPenilaian: 'Selesai',
    dokumenBukti: [
      { nama: 'Modul Ajar Fiqih Semester 1 & 2', tipe: 'PDF', url: 'https://drive.google.com/sample_rpp_fiqih', tanggalUnggah: '2026-08-10' },
      { nama: 'Silabus dan Alur Tujuan Pembelajaran', tipe: 'PDF', url: 'https://drive.google.com/sample_atp_fiqih', tanggalUnggah: '2026-08-10' },
      { nama: 'Instrumen Asesmen Formatif & LKPD', tipe: 'DOCX', url: 'https://drive.google.com/sample_lkpd_fiqih', tanggalUnggah: '2026-09-02' },
    ],
  },
  {
    id: 'guru-2',
    nip: '19870520 201101 2 018',
    nuptk: '7841765666210042',
    nama: 'Siti Nur Aisyah, S.Pd., M.Pd.',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata Tingkat I / III/d',
    jabatan: 'Guru Muda',
    mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
    tugasTambahan: 'Kepala Laboratorium IPA',
    pendidikanTerakhir: 'S2 Pendidikan IPA (UPI)',
    tmtGuru: '2011-01-01',
    nomorHP: '081398765432',
    email: 'siti.aisyah.ipa@gmail.com',
    jamMengajarMinggu: 26,
    statusPenilaian: 'Selesai',
    dokumenBukti: [
      { nama: 'Modul Ajar IPA Sistem Organ & Energi', tipe: 'PDF', url: 'https://drive.google.com/sample_modul_ipa', tanggalUnggah: '2026-08-12' },
      { nama: 'Jurnal Praktikum Laboratorium MTs', tipe: 'XLSX', url: 'https://drive.google.com/sample_jurnal_lab', tanggalUnggah: '2026-09-15' },
    ],
  },
  {
    id: 'guru-3',
    nip: '19791114 200501 1 007',
    nuptk: '1245757659200031',
    nama: 'Drs. H. Lukman Hakim',
    jenisKelamin: 'L',
    pangkatGolongan: 'Pembina / IV/a',
    jabatan: 'Guru Madya',
    mataPelajaran: 'Al-Qur\'an Hadis',
    tugasTambahan: 'Wakil Kepala Madrasah Bidang Kurikulum',
    pendidikanTerakhir: 'S1 Tafsir Hadis (IAIN)',
    tmtGuru: '2005-01-01',
    nomorHP: '081223344556',
    email: 'lukman.hakim.mts@gmail.com',
    jamMengajarMinggu: 24,
    statusPenilaian: 'Selesai',
    dokumenBukti: [
      { nama: 'Modul Ajar Qur\'an Hadis Kelas IX', tipe: 'PDF', url: 'https://drive.google.com/sample_rpp_qh', tanggalUnggah: '2026-08-05' },
      { nama: 'Kumpulan Soal Asesmen Standar Kemenag', tipe: 'PDF', url: 'https://drive.google.com/sample_soal_qh', tanggalUnggah: '2026-09-20' },
    ],
  },
  {
    id: 'guru-4',
    nip: '19920818 201903 2 015',
    nuptk: '9034770671230012',
    nama: 'Dewi Rahmawati, S.Pd.',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata Muda / III/a',
    jabatan: 'Guru Pertama',
    mataPelajaran: 'Bahasa Indonesia',
    tugasTambahan: 'Kepala Perpustakaan Madrasah',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa & Sastra Indonesia',
    tmtGuru: '2019-03-01',
    nomorHP: '085712345678',
    email: 'dewi.rahmawati.mts@gmail.com',
    jamMengajarMinggu: 24,
    statusPenilaian: 'Dalam Proses',
    dokumenBukti: [
      { nama: 'Modul Ajar Teks Deskripsi & Laporan', tipe: 'PDF', url: 'https://drive.google.com/sample_modul_bind', tanggalUnggah: '2026-08-15' },
    ],
  },
  {
    id: 'guru-5',
    nip: '19850610 201001 1 021',
    nuptk: '3441763665200013',
    nama: 'Ustadz Ahmad Zaki, Lc., M.Hum.',
    jenisKelamin: 'L',
    pangkatGolongan: 'Penata Tingkat I / III/d',
    jabatan: 'Guru Muda',
    mataPelajaran: 'Bahasa Arab',
    tugasTambahan: 'Pembina OSIM & Bahasa Arab Club',
    pendidikanTerakhir: 'S2 Bahasa Arab (Al-Azhar / UIN)',
    tmtGuru: '2010-01-01',
    nomorHP: '081345678910',
    email: 'ahmad.zaki.arabic@gmail.com',
    jamMengajarMinggu: 24,
    statusPenilaian: 'Selesai',
    dokumenBukti: [
      { nama: 'Modul Pembelajaran Muhadatsah & Nahwu', tipe: 'PDF', url: 'https://drive.google.com/sample_arabic', tanggalUnggah: '2026-08-14' },
    ],
  },
  {
    id: 'guru-6',
    nip: '19900214 201502 2 006',
    nuptk: '6138768670220021',
    nama: 'Fatimah Az-Zahra, S.Si.',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata Muda Tingkat I / III/b',
    jabatan: 'Guru Pertama',
    mataPelajaran: 'Matematika',
    tugasTambahan: 'Wali Kelas VIII-B',
    pendidikanTerakhir: 'S1 Matematika (UNY)',
    tmtGuru: '2015-02-01',
    nomorHP: '087812349988',
    email: 'fatimah.matematika@gmail.com',
    jamMengajarMinggu: 24,
    statusPenilaian: 'Belum Dinilai',
    dokumenBukti: [],
  },
];

// Helper fungsi untuk menghasilkan Skor Kompetensi awal yang realistis
export function generateDefaultSkorPerKompetensi(level: 'tinggi' | 'sedang' | 'rendah') {
  const result: Record<number, any> = {};
  KOMPETENSI_PKG_14.forEach((komp) => {
    const skorIndikator: Record<number, 0 | 1 | 2> = {};
    let totalMentah = 0;
    const maxMentah = komp.indikator.length * 2;

    komp.indikator.forEach((ind) => {
      let skor: 0 | 1 | 2 = 2;
      if (level === 'sedang') {
        skor = Math.random() > 0.35 ? 2 : 1;
      } else if (level === 'rendah') {
        skor = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? 2 : 0);
      }
      skorIndikator[ind.id] = skor;
      totalMentah += skor;
    });

    const persentase = (totalMentah / maxMentah) * 100;
    let skorStandar: 1 | 2 | 3 | 4 = 4;
    if (persentase <= 25) skorStandar = 1;
    else if (persentase <= 50) skorStandar = 2;
    else if (persentase <= 75) skorStandar = 3;
    else skorStandar = 4;

    result[komp.id] = {
      kompetensiId: komp.id,
      skorIndikator,
      totalSkorMentah: totalMentah,
      skorMaksimalMentah: maxMentah,
      persentase: Math.round(persentase),
      skorStandar,
    };
  });
  return result;
}

// Data Default Penilaian PKG untuk guru yang sudah dinilai
export const PENILAIAN_PKG_DEFAULT: Record<string, PenilaianPKGGuru> = {
  'guru-1': {
    guruId: 'guru-1',
    tahun: '2026',
    tanggalPenilaian: '2026-10-02',
    penilaiNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    penilaiNip: '19740512 200003 1 002',
    skorPerKompetensi: generateDefaultSkorPerKompetensi('tinggi'),
    totalSkorPKG: 52, // dari maks 56
    nilaiPKG100: 92.86,
    sebutan: 'Amat Baik',
    persentaseKinerja: 125,
    angkaKreditTahunan: 20.25,
    catatanPenilai: 'Ustadz Ridwan menunjukkan kinerja pedagogik yang sangat baik dan integrasi nilai moderasi beragama dalam pembelajaran Fiqih sangat menonjol.',
    rekomendasiPKB: 'Disarankan menyusun modul pembelajaran terbitan Kemenag dan membagikan best practice di forum MGMP MTs.',
  },
  'guru-2': {
    guruId: 'guru-2',
    tahun: '2026',
    tanggalPenilaian: '2026-09-28',
    penilaiNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    penilaiNip: '19740512 200003 1 002',
    skorPerKompetensi: generateDefaultSkorPerKompetensi('tinggi'),
    totalSkorPKG: 54,
    nilaiPKG100: 96.43,
    sebutan: 'Amat Baik',
    persentaseKinerja: 125,
    angkaKreditTahunan: 29.75,
    catatanPenilai: 'Ibu Siti Nur Aisyah sangat inovatif dalam pengelolaan laboratorium IPA dan pembelajaran berbasis praktikum riil.',
    rekomendasiPKB: 'Direkomendasikan untuk mengikuti seleksi Guru Madrasah Berprestasi tingkat provinsi.',
  },
  'guru-3': {
    guruId: 'guru-3',
    tahun: '2026',
    tanggalPenilaian: '2026-10-05',
    penilaiNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    penilaiNip: '19740512 200003 1 002',
    skorPerKompetensi: generateDefaultSkorPerKompetensi('tinggi'),
    totalSkorPKG: 51,
    nilaiPKG100: 91.07,
    sebutan: 'Amat Baik',
    persentaseKinerja: 125,
    angkaKreditTahunan: 29.75,
    catatanPenilai: 'Drs. H. Lukman Hakim memiliki keteladanan yang sangat tinggi dan bimbingan kurikulum yang sangat solid.',
    rekomendasiPKB: 'Dapat menjadi mentor pembimbing bagi guru-guru muda dan pemula di madrasah.',
  },
  'guru-5': {
    guruId: 'guru-5',
    tahun: '2026',
    tanggalPenilaian: '2026-09-20',
    penilaiNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    penilaiNip: '19740512 200003 1 002',
    skorPerKompetensi: generateDefaultSkorPerKompetensi('sedang'),
    totalSkorPKG: 48,
    nilaiPKG100: 85.71,
    sebutan: 'Baik',
    persentaseKinerja: 100,
    angkaKreditTahunan: 23.80,
    catatanPenilai: 'Penguasaan bahasa Arab sangat mumpuni. Perlu ditingkatkan ragam media visual digital.',
    rekomendasiPKB: 'Dianjurkan mengikuti pelatihan pembuatan media ajar digital interaktif (Canva / Kahoot / Quizziz).',
  },
};

// Data Default Supervisi Akademik Guru
export const SUPERVISI_LIST_DEFAULT: Record<string, SupervisiGuru> = {
  'guru-1': {
    id: 'sup-1',
    guruId: 'guru-1',
    tanggal: '2026-09-18',
    supervisorNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    supervisorNip: '19740512 200003 1 002',
    semester: 'Ganjil',
    tahunPelajaran: '2026/2027',
    telaahRPP: {
      skorItems: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 4, 7: 4, 8: 3, 9: 4, 10: 4 },
      skorTotal: 38,
      skorMaksimal: 40,
      persentase: 95,
      kategori: 'Sangat Baik',
      catatan: 'Modul ajar lengkap dan sistematis. Kegiatan apersepsi relevan dengan kehidupan siswa sehari-hari.',
    },
    observasiPBM: {
      skorItems: {
        1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 4, 8: 4, 9: 4, 10: 4, 11: 4, 12: 4, 13: 4, 14: 3, 15: 4,
      },
      skorTotal: 58,
      skorMaksimal: 60,
      persentase: 96.67,
      kategori: 'Sangat Baik',
      catatan: 'Pembelajaran Fiqih berlangsung sangat hidup. Siswa aktif berpraktik simulasi manasik dan thaharah.',
    },
    catatanKelebihan: 'Pendekatan komunikatif islami sangat hangat, penguasaan materi fiqih matang dan teruji.',
    catatanKelemahan: 'Media visual presentasi layar dapat diperkaya dengan infografis tahapan rukun fiqih.',
    tindakLanjut: 'Melanjutkan penerapan model pembelajaran berbasis studi kasus dan simulasi.',
    targetWaktu: 'Semester Genap 2026/2027',
    status: 'Selesai',
  },
  'guru-2': {
    id: 'sup-2',
    guruId: 'guru-2',
    tanggal: '2026-09-22',
    supervisorNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    supervisorNip: '19740512 200003 1 002',
    semester: 'Ganjil',
    tahunPelajaran: '2026/2027',
    telaahRPP: {
      skorItems: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 },
      skorTotal: 40,
      skorMaksimal: 40,
      persentase: 100,
      kategori: 'Sangat Baik',
      catatan: 'Perencanaan modul IPA model Project-Based Learning sangat detail dan terukur.',
    },
    observasiPBM: {
      skorItems: {
        1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 4, 12: 4, 13: 4, 14: 4, 15: 4,
      },
      skorTotal: 60,
      skorMaksimal: 60,
      persentase: 100,
      kategori: 'Sangat Baik',
      catatan: 'Praktikum berjalan sangat aman dan teratur. Setiap kelompok siswa terlibat aktif dalam eksperimen.',
    },
    catatanKelebihan: 'Manajemen laboratorium luar biasa, instruksi keselamatan kerja jelas, apresiatif terhadap pertanyaan siswa.',
    catatanKelemahan: 'Hampir tidak ditemukan kelemahan berarti, pengaturan ritme diskusi sudah sangat matang.',
    tindakLanjut: 'Disarankan membuat panduan praktikum mandiri siswa berbasis LKPD digital.',
    targetWaktu: 'Bulan November 2026',
    status: 'Selesai',
  },
  'guru-3': {
    id: 'sup-3',
    guruId: 'guru-3',
    tanggal: '2026-09-25',
    supervisorNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    supervisorNip: '19740512 200003 1 002',
    semester: 'Ganjil',
    tahunPelajaran: '2026/2027',
    telaahRPP: {
      skorItems: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 3, 10: 4 },
      skorTotal: 38,
      skorMaksimal: 40,
      persentase: 95,
      kategori: 'Sangat Baik',
      catatan: 'RPP Qur\'an Hadis memuat tadarus dan tahsin yang sangat mendidik.',
    },
    observasiPBM: {
      skorItems: {
        1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 4, 8: 4, 9: 4, 10: 4, 11: 4, 12: 4, 13: 4, 14: 3, 15: 4,
      },
      skorTotal: 57,
      skorMaksimal: 60,
      persentase: 95,
      kategori: 'Sangat Baik',
      catatan: 'Suasana kelas sangat religius dan tertib. Makharijul huruf dan tajwid diajarkan dengan sabar.',
    },
    catatanKelebihan: 'Wibawa pendidik dan keteladanan sangat terasa, bimbingan akhlak menyatu dalam materi.',
    catatanKelemahan: 'Pemanfaatan audio murottal digital dapat ditingkatkan.',
    tindakLanjut: 'Integrasi aplikasi audio Al-Qur\'an digital di kelas.',
    targetWaktu: 'Semester Genap',
    status: 'Selesai',
  },
  'guru-5': {
    id: 'sup-5',
    guruId: 'guru-5',
    tanggal: '2026-09-12',
    supervisorNama: 'Dr. H. Ahmad Fauzi, M.Pd.I',
    supervisorNip: '19740512 200003 1 002',
    semester: 'Ganjil',
    tahunPelajaran: '2026/2027',
    telaahRPP: {
      skorItems: { 1: 4, 2: 3, 3: 4, 4: 3, 5: 3, 6: 3, 7: 4, 8: 3, 9: 3, 10: 3 },
      skorTotal: 33,
      skorMaksimal: 40,
      persentase: 82.5,
      kategori: 'Baik',
      catatan: 'Format perencanaan sudah baik, perkuat instrumen asesmen diagnostik awal.',
    },
    observasiPBM: {
      skorItems: {
        1: 4, 2: 3, 3: 3, 4: 4, 5: 3, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 3, 12: 4, 13: 3, 14: 3, 15: 4,
      },
      skorTotal: 51,
      skorMaksimal: 60,
      persentase: 85,
      kategori: 'Baik',
      catatan: 'Pengucapan bahasa Arab fasih. Siswa diajak praktik hiwar berpasangan.',
    },
    catatanKelebihan: 'Bahasa pengantar Arab aktif digunakan, kepercayaan diri siswa berbicara meningkat.',
    catatanKelemahan: 'Sebagian siswa yang belum lancar membaca huruf hijaiyah perlu waktu adaptasi ekstra.',
    tindakLanjut: 'Pendampingan khusus kelompok sebaya (tutor sebaya).',
    targetWaktu: 'Bulan Oktober 2026',
    status: 'Selesai',
  },
};
