// Interactive examples dan visualizations untuk chatbot
export const interactiveExamples = {
  // Step-by-step problem solver
  stepBySolver: {
    tabung: {
      volume: {
        template: "Sebuah tabung dengan jari-jari {r} cm dan tinggi {t} cm",
        solution: (r, t) => {
          const steps = [
            {
              step: 1,
              description: "Identifikasi rumus volume tabung",
              formula: "V = π × r² × t",
              note: "Dimana r = jari-jari, t = tinggi"
            },
            {
              step: 2,
              description: "Substitusi nilai yang diketahui",
              formula: `V = π × ${r}² × ${t}`,
              note: `r = ${r} cm, t = ${t} cm`
            },
            {
              step: 3,
              description: "Hitung r²",
              formula: `V = π × ${r * r} × ${t}`,
              calculation: `${r}² = ${r * r}`
            },
            {
              step: 4,
              description: "Kalikan dengan π dan t",
              formula: `V = ${Math.PI.toFixed(2)} × ${r * r} × ${t}`,
              calculation: `Gunakan π ≈ 3,14`
            },
            {
              step: 5,
              description: "Hasil akhir",
              formula: `V = ${(Math.PI * r * r * t).toFixed(2)} cm³`,
              answer: true
            }
          ];
          return steps;
        }
      }
    }
  },

  // Visual aids descriptions
  visualAids: {
    tabung: {
      description: "Bayangkan sebuah kaleng minuman:",
      parts: [
        "🔵 Alas (lingkaran di bawah)",
        "🔵 Tutup (lingkaran di atas)", 
        "📜 Selimut (bagian samping melengkung)",
        "📏 Tinggi (jarak alas ke tutup)"
      ],
      mnemonic: "Tabung = 2 lingkaran + selimut melengkung"
    },
    kerucut: {
      description: "Seperti topi ulang tahun atau cone es krim:",
      parts: [
        "🔵 Alas (lingkaran di bawah)",
        "📍 Puncak (titik di atas)",
        "📜 Selimut (bidang miring melengkung)",
        "📐 Tinggi (jarak alas ke puncak)"
      ],
      mnemonic: "Kerucut = 1 lingkaran + puncak + selimut"
    },
    bola: {
      description: "Seperti bola sepak atau kelereng:",
      parts: [
        "🌐 Permukaan melengkung sempurna",
        "📍 Titik pusat",
        "📏 Jari-jari ke segala arah sama"
      ],
      mnemonic: "Bola = semua titik berjarak sama dari pusat"
    }
  },

  // Common mistakes and tips
  commonMistakes: {
    general: [
      {
        mistake: "Lupa mengkuadratkan jari-jari (r²)",
        tip: "Selalu ingat: jari-jari harus dikuadratkan dalam rumus volume",
        example: "r = 5, maka r² = 25 (bukan 5)"
      },
      {
        mistake: "Salah menggunakan diameter sebagai jari-jari", 
        tip: "Jari-jari = ½ × diameter. Pastikan mengkonversi dulu!",
        example: "Diameter 10 cm → jari-jari 5 cm"
      },
      {
        mistake: "Lupa mengkonversi satuan",
        tip: "Pastikan semua satuan sama sebelum menghitung",
        example: "r = 5 cm, t = 2 m → ubah ke r = 5 cm, t = 200 cm"
      }
    ],
    tabung: [
      {
        mistake: "Menggunakan rumus luas lingkaran saja untuk volume",
        tip: "Volume tabung = luas alas × tinggi = πr² × t"
      }
    ],
    kerucut: [
      {
        mistake: "Lupa menggunakan 1/3 dalam rumus volume",
        tip: "Volume kerucut = ⅓ × volume tabung dengan alas dan tinggi sama"
      }
    ]
  },

  // Quick reference cards
  quickReference: {
    formulas: {
      tabung: {
        volume: "V = πr²t",
        luasPermukaan: "L = 2πr(r + t)",
        luasSelimut: "Ls = 2πrt",
        luasAlas: "La = πr²"
      },
      kerucut: {
        volume: "V = ⅓πr²t",
        luasPermukaan: "L = πr(r + s)",
        luasSelimut: "Ls = πrs",
        garisPelukis: "s = √(r² + t²)"
      },
      bola: {
        volume: "V = ⁴⁄₃πr³",
        luasPermukaan: "L = 4πr²"
      }
    },
    constants: {
      pi: {
        decimal: "π ≈ 3,14159...",
        fraction: "π ≈ 22/7",
        usage: "Gunakan 22/7 untuk perhitungan pecahan, 3,14 untuk desimal"
      }
    }
  },

  // Practice problems generator
  practiceGenerator: {
    generateProblem: (shape, type, difficulty = 'easy') => {
      const ranges = {
        easy: { r: [3, 10], t: [5, 15] },
        medium: { r: [5, 20], t: [10, 30] },
        hard: { r: [7, 25], t: [15, 50] }
      };

      const range = ranges[difficulty];
      const r = Math.floor(Math.random() * (range.r[1] - range.r[0] + 1)) + range.r[0];
      const t = Math.floor(Math.random() * (range.t[1] - range.t[0] + 1)) + range.t[0];

      const problems = {
        tabung: {
          volume: {
            question: `Hitunglah volume tabung dengan jari-jari ${r} cm dan tinggi ${t} cm!`,
            answer: Math.PI * r * r * t,
            unit: 'cm³',
            steps: interactiveExamples.stepBySolver.tabung.volume.solution(r, t)
          }
        },
        kerucut: {
          volume: {
            question: `Hitunglah volume kerucut dengan jari-jari alas ${r} cm dan tinggi ${t} cm!`,
            answer: (1/3) * Math.PI * r * r * t,
            unit: 'cm³'
          }
        },
        bola: {
          volume: {
            question: `Hitunglah volume bola dengan jari-jari ${r} cm!`,
            answer: (4/3) * Math.PI * r * r * r,
            unit: 'cm³'
          }
        }
      };

      return problems[shape]?.[type];
    }
  }
};

