// Chatbot Data Pool - Hybrid: Rule-based untuk utility, RAG untuk materi
export const chatbotData = {
  greetings: {
    patterns: ['halo', 'hai', 'hello', 'hi', 'selamat', 'assalamu', 'salam', 'permisi', 'hei', 'hey'],
    responses: [
      "Halo! Saya ChatBot Matematika. Saya siap membantu Anda belajar tentang bangun ruang! 😊",
      "Hai! Ada yang bisa saya bantu tentang matematika bangun ruang? 🔢",
      "Selamat datang! Saya di sini untuk membantu Anda memahami konsep-konsep bangun ruang. Silakan bertanya! 📚"
    ]
  },

  help: {
    keywords: ['bantuan', 'help', 'panduan', 'menu', 'apa yang bisa', 'fitur'],
    content: {
      text: "**🤖 ChatBot Matematika - Menu Bantuan**\n\n**📚 Yang bisa saya bantu:**\n• Penjelasan materi (definisi, rumus, konsep)\n• Contoh soal & penyelesaian\n• Cara menghitung (volume, luas permukaan)\n• Visualisasi bangun ruang\n• Tips & trik mengerjakan soal\n• Tantangan soal (mudah - sulit)\n• Perbandingan antar bangun ruang\n\n**💬 Contoh pertanyaan:**\n• \"Apa itu tabung?\"\n• \"Cara menghitung volume kerucut\"\n• \"Visualisasi bola\"\n• \"Tips menghitung luas permukaan\"\n• \"Tantangan soal tabung\"\n• \"Perbandingan volume tabung dan kerucut\"\n\n**🎯 Bangun ruang yang saya kuasai:**\n• Tabung/Silinder\n• Kerucut\n• Bola/Sphere"
    }
  },

  // Utility features (rule-based for instant response)
  utilities: {
    visualisasi: {
      keywords: ['visualisasi', 'visual', 'gambar', 'bentuk', 'lihat', 'tampilan'],
      shapes: {
        tabung: "**🎨 Visualisasi Tabung:**\n\nBayangkan sebuah kaleng minuman:\n🔵 **Alas** (lingkaran di bawah)\n🔵 **Tutup** (lingkaran di atas)\n📜 **Selimut** (bagian samping melengkung)\n📏 **Tinggi** (jarak alas ke tutup)\n\n💡 **Ingat:** Tabung = 2 lingkaran + selimut melengkung\n\n📍 **Contoh dalam kehidupan:**\n• Kaleng minuman\n• Drum minyak\n• Pipa air\n• Toples kue",
        kerucut: "**🎨 Visualisasi Kerucut:**\n\nSeperti topi ulang tahun:\n🔵 **Alas** (lingkaran di bawah)\n📍 **Puncak** (titik di atas)\n📜 **Selimut** (bidang miring melengkung)\n📏 **Tinggi** (jarak alas ke puncak)\n📐 **Garis Pelukis** (jarak puncak ke tepi alas)\n\n💡 **Ingat:** Kerucut = 1 lingkaran + 1 puncak\n\n📍 **Contoh dalam kehidupan:**\n• Topi ulang tahun\n• Cone es krim\n• Corong\n• Topi petani",
        bola: "**🎨 Visualisasi Bola:**\n\nSeperti bola sepak:\n🌐 **Permukaan melengkung sempurna**\n📍 **Titik pusat**\n📏 **Jari-jari** (jarak pusat ke permukaan)\n📐 **Diameter** (2 × jari-jari)\n\n💡 **Ingat:** Semua titik di permukaan berjarak sama dari pusat\n\n📍 **Contoh dalam kehidupan:**\n• Bola sepak\n• Bola basket\n• Kelereng\n• Planet Bumi"
      }
    },
    
    tips: {
      keywords: ['tips', 'trik', 'cara mudah', 'rahasia', 'trick', 'saran'],
      content: {
        text: "**💡 Tips & Trik Bangun Ruang:**\n\n**⚠️ Kesalahan Yang Sering Terjadi:**\n\n**1. Lupa mengkuadratkan jari-jari (r²)**\n✅ Selalu ingat: jari-jari harus dikuadratkan!\n📝 Contoh: r = 5, maka r² = 25 (bukan 5)\n\n**2. Salah membedakan diameter dan jari-jari**\n✅ Jari-jari = ½ × diameter\n📝 Contoh: Diameter 10 cm → jari-jari 5 cm\n\n**3. Lupa koefisien 1/3 pada kerucut**\n✅ Volume kerucut = ⅓ × volume tabung\n\n**4. Salah memilih nilai π**\n✅ Gunakan 22/7 jika jari-jari kelipatan 7\n✅ Gunakan 3,14 untuk jari-jari lainnya\n\n**🎯 Cara Cepat Mengingat Rumus:**\n• **Tabung:** Seperti menumpuk lingkaran → V = πr²t\n• **Kerucut:** 1/3 dari tabung → V = ⅓πr²t\n• **Bola:** Ingat \"4/3 pi r tiga\" → V = ⁴⁄₃πr³\n\n**📌 Strategi Mengerjakan Soal:**\n1. Tulis yang diketahui\n2. Tulis yang ditanya\n3. Pilih rumus yang tepat\n4. Substitusi nilai\n5. Hitung step-by-step"
      }
    },

    perbandingan: {
      keywords: ['perbandingan', 'compare', 'banding', 'perbedaan', 'lebih besar', 'lebih kecil', 'vs'],
      content: {
        text: "**📊 Perbandingan Bangun Ruang Lengkung:**\n\n**🎯 VOLUME (untuk r dan t yang sama):**\n\n• **Tabung:** V = πr²t\n• **Kerucut:** V = ⅓πr²t (= ⅓ volume tabung)\n• **Bola:** V = ⁴⁄₃πr³\n\n💡 **Fakta Menarik:**\nJika tinggi tabung = diameter bola (t = 2r):\n• Volume Bola = ⅔ Volume Tabung\n\n**📏 LUAS PERMUKAAN:**\n\n• **Tabung:** L = 2πr(r + t)\n• **Kerucut:** L = πr(r + s), s = √(r² + t²)\n• **Bola:** L = 4πr²\n\n**🔍 KARAKTERISTIK:**\n\n| Aspek | Tabung | Kerucut | Bola |\n|-------|--------|---------|------|\n| Alas | 2 lingkaran | 1 lingkaran | Tidak ada |\n| Puncak | Tidak ada | 1 titik | Tidak ada |\n| Rusuk | 2 lengkung | 1 lengkung | Tidak ada |\n| Simetri | Tinggi | Sedang | Sempurna |\n\n**💼 Aplikasi:**\n• **Tabung:** Kaleng, drum, pipa\n• **Kerucut:** Topi, corong, cone\n• **Bola:** Kelereng, planet, balon"
      }
    },

    tantangan: {
      keywords: ['tantangan', 'challenge', 'soal sulit', 'latihan', 'quiz', 'test', 'soal'],
      levels: {
        mudah: {
          keywords: ['mudah', 'easy', 'gampang', 'pemula'],
          problems: [
            {
              question: "**🎯 Tantangan Level MUDAH - Tabung**\n\nSebuah kaleng susu berbentuk tabung dengan jari-jari 7 cm dan tinggi 10 cm.\n\n**Pertanyaan:** Berapa volume kaleng tersebut?\n\n💡 **Hint:** Gunakan rumus V = πr²t dengan π = 22/7",
              answer: "**Jawaban:** 1.540 cm³\n\n**Penyelesaian:**\nV = π × r² × t\nV = 22/7 × 7² × 10\nV = 22/7 × 49 × 10\nV = 22 × 7 × 10\nV = 1.540 cm³"
            },
            {
              question: "**🎯 Tantangan Level MUDAH - Kerucut**\n\nSebuah cone es krim dengan jari-jari 3 cm dan tinggi 12 cm.\n\n**Pertanyaan:** Berapa volume es krim yang dapat ditampung?\n\n💡 **Hint:** Jangan lupa koefisien 1/3!",
              answer: "**Jawaban:** 113,04 cm³\n\n**Penyelesaian:**\nV = ⅓ × π × r² × t\nV = ⅓ × 3,14 × 3² × 12\nV = ⅓ × 3,14 × 9 × 12\nV = ⅓ × 339,12\nV = 113,04 cm³"
            }
          ]
        },
        sedang: {
          keywords: ['sedang', 'medium', 'menengah', 'standard'],
          problems: [
            {
              question: "**🎯 Tantangan Level SEDANG - Tabung**\n\nSebuah tangki air berbentuk tabung dengan diameter 140 cm dan tinggi 2 meter.\n\n**Pertanyaan:** Berapa liter air yang dapat ditampung?\n\n💡 **Hint:** Diameter ≠ jari-jari! Konversi m → cm!",
              answer: "**Jawaban:** 3.080 liter\n\n**Penyelesaian:**\nDiameter = 140 cm → r = 70 cm\nTinggi = 2 m = 200 cm\n\nV = π × r² × t\nV = 22/7 × 70² × 200\nV = 22/7 × 4.900 × 200\nV = 3.080.000 cm³\nV = 3.080 liter (1 liter = 1.000 cm³)"
            }
          ]
        },
        sulit: {
          keywords: ['sulit', 'hard', 'susah', 'advanced', 'expert'],
          problems: [
            {
              question: "**🎯 Tantangan Level SULIT - Kombinasi**\n\nSebuah es krim terdiri dari cone (kerucut) yang diisi penuh, ditambah scoop berbentuk setengah bola di atasnya.\n\nData:\n• Tinggi cone: 12 cm\n• Jari-jari cone & bola: 4 cm\n\n**Pertanyaan:** Berapa total volume es krim?\n\n💡 **Hint:** Volume total = Volume kerucut + Volume setengah bola",
              answer: "**Jawaban:** ±335,1 cm³\n\n**Penyelesaian:**\n\n**1. Volume Kerucut:**\nV₁ = ⅓πr²t\nV₁ = ⅓ × 3,14 × 4² × 12\nV₁ = ⅓ × 3,14 × 16 × 12\nV₁ = 201,06 cm³\n\n**2. Volume Setengah Bola:**\nV₂ = ½ × ⁴⁄₃πr³\nV₂ = ⅔ × 3,14 × 4³\nV₂ = ⅔ × 3,14 × 64\nV₂ = 134,04 cm³\n\n**Total:**\nV = V₁ + V₂ = 201,06 + 134,04 = **335,1 cm³**"
            }
          ]
        }
      }
    }
  }
};

