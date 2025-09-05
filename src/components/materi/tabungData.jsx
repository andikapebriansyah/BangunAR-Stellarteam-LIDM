export const tabungMateriData = {
  title: 'Eksplorasi Tabung: Dari Observasi hingga Penciptaan',
  subtitle: 'Temukan Rahasia Bangun Ruang di Sekitar Kita',
  description: 'Bagaimana jika kamu bisa membangun menara dari tabung? Apa rahasia di balik bentuk kaleng minuman favoritmu? Mari jelajahi dunia tabung melalui pengamatan, eksperimen, dan kreativitas!',
  color: 'from-cyan-500 to-blue-600',
  icon: '🔍',
  sections: [
    {
      id: 'studi-kasus-awal',
      title: '🌟 Tantangan: Membangun Menara Tabung',
      type: 'case-study',
      duration: 20,
      status: 'available',
      content: {
        mainQuestion: 'Bayangkan kamu diminta untuk membuat miniatur menara menggunakan tiga tabung yang ditumpuk dari besar ke kecil. Apa saja yang perlu kamu pahami untuk membuat menara yang sempurna?',
        scenario: 'Seorang arsitek muda ingin membuat miniatur menara ikonik menggunakan tiga tabung berbeda ukuran. Menara ini harus stabil, indah, dan proporsional.',
        observationPrompts: [
          'Perhatikan di sekitarmu! Dimana saja kamu menemukan bentuk tabung?',
          'Coba amati kaleng minuman, botol air, atau pipa. Apa yang sama dari bentuk-bentuk ini?',
          'Mengapa menurutmu banyak wadah dibuat berbentuk tabung?'
        ],
        realLifeExamples: [
          { 
            name: 'Kaleng Minuman', 
            description: 'Bentuk silinder sempurna - mengapa tidak kotak?',
            question: 'Kenapa kaleng tidak berbentuk kubus?'
          },
          { 
            name: 'Silo Penyimpanan', 
            description: 'Gudang raksasa berbentuk tabung',
            question: 'Apa keuntungan bentuk tabung untuk penyimpanan?'
          },
          { 
            name: 'Menara Air', 
            description: 'Struktur tinggi berbentuk tabung',
            question: 'Mengapa menara air tidak berbentuk piramid?'
          },
          { 
            name: 'Toples Kue', 
            description: 'Wadah makanan berbentuk tabung dengan tutup',
            question: 'Bagaimana tutup bisa pas sempurna?'
          }
        ],
        challengeQuestion: 'Setelah mengamati berbagai tabung di sekitarmu, menurutmu apa saja yang harus diketahui untuk membuat menara tabung yang sempurna?',
        nextStepHint: 'Mari kita mulai dengan mengenal bagian-bagian tabung lebih dalam...'
      }
    },
    {
      id: 'eksplorasi-unsur-ar',
      title: '🔍 Mengenal Unsur-unsur Tabung (AR Experience)',
      type: 'ar-exploration',
      duration: 25,
      status: 'locked',
      content: {
        introduction: 'Sekarang saatnya menjelajahi tabung lebih dalam! Gunakan teknologi AR untuk "membedah" tabung dan temukan rahasianya.',
        arChallenge: 'Gunakan fitur AR untuk menemukan dan mengidentifikasi setiap bagian tabung. Catat temuanmu!',
        explorationTasks: [
          'Temukan dan tandai ALAS tabung - bidang lingkaran di bawah',
          'Identifikasi TUTUP tabung - bidang lingkaran di atas', 
          'Jelajahi SELIMUT tabung - bidang lengkung yang mengelilingi',
          'Ukur JARI-JARI - jarak dari pusat ke tepi lingkaran',
          'Tentukan TINGGI - jarak antara alas dan tutup'
        ],
        elements: [
          {
            name: 'Alas dan Tutup',
            symbol: '⭕',
            description: 'Dua bidang berbentuk lingkaran yang identik',
            properties: ['Bentuk lingkaran sempurna', 'Ukuran yang sama', 'Posisi sejajar']
          },
          {
            name: 'Selimut',
            symbol: '📜',
            description: 'Bidang lengkung yang menghubungkan alas dan tutup',
            properties: ['Berbentuk persegi panjang jika direbahkan', 'Mengelilingi tabung', 'Tinggi = tinggi tabung']
          },
          {
            name: 'Jari-jari (r)',
            symbol: '📏',
            description: 'Jarak dari pusat ke tepi lingkaran',
            properties: ['Sama untuk alas dan tutup', 'Menentukan ukuran lingkaran']
          },
          {
            name: 'Tinggi (t)',
            symbol: '📐',
            description: 'Jarak vertikal antara alas dan tutup',
            properties: ['Menentukan "panjang" tabung', 'Tegak lurus dengan alas']
          }
        ],
        lkpdLink: 'https://www.liveworksheets.com/tabung-unsur',
        summaryContent: {
          title: 'Rangkuman: Unsur-unsur Tabung',
          definition: 'Tabung terdiri dari dua lingkaran identik (alas dan tutup) yang dihubungkan oleh bidang lengkung (selimut). Jari-jari menentukan ukuran lingkaran, sedangkan tinggi menentukan "panjang" tabung.',
          keyPoints: [
            'Alas dan tutup: lingkaran identik dan sejajar',
            'Selimut: bidang lengkung berbentuk persegi panjang jika dibuka',
            'Jari-jari: jarak dari pusat ke tepi (sama untuk alas dan tutup)',
            'Tinggi: jarak tegak lurus antara alas dan tutup'
          ]
        }
      }
    },
    {
      id: 'eksperimen-volume',
      title: '⚗️ Eksperimen: Berapa Muat Isi Tabung?',
      type: 'experiment',
      duration: 30,
      status: 'locked',
      content: {
        question: 'Bagaimana cara mengetahui berapa banyak air yang bisa ditampung oleh tabung?',
        hypothesis: 'Buatlah hipotesis: Apa yang mempengaruhi banyaknya isi tabung?',
        experimentPrompt: 'Mari lakukan eksperimen virtual untuk menemukan pola volume tabung!',
        lkpdLink: 'https://www.liveworksheets.com/tabung-volume',
        discovery: [
          'Amati: Tabung mana yang menampung air lebih banyak?',
          'Bandingkan: Apa pengaruh jari-jari terhadap volume?',
          'Analisis: Apa pengaruh tinggi terhadap volume?',
          'Simpulkan: Bagaimana rumus volume tabung?'
        ],
        concept: 'Volume tabung adalah seberapa banyak ruang yang dapat diisi dalam tabung tersebut.',
        formula: {
          discovery: 'Volume = Luas Alas × Tinggi',
          main: 'V = π × r² × t',
          components: {
            'π': 'Konstanta pi (≈ 3.14159)',
            'r²': 'Jari-jari dikuadratkan (luas lingkaran tanpa π)',
            't': 'Tinggi tabung'
          }
        },
        summaryContent: {
          title: 'Rangkuman: Volume Tabung',
          definition: 'Volume tabung adalah banyaknya ruang yang dapat diisi dalam tabung, dihitung dengan mengalikan luas alas (lingkaran) dengan tingginya.',
          formula: 'V = π × r² × t',
          keyInsights: [
            'Volume bergantung pada jari-jari dan tinggi',
            'Jari-jari dikuadratkan, sehingga pengaruhnya lebih besar',
            'Menggandakan jari-jari = 4 kali lipat volume',
            'Menggandakan tinggi = 2 kali lipat volume'
          ]
        }
      }
    },
    {
      id: 'investigasi-luas-permukaan',
      title: '🎨 Investigasi: Berapa Cat yang Dibutuhkan?',
      type: 'investigation',
      duration: 30,
      status: 'locked',
      content: {
        scenario: 'Kamu ingin mengecat tabung. Berapa luas permukaan yang harus dicat?',
        problem: 'Seorang pengrajin ingin melapisi tabung dengan kertas hias. Bagaimana menghitung luas kertas yang dibutuhkan?',
        investigationSteps: [
          'Identifikasi: Bagian mana saja yang perlu dilapisi?',
          'Hitung: Berapa luas setiap bagian?',
          'Jumlahkan: Total luas permukaan tabung?'
        ],
        lkpdLink: 'https://www.liveworksheets.com/tabung-luas-permukaan',
        concept: 'Luas permukaan tabung adalah jumlah luas semua bidang yang membentuk tabung.',
        formula: {
          breakdown: [
            'Luas Alas = π × r²',
            'Luas Tutup = π × r²', 
            'Luas Selimut = 2 × π × r × t'
          ],
          main: 'LP = 2πr² + 2πrt = 2πr(r + t)',
          components: {
            '2πr²': 'Luas kedua lingkaran (alas + tutup)',
            '2πrt': 'Luas selimut tabung',
            '2πr(r + t)': 'Bentuk faktor untuk mempermudah perhitungan'
          }
        },
        summaryContent: {
          title: 'Rangkuman: Luas Permukaan Tabung',
          definition: 'Luas permukaan tabung adalah total luas semua bidang pembentuk tabung: dua lingkaran (alas dan tutup) plus satu selimut.',
          formula: 'LP = 2πr(r + t)',
          keyInsights: [
            'Terdiri dari 3 komponen: alas, tutup, dan selimut',
            'Alas dan tutup memiliki luas yang sama',
            'Selimut = persegi panjang dengan panjang = keliling alas',
            'Rumus dapat difaktorkan untuk mempermudah perhitungan'
          ]
        }
      }
    },
    {
      id: 'tantangan-menara-3d',
      title: '🏗️ Wujudkan Menara Impianmu!',
      type: '3d-builder',
      duration: 25,
      status: 'locked',
      content: {
        backToChallenge: 'Ingat tantangan awal? Sekarang saatnya mewujudkan menara tabung impianmu!',
        challenge: 'Menggunakan semua pengetahuan yang telah kamu peroleh, bangun menara dari tiga tabung dengan perhitungan yang tepat!',
        requirements: [
          'Gunakan 3 tabung dengan ukuran berbeda (besar, sedang, kecil)',
          'Susun dari besar ke kecil (dari bawah ke atas)',
          'Hitung total volume menara',
          'Hitung total luas permukaan untuk pengecatan',
          'Pastikan proporsi yang baik dan stabil'
        ],
        skills: [
          'Menerapkan konsep unsur-unsur tabung',
          'Menggunakan rumus volume dan luas permukaan', 
          'Mempertimbangkan aspek proporsi dan stabilitas',
          'Mengintegrasikan matematika dengan desain'
        ],
        builderLink: '/materi-pembelajaran/tabung/build-challenge',
        reflection: [
          'Bagaimana pengetahuan unsur tabung membantumu dalam mendesain?',
          'Rumus mana yang paling berguna dalam proyek ini?',
          'Apa tantangan terbesar dalam membangun menara?',
          'Bagaimana kamu bisa mengaplikasikan ini di kehidupan nyata?'
        ]
      }
    }
  ]
};
