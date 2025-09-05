// Extended chatbot data dengan contoh soal dan materi lengkap
export const extendedChatbotData = {
  sampleProblems: {
    tabung: {
      volume: [
        {
          question: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 20 cm. Hitunglah volume tabung tersebut!",
          solution: {
            given: ["r = 7 cm", "t = 20 cm"],
            formula: "V = π × r² × t",
            steps: [
              "V = π × r² × t",
              "V = 22/7 × 7² × 20",
              "V = 22/7 × 49 × 20", 
              "V = 22 × 7 × 20",
              "V = 3.080 cm³"
            ],
            answer: "3.080 cm³"
          }
        }
      ]
    }
  },

  realWorldApplications: {
    tabung: [
      {
        context: "Tangki Air",
        problem: "Sebuah tangki air berbentuk tabung dengan diameter 140 cm dan tinggi 2 m. Berapa liter air yang dapat ditampung?",
        solution: "r = 70 cm, t = 200 cm\nV = π × 70² × 200 = 3.080.000 cm³ = 3.080 liter"
      }
    ]
  },

  advancedConcepts: {
    perbandingan: {
      keywords: ['perbandingan', 'compare', 'banding', 'lebih besar', 'lebih kecil'],
      content: {
        text: "**Perbandingan Bangun Ruang Lengkung:**\n\n📊 **Volume (untuk r dan t sama):**\n• Tabung: V = πr²t\n• Kerucut: V = ⅓πr²t (1/3 volume tabung)\n• Bola: V = ⁴⁄₃πr³"
      }
    }
  },

  challenges: {
    keywords: ['tantangan', 'challenge', 'sulit', 'advanced', 'komplek'],
    problems: [
      {
        level: 'Medium',
        question: "Sebuah es krim cone (kerucut) diisi penuh, lalu ditambah es krim berbentuk setengah bola di atasnya. Jika tinggi cone 12 cm dan jari-jari 4 cm, berapa total volume es krim?",
        hint: "Hitung volume kerucut + volume setengah bola",
        answer: "Volume total = ⅓π(4)²(12) + ½(⁴⁄₃π(4)³) = 201,06 + 134,04 = 335,1 cm³"
      }
    ]
  }
};