export const chatbotUtils = {
  normalizeText: (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  findBestMatch: (userInput) => {
    const normalizedInput = chatbotUtils.normalizeText(userInput);
    
    // 1. Check GREETING
    const greetingWords = ['halo', 'hai', 'hello', 'hi', 'selamat', 'assalamu', 'salam', 'permisi', 'hei', 'hey'];
    const isGreeting = greetingWords.some(greeting => {
      const words = normalizedInput.split(' ');
      return words.length <= 3 && words.includes(greeting);
    });
    
    if (isGreeting) {
      return {
        type: 'greeting',
        content: chatbotData.greetings.responses[Math.floor(Math.random() * chatbotData.greetings.responses.length)],
        score: 1.0
      };
    }

    // 2. Check HELP
    const helpKeywords = chatbotData.help.keywords;
    const isHelpRequest = helpKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isHelpRequest) {
      return {
        type: 'help',
        content: chatbotData.help.content.text,
        score: 1.0
      };
    }

    // 3. Check VISUALISASI
    const visualKeywords = chatbotData.utilities.visualisasi.keywords;
    const isVisual = visualKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isVisual) {
      // Detect shape
      let shape = null;
      if (normalizedInput.includes('tabung') || normalizedInput.includes('silinder')) shape = 'tabung';
      else if (normalizedInput.includes('kerucut') || normalizedInput.includes('cone')) shape = 'kerucut';
      else if (normalizedInput.includes('bola') || normalizedInput.includes('sphere')) shape = 'bola';
      
      if (shape) {
        return {
          type: 'visualisasi',
          content: chatbotData.utilities.visualisasi.shapes[shape],
          score: 1.0
        };
      }
      
      // No shape specified, show all
      return {
        type: 'visualisasi',
        content: "**🎨 Visualisasi Bangun Ruang**\n\nPilih bangun ruang yang ingin dilihat:\n• Visualisasi tabung\n• Visualisasi kerucut\n• Visualisasi bola",
        score: 1.0
      };
    }

    // 4. Check TIPS
    const tipsKeywords = chatbotData.utilities.tips.keywords;
    const isTips = tipsKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isTips) {
      return {
        type: 'tips',
        content: chatbotData.utilities.tips.content.text,
        score: 1.0
      };
    }

    // 5. Check PERBANDINGAN
    const compareKeywords = chatbotData.utilities.perbandingan.keywords;
    const isCompare = compareKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isCompare) {
      return {
        type: 'perbandingan',
        content: chatbotData.utilities.perbandingan.content.text,
        score: 1.0
      };
    }

    // 6. Check TANTANGAN
    const challengeKeywords = chatbotData.utilities.tantangan.keywords;
    const isChallenge = challengeKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isChallenge) {
      // Detect level
      let level = 'mudah'; // default
      
      const levelKeywords = chatbotData.utilities.tantangan.levels;
      if (levelKeywords.sulit.keywords.some(kw => normalizedInput.includes(kw))) {
        level = 'sulit';
      } else if (levelKeywords.sedang.keywords.some(kw => normalizedInput.includes(kw))) {
        level = 'sedang';
      }
      
      const problems = chatbotData.utilities.tantangan.levels[level].problems;
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      
      return {
        type: 'tantangan',
        content: randomProblem.question + "\n\n" + randomProblem.answer,
        score: 1.0
      };
    }

    // 7. NO MATCH - Use RAG
    return {
      type: 'fallback',
      score: 0
    };
  },

  generateResponse: (matchResult) => {
    const { type, content, score } = matchResult;

    // If rule-based matched, return content
    if (score >= 1.0 && content) {
      return content;
    }

    // Otherwise, trigger RAG
    return null;
  },

  // RAG with Gemini API
  callGeminiRAG: async (userQuestion) => {
    try {
      // Import Gemini SDK dynamically
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        throw new Error('Gemini API key not configured');
      }

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Latest free tier model
      });

      // Load knowledge base
      const response = await fetch('/data/bangun_ruang.json');
      const knowledgeBase = await response.json();

      // Create context-aware prompt
      const systemPrompt = `Kamu adalah asisten matematika yang membantu siswa belajar bangun ruang (tabung, kerucut, bola).

ATURAN PENTING:
1. Jawab HANYA berdasarkan data knowledge base di bawah
2. Jika pertanyaan tidak ada di knowledge base, katakan: "Maaf, pertanyaan tersebut belum ada dalam materi saya. Coba tanya tentang tabung, kerucut, atau bola!" KECUALI jika pertanyaan masih berkaitan dengan materi tabung, kerucut, atau bola dan bangun ruang secara umum, jawab singkat sesuai yang anda bisa. Namun, tetap pastikan jawaban yang akademis dan sebisa mungkin mengikuti knowledge base
3. Gunakan bahasa yang ramah dan mudah dipahami siswa
4. Maksimal 250 kata
5. Gunakan emoji yang sesuai untuk mempercantik jawaban (tapi jangan berlebihan, 1-2 emoji saja)

FORMAT JAWABAN WAJIB:
- JANGAN gunakan format LaTeX ($...$, $$...$$, \\(...\\), \\[...\\])
- JANGAN gunakan markdown untuk math (contoh: JANGAN tulis $\\pi$, $r^2$)
- Gunakan simbol Unicode langsung: π (bukan $\\pi$), × (bukan *), ² (bukan ^2), ³ (bukan ^3)
- Untuk rumus, tulis dalam format plain text yang jelas
- Contoh BENAR: "V = π × r² × t"
- Contoh SALAH: "V = $\\pi \\times r^2 \\times t$"

FORMAT TEXT STYLING:
- Gunakan **bold** HANYA untuk judul utama dan rumus penting (maksimal 2-3 kali per jawaban)
- JANGAN bold semua istilah teknis atau angka
- Gunakan bullet points (•) untuk list
- HINDARI penggunaan bold berlebihan

CONTOH FORMAT JAWABAN YANG BENAR:

Wah, pertanyaan bagus! 😊

Volume setengah tabung adalah setengah dari volume tabung utuh. Jadi rumusnya:

**V = 1/2 × π × r² × t**

Keterangan:
• V = volume setengah tabung
• π = 3,14 atau 22/7
• r = jari-jari alas
• t = tinggi tabung

Contoh:
Jika r = 7 cm dan t = 10 cm:
V = 1/2 × 22/7 × 7² × 10
V = 1/2 × 1.540
V = 770 cm³

Semoga membantu! 💪

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

PERTANYAAN SISWA: ${userQuestion}

JAWABAN (ramah, jelas, tanpa LaTeX, bold minimal):`;

      // Call Gemini with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Response timeout')), 10000)
      );

      const geminiPromise = model.generateContent(systemPrompt);
      
      const result = await Promise.race([geminiPromise, timeoutPromise]);
      const text = result.response.text();

      return {
        success: true,
        response: text
      };

    } catch (error) {
      console.error('Gemini RAG Error:', error);
      
      if (error.message === 'Response timeout') {
        return {
          success: false,
          response: "Maaf, respons terlalu lama. Coba pertanyaan yang lebih sederhana! 😅"
        };
      }
      
      if (error.message.includes('API key')) {
        return {
          success: false,
          response: "Maaf, sistem AI sedang tidak tersedia. Silakan coba pertanyaan dari menu bantuan! 🔧"
        };
      }

      return {
        success: false,
        response: "Maaf, ada masalah teknis. Coba tanya:\n• Rumus volume tabung\n• Definisi kerucut\n• Luas permukaan bola\n\nAtau ketik 'bantuan' untuk menu lengkap! 💡"
      };
    }
  }
};
