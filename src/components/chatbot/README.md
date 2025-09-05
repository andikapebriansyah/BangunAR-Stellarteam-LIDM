# 🤖 Math ChatBot - BangunAR

## Deskripsi
Chatbot interaktif untuk pembelajaran matematika bangun ruang lengkung (tabung, kerucut, bola) dengan sistem rule-based yang fleksibel.

## Fitur Utama

### 🎯 **Pembelajaran Interaktif**
- **Definisi & Konsep**: Penjelasan mendalam tentang bangun ruang
- **Rumus Lengkap**: Volume, luas permukaan, unsur-unsur
- **Visualisasi**: Deskripsi visual untuk membantu pemahaman
- **Aplikasi Nyata**: Contoh penggunaan dalam kehidupan sehari-hari

### 🧮 **Problem Solving**
- **Contoh Soal**: Step-by-step solution dengan penjelasan detail
- **Latihan Interaktif**: Generator soal dengan tingkat kesulitan (mudah, sedang, sulit)
- **Tips & Trik**: Kesalahan umum dan cara menghindarinya
- **Tantangan**: Soal-soal kompleks untuk siswa advanced

### 🎨 **User Interface**
- **Floating Button**: Tombol mengambang di kanan bawah
- **Popup Chat**: Dialog fullscreen yang responsif
- **Quick Actions**: Tombol cepat untuk akses fitur utama
- **Mathematical Formatting**: Render rumus matematika dengan baik

## Cara Menggunakan

### 1. **Membuka Chatbot**
Klik floating button 🤖 di kanan bawah halaman

### 2. **Contoh Pertanyaan**

#### **Konsep Dasar:**
- "Apa itu tabung?"
- "Unsur-unsur kerucut"
- "Definisi bola"

#### **Rumus & Perhitungan:**
- "Rumus volume tabung"
- "Cara menghitung luas permukaan bola"
- "Formula kerucut lengkap"

#### **Latihan Soal:**
- "Contoh soal volume tabung"
- "Latihan mudah kerucut"
- "Soal sulit bola"

#### **Visualisasi:**
- "Visualisasi tabung"
- "Gambaran kerucut"
- "Bayangkan bola"

#### **Tips & Bantuan:**
- "Tips menghitung volume"
- "Kesalahan yang sering terjadi"
- "Bantuan"

### 3. **Quick Actions**
Gunakan tombol cepat untuk akses langsung:
- 📐 **Rumus Lengkap**
- 🎯 **Latihan Soal** 
- 🎨 **Visualisasi**
- 💡 **Tips**
- 🌟 **Tantangan**
- 📊 **Perbandingan**

## Struktur Data

### **Materi yang Tersedia:**

#### **Tabung**
- Definisi dan karakteristik
- Volume: V = πr²t
- Luas Permukaan: L = 2πr(r + t)
- Aplikasi: tangki air, kaleng, pipa

#### **Kerucut** 
- Konsep dasar
- Volume: V = ⅓πr²t
- Luas Permukaan: L = πr(r + s)
- Aplikasi: topi, corong, cone es krim

#### **Bola**
- Definisi
- Volume: V = ⁴⁄₃πr³
- Luas Permukaan: L = 4πr²
- Aplikasi: sepak bola, planet, kelereng

### **Tingkat Kesulitan Soal:**
- **Easy**: r = 3-10 cm, t = 5-15 cm
- **Medium**: r = 5-20 cm, t = 10-30 cm  
- **Hard**: r = 7-25 cm, t = 15-50 cm

## Algoritma Chatbot

### **Pattern Matching:**
1. **Text Normalization**: Lowercase, remove punctuation
2. **Keyword Detection**: Fleksible matching dengan similarity score
3. **Context Analysis**: Deteksi topik dan subtopik
4. **Response Generation**: Dynamic response berdasarkan context

### **Response Types:**
- **Greeting**: Respon pembukaan
- **Topical**: Informasi spesifik tentang bangun ruang
- **Problem Solving**: Contoh soal dan solusi
- **Interactive**: Latihan dan tantangan
- **Fallback**: Respon default jika tidak match

### **Smart Features:**
- **Shape Detection**: Auto-detect tabung/kerucut/bola dari input
- **Difficulty Extraction**: Parse tingkat kesulitan (mudah/sedang/sulit)
- **Problem Type Recognition**: Volume vs Luas Permukaan
- **Real-world Context**: Deteksi aplikasi praktis

## File Structure

```
src/components/chatbot/
├── ChatBot.jsx                    # Main chatbot component
├── FormulaDisplay.jsx             # Mathematical formula renderer
├── chatbotData.js                 # Core chatbot logic & data
├── extendedChatbotDataSimple.js   # Extended data pool
└── README.md                      # Documentation
```

## Customization

### **Menambah Topik Baru:**
1. Update `chatbotData.topics` di `chatbotData.js`
2. Tambah keywords dan content
3. Update pattern matching jika perlu

### **Menambah Soal:**
1. Update `extendedChatbotData.sampleProblems`
2. Ikuti struktur: question, solution (given, formula, steps, answer)

### **Mengubah UI:**
1. Edit styling di `ChatBot.jsx`
2. Customize floating button position/style
3. Modify popup dimensions dan colors

## Troubleshooting

### **Error: Cannot access 'formatMessage' before initialization**
✅ Fixed: Function definition moved before usage in FormulaDisplay.jsx

### **Import Errors:**
- Pastikan semua import path benar
- Check file extensions (.js vs .jsx)

### **Styling Issues:**
- Pastikan Tailwind CSS properly configured
- Check responsive classes

## Future Enhancements

1. **Voice Input**: Speech-to-text integration
2. **Image Recognition**: Upload gambar soal
3. **Step-by-step Animation**: Visual problem solving
4. **Progress Tracking**: User learning analytics
5. **Multi-language**: Support bahasa lain
6. **AI Integration**: GPT untuk response yang lebih natural

## Kontributor
- **Stellar Team LIDM**
- **BangunAR Project**

---

💡 **Tips**: Chatbot ini dirancang fleksibel - tidak perlu mengetik pertanyaan persis. Sistem akan mencari pattern terbaik dan memberikan respon yang paling sesuai!