// Utility functions untuk interactive features
export const interactiveUtils = {
  // Format step-by-step solution
  formatStepBySolution: (steps) => {
    let formatted = "**📝 Langkah-langkah Penyelesaian:**\n\n";
    
    steps.forEach((step, index) => {
      formatted += `**${step.step}.** ${step.description}\n`;
      formatted += `${step.formula}\n`;
      if (step.calculation) {
        formatted += `💡 ${step.calculation}\n`;
      }
      if (step.note) {
        formatted += `ℹ️ ${step.note}\n`;
      }
      if (step.answer) {
        formatted += `✅ **Jawaban Final**\n`;
      }
      formatted += "\n";
    });

    return formatted;
  },

  // Generate visual description
  getVisualDescription: (shape) => {
    const visual = interactiveExamples.visualAids[shape];
    if (!visual) return "";

    let description = `**🎨 Visualisasi ${shape.charAt(0).toUpperCase() + shape.slice(1)}:**\n\n`;
    description += `${visual.description}\n\n`;
    description += `**Bagian-bagian:**\n`;
    visual.parts.forEach(part => {
      description += `${part}\n`;
    });
    description += `\n💡 **Ingat:** ${visual.mnemonic}`;

    return description;
  },

  // Get common mistakes
  getCommonMistakes: (shape = 'general') => {
    const mistakes = interactiveExamples.commonMistakes[shape] || interactiveExamples.commonMistakes.general;
    
    let formatted = "**⚠️ Kesalahan Yang Sering Terjadi:**\n\n";
    mistakes.forEach((item, index) => {
      formatted += `**${index + 1}. ${item.mistake}**\n`;
      formatted += `✅ ${item.tip}\n`;
      if (item.example) {
        formatted += `📝 Contoh: ${item.example}\n`;
      }
      formatted += "\n";
    });

    return formatted;
  },

  // Quick formula reference
  getFormulaCard: (shape) => {
    const formulas = interactiveExamples.quickReference.formulas[shape];
    if (!formulas) return "";

    let card = `**📋 Kartu Rumus ${shape.charAt(0).toUpperCase() + shape.slice(1)}:**\n\n`;
    Object.entries(formulas).forEach(([key, formula]) => {
      const displayName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      card += `📐 **${displayName.charAt(0).toUpperCase() + displayName.slice(1)}:** ${formula}\n`;
    });

    return card;
  }
};