// Enhanced utilities untuk problem solving
export const problemSolvingUtils = {
  getRandomProblem: (topic, subtopic) => {
    const problems = extendedChatbotData.sampleProblems[topic]?.[subtopic];
    if (problems && problems.length > 0) {
      return problems[Math.floor(Math.random() * problems.length)];
    }
    return null;
  },

  formatSolution: (solution) => {
    let formatted = `**Diketahui:**\n${solution.given.join('\n')}\n\n`;
    formatted += `**Rumus:**\n${solution.formula}\n\n`;
    formatted += `**Langkah Penyelesaian:**\n${solution.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n`;
    formatted += `**Jawaban: ${solution.answer}**`;
    return formatted;
  },

  identifyProblemType: (input) => {
    const normalized = input.toLowerCase();
    
    if (normalized.includes('volume') || normalized.includes('isi')) {
      if (normalized.includes('tabung')) return { topic: 'tabung', type: 'volume' };
      if (normalized.includes('kerucut')) return { topic: 'kerucut', type: 'volume' };
      if (normalized.includes('bola')) return { topic: 'bola', type: 'volume' };
    }
    
    if (normalized.includes('luas') && (normalized.includes('permukaan') || normalized.includes('total'))) {
      if (normalized.includes('tabung')) return { topic: 'tabung', type: 'luasPermukaan' };
      if (normalized.includes('kerucut')) return { topic: 'kerucut', type: 'luasPermukaan' };
    }
    
    if (normalized.includes('kaleng') || normalized.includes('botol') || normalized.includes('tangki')) {
      return { topic: 'tabung', type: 'realWorld' };
    }
    
    return null;
  },

  generateProblemResponse: (problemType) => {
    if (!problemType) return null;
    
    const { topic, type } = problemType;
    
    if (type === 'realWorld') {
      const apps = extendedChatbotData.realWorldApplications[topic];
      if (apps && apps.length > 0) {
        const app = apps[Math.floor(Math.random() * apps.length)];
        return `**Aplikasi dalam Kehidupan: ${app.context}**\n\n${app.problem}\n\n**Penyelesaian:**\n${app.solution}`;
      }
    }
    
    if (type === 'volume' || type === 'luasPermukaan') {
      const problem = problemSolvingUtils.getRandomProblem(topic, type);
      if (problem) {
        return `**Contoh Soal ${topic.charAt(0).toUpperCase() + topic.slice(1)}:**\n\n${problem.question}\n\n${problemSolvingUtils.formatSolution(problem.solution)}`;
      }
    }
    
    return null;
  },

  generateInteractiveProblem: (shape, type, difficulty = 'easy') => {
    const ranges = {
      easy: { r: [3, 10], t: [5, 15] },
      medium: { r: [5, 20], t: [10, 30] },
      hard: { r: [7, 25], t: [15, 50] }
    };

    const range = ranges[difficulty];
    const r = Math.floor(Math.random() * (range.r[1] - range.r[0] + 1)) + range.r[0];
    const t = Math.floor(Math.random() * (range.t[1] - range.t[0] + 1)) + range.t[0];

    if (shape === 'tabung' && type === 'volume') {
      const volume = Math.PI * r * r * t;
      return `**🎯 Latihan ${shape.charAt(0).toUpperCase() + shape.slice(1)} (${difficulty.toUpperCase()}):**\n\nHitunglah volume tabung dengan jari-jari ${r} cm dan tinggi ${t} cm!\n\n**Jawaban:** ${volume.toFixed(2)} cm³`;
    }

    return `**🎯 Latihan Soal:**\n\nMaaf, soal untuk ${shape} ${type} belum tersedia. Coba pilih tabung volume!`;
  },

  getVisualHelp: (shape) => {
    const visualData = {
      tabung: "**🎨 Visualisasi Tabung:**\n\nBayangkan sebuah kaleng minuman:\n🔵 Alas (lingkaran di bawah)\n🔵 Tutup (lingkaran di atas)\n📜 Selimut (bagian samping melengkung)\n📏 Tinggi (jarak alas ke tutup)\n\n💡 **Ingat:** Tabung = 2 lingkaran + selimut melengkung",
      kerucut: "**🎨 Visualisasi Kerucut:**\n\nSeperti topi ulang tahun:\n🔵 Alas (lingkaran di bawah)\n📍 Puncak (titik di atas)\n📜 Selimut (bidang miring melengkung)\n📐 Tinggi (jarak alas ke puncak)",
      bola: "**🎨 Visualisasi Bola:**\n\nSeperti bola sepak:\n🌐 Permukaan melengkung sempurna\n📍 Titik pusat\n📏 Jari-jari ke segala arah sama"
    };

    return visualData[shape] || "Visualisasi tidak tersedia untuk bentuk ini.";
  },

  getFormulaReference: (shape) => {
    const formulas = {
      tabung: "**📋 Kartu Rumus Tabung:**\n\n📐 **Volume:** V = πr²t\n📏 **Luas Permukaan:** L = 2πr(r + t)\n🔄 **Luas Selimut:** Ls = 2πrt\n⭕ **Luas Alas:** La = πr²",
      kerucut: "**📋 Kartu Rumus Kerucut:**\n\n📐 **Volume:** V = ⅓πr²t\n📏 **Luas Permukaan:** L = πr(r + s)\n🔄 **Luas Selimut:** Ls = πrs\n📐 **Garis Pelukis:** s = √(r² + t²)",
      bola: "**📋 Kartu Rumus Bola:**\n\n📐 **Volume:** V = ⁴⁄₃πr³\n📏 **Luas Permukaan:** L = 4πr²"
    };

    return formulas[shape] || "Rumus tidak tersedia untuk bentuk ini.";
  },

  getTipsAndTricks: (shape) => {
    const tips = {
      general: "**⚠️ Kesalahan Yang Sering Terjadi:**\n\n**1. Lupa mengkuadratkan jari-jari (r²)**\n✅ Selalu ingat: jari-jari harus dikuadratkan dalam rumus volume\n📝 Contoh: r = 5, maka r² = 25 (bukan 5)\n\n**2. Salah menggunakan diameter sebagai jari-jari**\n✅ Jari-jari = ½ × diameter\n📝 Contoh: Diameter 10 cm → jari-jari 5 cm",
      tabung: "**⚠️ Tips Khusus Tabung:**\n\n**1. Volume = Luas Alas × Tinggi**\n✅ V = πr² × t\n\n**2. Luas Permukaan = 2 Lingkaran + Selimut**\n✅ L = 2πr² + 2πrt = 2πr(r + t)",
      kerucut: "**⚠️ Tips Khusus Kerucut:**\n\n**1. Jangan lupa 1/3 dalam rumus volume**\n✅ Volume kerucut = ⅓ × volume tabung\n\n**2. Garis pelukis ≠ tinggi**\n✅ s = √(r² + t²)"
    };

    return tips[shape] || tips.general;
  }
};
