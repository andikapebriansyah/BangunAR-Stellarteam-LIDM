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
        tabung: "**🎨 Visualisasi Tabung:**\n\nBayangkan sebuah kaleng minuman:\n� **Alas** (lingkaran di bawah)\n🔵 **Tutup** (lingkaran di atas)\n� **Selimut** (bagian samping melengkung)\n📏 **Tinggi** (jarak alas ke tutup)\n\n💡 **Ingat:** Tabung = 2 lingkaran + selimut melengkung\n\n📍 **Contoh dalam kehidupan:**\n• Kaleng minuman\n• Drum minyak\n• Pipa air\n• Toples kue",
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
        text: "**📊 Perbandingan Bangun Ruang Lengkung:**\n\n**🎯 VOLUME (untuk r dan t yang sama):**\n\n• **Tabung:** V = πr²t\n• **Kerucut:** V = ⅓πr²t (= ⅓ volume tabung)\n• **Bola:** V = ⁴⁄₃πr³\n\n� **Fakta Menarik:**\nJika tinggi tabung = diameter bola (t = 2r):\n• Volume Bola = ⅔ Volume Tabung\n\n**📏 LUAS PERMUKAAN:**\n\n• **Tabung:** L = 2πr(r + t)\n• **Kerucut:** L = πr(r + s), s = √(r² + t²)\n• **Bola:** L = 4πr²\n\n**🔍 KARAKTERISTIK:**\n\n| Aspek | Tabung | Kerucut | Bola |\n|-------|--------|---------|------|\n| Alas | 2 lingkaran | 1 lingkaran | Tidak ada |\n| Puncak | Tidak ada | 1 titik | Tidak ada |\n| Rusuk | 2 lengkung | 1 lengkung | Tidak ada |\n| Simetri | Tinggi | Sedang | Sempurna |\n\n**💼 Aplikasi:**\n• **Tabung:** Kaleng, drum, pipa\n• **Kerucut:** Topi, corong, cone\n• **Bola:** Kelereng, planet, balon"
      }
    },

    tantangan: {
      keywords: ['tantangan', 'challenge', 'soal sulit', 'latihan', 'quiz', 'test'],
      levels: {
        mudah: {
          keywords: ['mudah', 'easy', 'gampang', 'pemula'],
          problems: [
            {
              question: "**🎯 Tantangan Level MUDAH - Tabung**\n\nSebuah kaleng susu berbentuk tabung dengan jari-jari 7 cm dan tinggi 10 cm.\n\n**Pertanyaan:** Berapa volume kaleng tersebut?\n\n💡 **Hint:** Gunakan rumus V = πr²t dengan π = 22/7",
              answer: "**Jawaban:** 1.540 cm³\n\n**Penyelesaian:**\nV = π × r² × t\nV = 22/7 × 7² × 10\nV = 22/7 × 49 × 10\nV = 22 × 7 × 10\nV = 1.540 cm³"
            },
            {
              question: "**🎯 Tantangan Level MUDAH - Kerucut**\n\nSebuah cone es krim dengan jari-jari 3 cm dan tinggi 12 cm.\n\n**Pertanyaan:** Berapa volume es krim yang dapat ditampung?\n\n� **Hint:** Jangan lupa koefisien 1/3!",
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

  calculateSimilarity: (text1, text2) => {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    let matches = 0;
    
    words1.forEach(word1 => {
      if (words2.some(word2 => 
        word2.includes(word1) || word1.includes(word2)
      )) {
        matches++;
      }
    });
    
    return matches / Math.max(words1.length, words2.length);
  },

  findBestMatch: (userInput) => {
    const normalizedInput = chatbotUtils.normalizeText(userInput);
    
    // Check if it's a greeting (simple check)
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

    // Check help
    const helpKeywords = ['bantuan', 'help', 'panduan', 'menu'];
    const isHelpRequest = helpKeywords.some(keyword => normalizedInput.includes(keyword));
    
    if (isHelpRequest) {
      return {
        type: 'help',
        content: chatbotData.help.content.text,
        score: 1.0
      };
    }

    // Find best topic match - ONLY if subtopic is explicitly matched
    let bestMatch = null;
    let bestScore = 0;

    Object.entries(chatbotData.topics).forEach(([topicKey, topic]) => {
      // Check topic keywords
      const hasTopicKeyword = topic.keywords.some(keyword => normalizedInput.includes(keyword));
      
      if (hasTopicKeyword) {
        // Check subtopics for SPECIFIC match
        Object.entries(topic.subtopics).forEach(([subtopicKey, subtopic]) => {
          subtopic.keywords.forEach(subKeyword => {
            if (normalizedInput.includes(subKeyword)) {
              const subScore = 1.0; // High score for exact subtopic match
              if (subScore > bestScore) {
                bestScore = subScore;
                bestMatch = {
                  type: 'subtopic',
                  topic: topicKey,
                  subtopic: subtopicKey
                };
              }
            }
          });
        });
        
        // REMOVED: Generic topic match - let RAG handle it instead
        // This prevents "pilih aspek yang ingin dipelajari" response
      }
    });

    return {
      match: bestMatch,
      score: bestScore,
      type: bestMatch ? bestMatch.type : 'fallback',
      threshold: 0.8 // Higher threshold - only exact matches
    };
  },

  generateResponse: (matchResult) => {
    const { match, score, type, threshold } = matchResult;

    // Only return rule-based if we have a STRONG match
    if (score < threshold || !match) {
      return null; // Return null to trigger RAG
    }

    // ONLY handle subtopic matches (exact keyword match)
    if (type === 'subtopic') {
      return chatbotData.topics[match.topic].subtopics[match.subtopic].content.text;
    }

    // For anything else, use RAG
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
        model: "gemini-2.5-flash", // Free tier model
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });

      // Load knowledge base
      const response = await fetch('/data/bangun_ruang.json');
      const knowledgeBase = await response.json();

      // Create context-aware prompt
      const systemPrompt = `Kamu adalah asisten matematika yang membantu siswa belajar bangun ruang (tabung, kerucut, bola).

ATURAN PENTING:
1. Jawab HANYA berdasarkan data knowledge base di bawah
2. Jika pertanyaan tidak ada di knowledge base, katakan: "Maaf, pertanyaan tersebut belum ada dalam materi saya. Coba tanya tentang tabung, kerucut, atau bola!" exception, jika pertanyaan masih berkaitan dengan materitabung, kerucut, atau bola dan bangun ruang secara umum, jawab singkat seuai yang anda bisa. Namun, tetap pastikan jawwaban yang akademis dan sebisa mungkin mengukuti knowledgebase
3. Gunakan bahasa yang ramah dan mudah dipahami siswa
4. Sertakan rumus dalam format yang jelas
5. Berikan contoh jika relevan
6. Maksimal 300 kata

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

PERTANYAAN SISWA: ${userQuestion}

JAWABAN (ramah & jelas):`;

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
