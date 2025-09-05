# ChatBot Matematika - BangunAR 

## Deskripsi
ChatBot Matematika adalah asisten pembelajaran interaktif yang membantu siswa memahami konsep bangun ruang lengkung (tabung, kerucut, dan bola). Chatbot ini menggunakan sistem rule-based yang fleksibel untuk memberikan respons yang relevan dan mendidik.

## Fitur Utama

### 🤖 Interaksi Natural
- Deteksi kata kunci yang fleksibel
- Respons kontekstual berdasarkan input pengguna
- Sistem penilaian kecocokan (similarity scoring)

### 📚 Materi Pembelajaran
- **Tabung**: Definisi, rumus volume, luas permukaan, contoh soal
- **Kerucut**: Konsep dasar, perhitungan volume dan luas permukaan
- **Bola**: Rumus-rumus dan aplikasi praktis
- **Aplikasi Nyata**: Contoh penggunaan dalam kehidupan sehari-hari

### 💡 Fitur Interaktif
- **Visualisasi**: Penjelasan bentuk bangun ruang dengan analogi
- **Rumus Lengkap**: Kartu referensi rumus matematika
- **Contoh Soal**: Latihan dengan berbagai tingkat kesulitan
- **Tips & Trik**: Cara menghindari kesalahan umum
- **Tantangan**: Soal-soal tingkat lanjut

### 🎯 Quick Actions
- Tombol aksi cepat untuk akses fitur populer
- Quick replies untuk pertanyaan umum
- Antarmuka yang user-friendly

## Struktur Data

### Topik Utama
```javascript
topics: {
  tabung: {
    keywords: ['tabung', 'silinder', 'cylinder'],
    subtopics: {
      definisi: { /* konten definisi */ },
      rumus: { /* rumus-rumus */ },
      volume: { /* perhitungan volume */ },
      // ...
    }
  }
  // kerucut, bola...
}
```

### Pattern Recognition
Chatbot menggunakan algoritma pencocokan yang dapat:
- Menormalkan teks input
- Menghitung similarity score
- Mengekstrak informasi (bentuk bangun, tingkat kesulitan)
- Memberikan respons yang paling relevan

## Contoh Penggunaan

### Pertanyaan Dasar
**Input**: "Apa itu tabung?"
**Output**: Penjelasan lengkap tentang tabung dengan karakteristik dan contoh

### Perhitungan
**Input**: "Rumus volume tabung"
**Output**: Rumus dengan penjelasan dan contoh soal

### Visualisasi
**Input**: "Visualisasi tabung"
**Output**: Deskripsi visual dengan analogi kaleng minuman

### Latihan Soal
**Input**: "Latihan mudah tabung"
**Output**: Soal latihan dengan tingkat kesulitan mudah dan solusi

## Implementasi

### Komponen Utama
1. **ChatBot.jsx**: Komponen UI utama
2. **chatbotData.js**: Data pool dan logika matching
3. **FormulaDisplay.jsx**: Rendering rumus matematika
4. **extendedChatbotDataSimple.js**: Data tambahan dan utilities

### Algoritma Matching
```javascript
findBestMatch(userInput) {
  // Normalisasi input
  // Hitung similarity dengan setiap pattern
  // Return best match dengan threshold
}
```

### Response Generation
- Greeting detection
- Topic dan subtopic matching
- Problem-solving patterns
- Advanced concepts
- Fallback responses

## Instalasi dan Penggunaan

### 1. Struktur File
```
src/components/chatbot/
├── ChatBot.jsx              # Komponen utama
├── chatbotData.js          # Data pool dan logic
├── FormulaDisplay.jsx      # Display rumus
└── extendedChatbotDataSimple.js  # Data tambahan
```

### 2. Integrasi ke Layout
```javascript
// src/app/layout.js
import ChatBot from "../components/chatbot/ChatBot";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
```

### 3. Styling
Chatbot menggunakan Tailwind CSS dengan:
- Floating button di kanan bawah
- Modal popup dengan backdrop blur
- Responsive design
- Gradient backgrounds
- Smooth animations

## Kustomisasi

### Menambah Topik Baru
```javascript
// Tambahkan di chatbotData.js
topics: {
  // existing topics...
  prisma: {
    keywords: ['prisma', 'prism'],
    subtopics: {
      // definisi, rumus, dll
    }
  }
}
```

### Menambah Pattern Baru
```javascript
problemSolving: {
  newPattern: {
    keywords: ['kata', 'kunci', 'baru'],
    responses: ['Respons untuk pattern baru']
  }
}
```

## Troubleshooting

### Common Issues
1. **Import Error**: Pastikan semua file ada dan path benar
2. **Pattern Tidak Terdeteksi**: Periksa threshold similarity (default: 0.2)
3. **Respons Tidak Sesuai**: Tambahkan kata kunci yang lebih spesifik

### Performance Tips
- Gunakan lazy loading untuk data besar
- Optimize similarity calculation
- Implement caching untuk respons umum

## Roadmap

### Phase 2 Enhancement
- [ ] Persistent chat history
- [ ] User progress tracking  
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Advanced math rendering (MathJax)
- [ ] Integration dengan AR features

### Phase 3 Advanced Features
- [ ] Machine learning integration
- [ ] Personalized learning paths
- [ ] Teacher dashboard
- [ ] Analytics dan reporting
- [ ] Mobile app version

## Contributing
Untuk menambahkan fitur baru atau memperbaiki bug:
1. Fork repository
2. Buat feature branch
3. Implementasikan perubahan
4. Test thoroughly
5. Submit pull request

## License
MIT License - lihat file LICENSE untuk detail lengkap.

---

**Dibuat oleh Tim LIDM untuk meningkatkan pembelajaran matematika interaktif** 🚀
