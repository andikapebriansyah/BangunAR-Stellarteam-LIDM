export const tabungMateriData = {
  title: 'Pembelajaran Tabung',
  subtitle: 'Menguasai Konsep Bangun Ruang Sisi Lengkung',
  description: 'Pelajari definisi, unsur-unsur, rumus, dan aplikasi praktis tabung melalui pembelajaran interaktif dengan kalkulator volume dan luas permukaan.',
  color: 'from-cyan-500 to-blue-600',
  icon: '🥤',
  sections: [
    {
      id: 'definisi-tabung',
      title: 'Definisi dan Karakteristik Tabung',
      type: 'interactive',
      duration: 15,
      status: 'available',
      content: {
        definition: 'Tabung adalah bangun ruang tiga dimensi yang memiliki dua bidang berbentuk lingkaran sebagai alas dan tutup, serta bidang lengkung yang mengelilinginya.',
        characteristics: [
          'Memiliki dua bidang alas berbentuk lingkaran yang kongruen',
          'Bidang alas dan tutup sejajar dan berhadapan',
          'Memiliki satu bidang selimut berbentuk persegi panjang yang melengkung',
          'Tinggi tabung adalah jarak antara bidang alas dan tutup',
          'Jari-jari alas sama dengan jari-jari tutup'
        ],
        realLifeExamples: [
          { name: 'Kaleng Minuman', description: 'Bentuk silinder sempurna dengan alas dan tutup circular' },
          { name: 'Botol Air', description: 'Wadah berbentuk tabung untuk menyimpan cairan' },
          { name: 'Drum Minyak', description: 'Container industri berbentuk tabung untuk bahan cair' },
          { name: 'Silo Gandum', description: 'Bangunan penyimpanan berbentuk tabung raksasa' },
          { name: 'Pipa Air', description: 'Saluran air berbentuk tabung panjang' },
          { name: 'Toples Kue', description: 'Wadah makanan berbentuk tabung dengan tutup' }
        ]
      }
    },
    {
      id: 'unsur-tabung',
      title: 'Unsur-unsur Tabung',
      type: 'visual',
      duration: 20,
      status: 'locked',
      content: {
        elements: [
          {
            name: 'Alas dan Tutup',
            symbol: '⭕',
            description: 'Dua bidang berbentuk lingkaran yang kongruen dan sejajar',
            formula: 'Luas = π × r²',
            properties: ['Bentuk lingkaran', 'Kongruen (sama besar)', 'Sejajar', 'Berhadapan']
          },
          {
            name: 'Selimut',
            symbol: '📜',
            description: 'Bidang lengkung yang menghubungkan alas dan tutup',
            formula: 'Luas = 2 × π × r × t',
            properties: ['Berbentuk persegi panjang jika dibuka', 'Panjang = keliling alas', 'Lebar = tinggi tabung']
          },
          {
            name: 'Jari-jari (r)',
            symbol: '📏',
            description: 'Jarak dari pusat lingkaran alas/tutup ke tepi',
            properties: ['Sama untuk alas dan tutup', 'Menentukan luas alas', 'Menentukan keliling alas']
          },
          {
            name: 'Tinggi (t)',
            symbol: '📐',
            description: 'Jarak tegak lurus antara bidang alas dan tutup',
            properties: ['Menentukan volume tabung', 'Menentukan luas selimut', 'Sumbu rotasi tabung']
          },
          {
            name: 'Diameter (d)',
            symbol: '↔️',
            description: 'Garis lurus yang melalui pusat dan menghubungkan dua titik pada lingkaran',
            formula: 'd = 2 × r',
            properties: ['Dua kali jari-jari', 'Garis terpanjang dalam lingkaran']
          }
        ],
        quiz: {
          questions: [
            {
              question: 'Bagian tabung manakah yang berbentuk persegi panjang jika dibuka?',
              options: ['Alas', 'Tutup', 'Selimut', 'Jari-jari'],
              correct: 'Selimut',
              explanation: 'Selimut tabung berbentuk persegi panjang jika dibuka rata, dengan panjang sama dengan keliling alas dan lebar sama dengan tinggi tabung.'
            },
            {
              question: 'Jika jari-jari tabung 7 cm, berapakah diameternya?',
              options: ['7 cm', '14 cm', '21 cm', '49 cm'],
              correct: '14 cm',
              explanation: 'Diameter = 2 × jari-jari = 2 × 7 = 14 cm'
            },
            {
              question: 'Unsur tabung yang menentukan volume adalah...',
              options: ['Hanya jari-jari', 'Hanya tinggi', 'Jari-jari dan tinggi', 'Hanya diameter'],
              correct: 'Jari-jari dan tinggi',
              explanation: 'Volume tabung = π × r² × t, sehingga bergantung pada jari-jari dan tinggi.'
            }
          ]
        }
      }
    },
    {
      id: 'volume-tabung',
      title: 'Menghitung Volume Tabung',
      type: 'calculator',
      duration: 25,
      status: 'locked',
      content: {
        concept: 'Volume tabung adalah besaran yang menyatakan seberapa banyak ruang yang dapat ditempati oleh tabung tersebut.',
        formula: {
          main: 'V = π × r² × t',
          components: {
            'π': 'Konstanta pi (≈ 3.14159)',
            'r': 'Jari-jari alas tabung',
            't': 'Tinggi tabung'
          },
          derivation: 'Volume = Luas Alas × Tinggi = (π × r²) × t'
        },
        examples: [
          {
            title: 'Contoh 1: Kaleng Minuman',
            given: { radius: 3.5, height: 12 },
            solution: {
              step1: 'V = π × r² × t',
              step2: 'V = π × (3.5)² × 12',
              step3: 'V = π × 12.25 × 12',
              step4: 'V = π × 147',
              step5: 'V = 147π ≈ 461.81 cm³'
            }
          },
          {
            title: 'Contoh 2: Drum Minyak',
            given: { radius: 30, height: 100 },
            solution: {
              step1: 'V = π × r² × t',
              step2: 'V = π × (30)² × 100',
              step3: 'V = π × 900 × 100',
              step4: 'V = 90.000π ≈ 282.743 cm³'
            }
          }
        ],
        calculator: true
      }
    },
    {
      id: 'luas-permukaan-tabung',
      title: 'Luas Permukaan Tabung',
      type: 'formula',
      duration: 25,
      status: 'locked',
      content: {
        concept: 'Luas permukaan tabung adalah jumlah luas semua bidang yang membentuk tabung.',
        formula: {
          main: 'LP = 2πr² + 2πrt = 2πr(r + t)',
          components: {
            '2πr²': 'Luas kedua lingkaran (alas + tutup)',
            '2πrt': 'Luas selimut tabung',
            '2πr(r + t)': 'Bentuk faktorisasi'
          },
          derivation: 'LP = Luas Alas + Luas Tutup + Luas Selimut'
        },
        examples: [
          {
            title: 'Contoh 1: Toples Kue',
            given: { radius: 8, height: 15 },
            solution: {
              step1: 'LP = 2πr² + 2πrt',
              step2: 'LP = 2π(8)² + 2π(8)(15)',
              step3: 'LP = 2π(64) + 2π(120)',
              step4: 'LP = 128π + 240π',
              step5: 'LP = 368π ≈ 1.156,11 cm²'
            }
          }
        ],
        applications: [
          {
            category: 'Industri',
            items: [
              { name: 'Pengecatan Tangki', benefit: 'Menghitung kebutuhan cat' },
              { name: 'Pelapis Pipa', benefit: 'Estimasi material pelapis' }
            ]
          },
          {
            category: 'Konstruksi',
            items: [
              { name: 'Silo Beton', benefit: 'Perhitungan material finishing' },
              { name: 'Kolom Silinder', benefit: 'Estimasi bahan pelapis' }
            ]
          }
        ],
        realWorldProblem: {
          title: 'Proyek Tangki Air Komunitas',
          scenario: 'Sebuah desa membutuhkan tangki air berbentuk tabung dengan kapasitas 10.000 liter.',
          constraints: [
            'Kapasitas minimum 10.000 liter (10 m³)',
            'Tinggi maksimal 4 meter (keterbatasan crane)',
            'Budget pelapis Rp 50.000 per m²'
          ]
        }
      }
    }
  ]
};
