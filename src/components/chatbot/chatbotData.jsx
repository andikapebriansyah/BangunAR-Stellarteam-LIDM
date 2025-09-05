// Chatbot Data Pool - Rule-based dengan fleksibilitas tinggi
export const chatbotData = {
  greetings: {
    patterns: ['halo', 'hai', 'hello', 'hi', 'selamat', 'assalamu', 'salam', 'permisi', 'hei', 'hey'],
    responses: [
      "Halo! Saya ChatBot Matematika. Saya siap membantu Anda belajar tentang bangun ruang! 😊",
      "Hai! Ada yang bisa saya bantu tentang matematika bangun ruang? 🔢",
      "Selamat datang! Saya di sini untuk membantu Anda memahami konsep-konsep bangun ruang. Silakan bertanya! 📚"
    ]
  },

  topics: {
    tabung: {
      keywords: ['tabung', 'silinder', 'cylinder', 'kaleng', 'drum', 'pipa', 'botol'],
      subtopics: {
        definisi: {
          keywords: ['definisi', 'pengertian', 'apa itu', 'arti', 'maksud', 'konsep', 'karakteristik'],
          content: {
            text: "Tabung (silinder) adalah bangun ruang tiga dimensi yang memiliki:\n\n• Dua bidang berbentuk lingkaran sebagai alas dan tutup\n• Bidang selimut berbentuk persegi panjang yang melengkung\n• Tinggi sebagai jarak antara alas dan tutup\n\nContoh dalam kehidupan: kaleng minuman, drum minyak, pipa air, toples kue."
          }
        },
        rumus: {
          keywords: ['rumus', 'formula', 'perhitungan', 'hitung', 'cara menghitung'],
          content: {
            text: "Rumus-rumus Tabung:\n\n📐 **Volume Tabung**\nV = π × r² × t\n\n📏 **Luas Permukaan**\nL = 2πr(r + t)\n\n🔄 **Luas Selimut**\nLs = 2πrt\n\n⭕ **Luas Alas/Tutup**\nLa = πr²\n\nKeterangan:\n• r = jari-jari\n• t = tinggi\n• π ≈ 3,14 atau 22/7"
          }
        },
        volume: {
          keywords: ['volume', 'isi', 'kapasitas', 'ruang', 'kubik'],
          content: {
            text: "**Volume Tabung = π × r² × t**\n\nContoh soal:\nSebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Berapa volumenya?\n\nPenyelesaian:\nV = π × r² × t\nV = 22/7 × 7² × 10\nV = 22/7 × 49 × 10\nV = 22 × 7 × 10\nV = 1.540 cm³"
          }
        }
      }
    },
    kerucut: {
      keywords: ['kerucut', 'cone', 'topi', 'corong', 'es krim'],
      subtopics: {
        definisi: {
          keywords: ['definisi', 'pengertian', 'apa itu', 'arti', 'maksud'],
          content: {
            text: "Kerucut adalah bangun ruang yang memiliki:\n\n• Satu alas berbentuk lingkaran\n• Satu titik puncak\n• Selimut berbentuk juring lingkaran\n\nContoh: topi ulang tahun, corong, es krim cone."
          }
        },
        rumus: {
          keywords: ['rumus', 'formula', 'perhitungan', 'hitung'],
          content: {
            text: "**Rumus-rumus Kerucut:**\n\n📐 **Volume**: V = ⅓πr²t\n📏 **Luas Permukaan**: L = πr(r + s)\n🔄 **Luas Selimut**: Ls = πrs\n📐 **Garis Pelukis**: s = √(r² + t²)\n\nKeterangan:\n• r = jari-jari alas\n• t = tinggi\n• s = garis pelukis"
          }
        }
      }
    },
    bola: {
      keywords: ['bola', 'sphere', 'bulat', 'sepak bola', 'kelereng'],
      subtopics: {
        definisi: {
          keywords: ['definisi', 'pengertian', 'apa itu'],
          content: {
            text: "Bola adalah bangun ruang yang semua titik pada permukaannya memiliki jarak yang sama terhadap titik pusat.\n\nContoh: sepak bola, bola basket, kelereng, planet."
          }
        },
        rumus: {
          keywords: ['rumus', 'formula', 'perhitungan'],
          content: {
            text: "**Rumus-rumus Bola:**\n\n📐 **Volume**: V = ⁴⁄₃πr³\n📏 **Luas Permukaan**: L = 4πr²\n\nKeterangan:\n• r = jari-jari bola\n• π ≈ 3,14"
          }
        }
      }
    }
  },

  fallback: {
    responses: [
      "Maaf, saya belum memahami pertanyaan Anda. Coba tanya tentang:\n• Tabung (rumus, volume, luas permukaan)\n• Kerucut (definisi, rumus, contoh soal)\n• Bola (volume, luas permukaan)\n\nAtau ketik 'bantuan' untuk melihat semua topik! 🤔"
    ]
  },

  help: {
    keywords: ['bantuan', 'help', 'panduan', 'menu', 'apa yang bisa', 'fitur'],
    content: {
      text: "**🤖 ChatBot Matematika - Menu Bantuan**\n\n**📚 Materi yang tersedia:**\n• Tabung (definisi, rumus, volume, luas permukaan)\n• Kerucut (konsep, perhitungan, contoh)\n• Bola (rumus, aplikasi)\n\n**💬 Cara bertanya:**\n• \"Apa itu tabung?\"\n• \"Rumus volume tabung\"\n• \"Contoh soal kerucut\"\n• \"Cara menghitung luas bola\"\n\n**✨ Tips:**\n• Gunakan kata kunci sederhana\n• Sebutkan nama bangun ruang\n• Tanya spesifik (volume/luas/rumus)"
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

    // Find best topic match
    let bestMatch = null;
    let bestScore = 0;

    Object.entries(chatbotData.topics).forEach(([topicKey, topic]) => {
      // Check topic keywords
      topic.keywords.forEach(keyword => {
        if (normalizedInput.includes(keyword)) {
          const score = 0.6; // Base score for topic match
          
          // Check subtopics for more specific match
          Object.entries(topic.subtopics).forEach(([subtopicKey, subtopic]) => {
            subtopic.keywords.forEach(subKeyword => {
              if (normalizedInput.includes(subKeyword)) {
                const subScore = score + 0.4; // Higher score for subtopic match
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

          // If no subtopic match, use topic match
          if (score > bestScore && !bestMatch) {
            bestScore = score;
            bestMatch = {
              type: 'topic',
              topic: topicKey
            };
          }
        }
      });
    });

    return {
      match: bestMatch,
      score: bestScore,
      type: bestMatch ? bestMatch.type : 'fallback',
      threshold: 0.3
    };
  },

  generateResponse: (matchResult) => {
    const { match, score, type, threshold } = matchResult;

    if (score < threshold || !match) {
      return chatbotData.fallback.responses[0];
    }

    switch (type) {
      case 'subtopic':
        return chatbotData.topics[match.topic].subtopics[match.subtopic].content.text;

      case 'topic':
        const topicData = chatbotData.topics[match.topic];
        const availableSubtopics = Object.keys(topicData.subtopics);
        return `Saya bisa membantu Anda dengan ${match.topic}! Pilih aspek yang ingin dipelajari:\n\n${availableSubtopics.map((sub, i) => `${i + 1}️⃣ ${chatbotData.topics[match.topic].subtopics[sub].keywords[0]}`).join('\n')}`;

      default:
        return chatbotData.fallback.responses[0];
    }
  }
};
