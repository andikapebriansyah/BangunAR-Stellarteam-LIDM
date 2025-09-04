'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PengantarBangunRuang() {
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState({});
  
  // Simple question state - just for shape identifier
  const [shapeQuestions, setShapeQuestions] = useState({});
  const [shapeAnswers, setShapeAnswers] = useState({});

  // Simple questions - no complex state management
  const simpleQuestions = [
    {
      question: "Bangun datar mana yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku?",
      correctAnswer: "Persegi",
      explanation: "Persegi memiliki 4 sisi yang sama panjang dan 4 sudut siku-siku (90°)"
    },
    {
      question: "Bangun datar mana yang semua titiknya berjarak sama dari pusat?",
      correctAnswer: "Lingkaran", 
      explanation: "Lingkaran adalah himpunan titik yang berjarak sama (jari-jari) dari titik pusat"
    },
    {
      question: "Bangun datar mana yang memiliki 3 sisi dan jumlah sudutnya 180°?",
      correctAnswer: "Segitiga",
      explanation: "Segitiga memiliki 3 sisi dan jumlah ketiga sudutnya selalu 180°"
    },
    {
      question: "Bangun datar mana yang memiliki sisi berhadapan sama panjang?",
      correctAnswer: "Persegi Panjang",
      explanation: "Persegi panjang memiliki 2 pasang sisi berhadapan yang sama panjang"
    }
  ];

  useEffect(() => {
    // Simulate localStorage without actually using it
    const completed = new Set(['bangun-datar']); // Demo: first topic completed
    setCompletedTopics(completed);
  }, []);

  // Simple functions for shape identifier
  const getRandomQuestionIndex = () => {
    return Math.floor(Math.random() * simpleQuestions.length);
  };

  const handleSimpleShapeAnswer = (sectionId, selectedShape) => {
    // Get current question or create new one
    let currentQuestionIndex = shapeQuestions[sectionId];
    if (currentQuestionIndex === undefined) {
      currentQuestionIndex = getRandomQuestionIndex();
      setShapeQuestions({...shapeQuestions, [sectionId]: currentQuestionIndex});
    }
    
    const question = simpleQuestions[currentQuestionIndex];
    const isCorrect = selectedShape.name === question.correctAnswer;
    
    setShapeAnswers({
      ...shapeAnswers,
      [sectionId]: {
        answered: true,
        correct: isCorrect,
        selectedAnswer: selectedShape.name,
        questionIndex: currentQuestionIndex
      }
    });
  };

  const resetSimpleQuestion = (sectionId) => {
    const newIndex = getRandomQuestionIndex();
    setShapeQuestions({...shapeQuestions, [sectionId]: newIndex});
    setShapeAnswers({...shapeAnswers, [sectionId]: {answered: false}});
  };

  const materiData = {
    title: 'Pengantar Bangun Ruang',
    subtitle: 'Eksplorasi Interaktif Geometri 2D & 3D',
    description: 'Pelajari konsep dasar bangun datar dan ruang melalui visualisasi interaktif, studi kasus nyata, dan kuis menarik.',
    color: 'from-purple-500 to-indigo-600',
    icon: '🎯',
    sections: [
      {
        id: 'bangun-datar',
        title: 'Mengenal Bangun Datar',
        type: 'interactive',
        duration: 15,
        status: 'available',
        content: {
          definition: 'Bangun datar adalah bentuk geometri dua dimensi yang memiliki panjang dan lebar, tetapi tidak memiliki tinggi atau kedalaman.',
          characteristics: [
            'Memiliki 2 dimensi: panjang dan lebar',
            'Terletak pada bidang datar',
            'Memiliki keliling dan luas',
            'Tidak memiliki volume'
          ],
          examples: [
            { name: 'Persegi', image: '/materi/bangun_datar/persegi.jpg', properties: '4 sisi sama panjang, 4 sudut siku-siku' },
            { name: 'Lingkaran', image: '/materi/bangun_datar/lingkaran.png', properties: 'Semua titik berjarak sama dari pusat' },
            { name: 'Segitiga', image: '/materi/bangun_datar/segitiga.png', properties: '3 sisi, jumlah sudut 180°' },
            { name: 'Persegi Panjang', image: '/materi/bangun_datar/persegi_panjang.jpg', properties: 'Sisi berhadapan sama panjang' }
          ],
          interactive: {
            type: 'shape_identifier',
            instruction: 'Klik pada bangun datar yang sesuai dengan deskripsi!'
          },
          studyCase: {
            title: 'Studi Kasus: Desain Taman Kota',
            scenario: 'Kamu diminta mendesain taman kota dengan berbagai area. Setiap area memiliki bentuk bangun datar yang berbeda.',
            tasks: [
              { area: 'Kolam Ikan', shape: 'Lingkaran', reason: 'Bentuk natural dan estetik' },
              { area: 'Lapangan Basket', shape: 'Persegi Panjang', reason: 'Standar lapangan olahraga' },
              { area: 'Taman Bunga', shape: 'Segitiga', reason: 'Focal point yang menarik' }
            ]
          }
        }
      },
      {
        id: 'bangun-ruang-sisi-datar',
        title: 'Bangun Ruang Sisi Datar',
        type: 'interactive',
        duration: 20,
        status: 'available',
        content: {
          definition: 'Bangun ruang sisi datar adalah bangun tiga dimensi yang semua permukaannya berupa bidang datar (polygon).',
          characteristics: [
            'Memiliki 3 dimensi: panjang, lebar, dan tinggi',
            'Semua sisi berupa bidang datar',
            'Memiliki volume dan luas permukaan',
            'Memiliki rusuk dan titik sudut'
          ],
          examples: [
            { name: 'Kubus', image: '/materi/bangun_ruang_sisi_datar/kubus.jpg', properties: '6 sisi persegi, 12 rusuk sama panjang' },
            { name: 'Balok', image: '/materi/bangun_ruang_sisi_datar/balok.jpg', properties: '6 sisi persegi panjang' },
            { name: 'Prisma Segitiga', image: '/materi/bangun_ruang_sisi_datar/prisma_segitiga.jpg', properties: '2 alas segitiga, 3 sisi persegi panjang' },
            { name: 'Limas Segiempat', image: '/materi/bangun_ruang_sisi_datar/limas_segiempat.jpg', properties: '1 alas persegi, 4 sisi segitiga' }
          ],
          interactive: {
            type: 'drag_drop_quiz',
            instruction: 'Seret nama bangun ruang ke gambar yang sesuai!'
          },
          studyCase: {
            title: 'Studi Kasus: Arsitektur Bangunan',
            scenario: 'Seorang arsitek merancang kompleks perumahan dengan berbagai bentuk bangunan.',
            tasks: [
              { building: 'Rumah Minimalis', shape: 'Balok', reason: 'Efisien ruang dan material' },
              { building: 'Gazebo Taman', shape: 'Prisma Segitiga', reason: 'Atap miring untuk air hujan' },
              { building: 'Menara Air', shape: 'Kubus', reason: 'Struktur stabil dan kuat' }
            ]
          }
        }
      },
      {
        id: 'bangun-ruang-sisi-lengkung',
        title: 'Bangun Ruang Sisi Lengkung',
        type: 'interactive',
        duration: 20,
        status: 'available',
        content: {
          definition: 'Bangun ruang sisi lengkung adalah bangun tiga dimensi yang memiliki setidaknya satu permukaan berbentuk lengkung.',
          characteristics: [
            'Memiliki 3 dimensi: panjang, lebar, dan tinggi',
            'Minimal satu sisi berupa bidang lengkung',
            'Memiliki volume dan luas permukaan',
            'Bentuk yang smooth dan kontinyu'
          ],
          examples: [
            { name: 'Tabung', image: '/materi/bangun_ruang_sisi_lengkung/tabung.jpg', properties: '2 alas lingkaran, selimut lengkung' },
            { name: 'Kerucut', image: '/materi/bangun_ruang_sisi_lengkung/kerucut.jpg', properties: '1 alas lingkaran, 1 titik puncak' },
            { name: 'Bola', image: '/materi/bangun_ruang_sisi_lengkung/bola.jpg', properties: 'Semua permukaan lengkung' },
            { name: 'Setengah Bola', image: '/materi/bangun_ruang_sisi_lengkung/setengah_bola.jpg', properties: '½ bola dengan alas lingkaran' }
          ],
          interactive: {
            type: 'property_matching',
            instruction: 'Cocokkan sifat-sifat dengan bangun ruang yang tepat!'
          },
          studyCase: {
            title: 'Studi Kasus: Industri Kemasan',
            scenario: 'Perusahaan makanan ingin mengoptimalkan kemasan produk mereka.',
            tasks: [
              { product: 'Kaleng Susu', shape: 'Tabung', reason: 'Mudah diproduksi dan efisien ruang' },
              { product: 'Es Krim Cone', shape: 'Kerucut', reason: 'Mudah dipegang dan ikonik' },
              { product: 'Permen Bulat', shape: 'Bola', reason: 'Tidak ada sisi tajam, aman' }
            ]
          }
        }
      },
      {
        id: 'perbandingan-visualisasi',
        title: 'Perbandingan & Visualisasi 3D',
        type: 'visualization',
        duration: 15,
        status: 'available',
        content: {
          definition: 'Memahami perbedaan mendasar antara bangun sisi datar dan sisi lengkung melalui visualisasi interaktif.',
          comparison: {
            title: 'Tabel Perbandingan',
            headers: ['Aspek', 'Sisi Datar', 'Sisi Lengkung'],
            rows: [
              ['Bentuk Sisi', 'Polygon (datar)', 'Kurva (lengkung)'],
              ['Contoh', 'Kubus, Balok', 'Tabung, Bola'],
              ['Perhitungan', 'Formula sederhana', 'Menggunakan π'],
              ['Aplikasi', 'Konstruksi bangunan', 'Kemasan, kendaraan']
            ]
          },
          interactive: {
            type: '3d_visualization',
            instruction: 'Putar dan zoom objek 3D untuk memahami strukturnya!'
          },
          quiz: {
            type: 'classification',
            instruction: 'Kelompokkan bangun ruang berikut ke kategori yang tepat!',
            items: [
              { name: 'Kubus', category: 'sisi_datar', image: '/materi/bangun_ruang_sisi_datar/kubus.jpg' },
              { name: 'Tabung', category: 'sisi_lengkung', image: '/materi/bangun_ruang_sisi_lengkung/tabung.jpg' },
              { name: 'Prisma', category: 'sisi_datar', image: '/materi/bangun_ruang_sisi_datar/prisma_segitiga.jpg' },
              { name: 'Bola', category: 'sisi_lengkung', image: '/materi/bangun_ruang_sisi_lengkung/bola.jpg' },
              { name: 'Limas', category: 'sisi_datar', image: '/materi/bangun_ruang_sisi_datar/limas_segiempat.jpg' },
              { name: 'Kerucut', category: 'sisi_lengkung', image: '/materi/bangun_ruang_sisi_lengkung/kerucut.jpg' }
            ]
          }
        }
      },
      {
        id: 'evaluasi-akhir',
        title: 'Evaluasi & Aplikasi Praktis',
        type: 'assessment',
        duration: 25,
        status: 'available',
        content: {
          definition: 'Ujian pemahaman komprehensif tentang bangun datar dan ruang dengan berbagai jenis soal interaktif.',
          finalProject: {
            title: 'Proyek Akhir: Desain Mall Mini',
            scenario: 'Rancang layout mall mini dengan mempertimbangkan efisiensi ruang dan estetika.',
            requirements: [
              'Gunakan minimal 3 bangun datar untuk area lantai',
              'Integrasikan 4 jenis bangun ruang untuk struktur',
              'Jelaskan alasan pemilihan setiap bentuk'
            ]
          },
          assessment: {
            multipleChoice: [
              {
                question: 'Bangun ruang yang semua sisinya berupa bidang datar adalah...',
                options: ['Tabung', 'Kubus', 'Bola', 'Kerucut'],
                correct: 1,
                image: '/api/placeholder/200/150'
              }
            ],
            dragDrop: {
              instruction: 'Seret rumus yang tepat untuk setiap bangun ruang!',
              shapes: ['Kubus', 'Tabung', 'Bola'],
              formulas: ['s³', 'πr²t', '4/3πr³']
            },
            trueFalse: [
              { statement: 'Semua bangun ruang memiliki volume', answer: true },
              { statement: 'Lingkaran adalah bangun ruang', answer: false }
            ]
          }
        }
      }
    ]
  };

  const markAsCompleted = (sectionId) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(sectionId);
    setCompletedTopics(newCompleted);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    if (draggedItem) {
      const newAnswers = { ...quizAnswers };
      if (!newAnswers[activeSection]) newAnswers[activeSection] = {};
      newAnswers[activeSection][draggedItem.name] = targetCategory;
      setQuizAnswers(newAnswers);
      setDraggedItem(null);
    }
  };

  const checkQuizAnswer = (sectionId) => {
    const section = materiData.sections.find(s => s.id === sectionId);
    if (section.content.quiz) {
      const userAnswers = quizAnswers[sectionId] || {};
      const correctAnswers = section.content.quiz.items.reduce((acc, item) => {
        acc[item.name] = item.category;
        return acc;
      }, {});
      
      const score = Object.keys(correctAnswers).reduce((score, itemName) => {
        return score + (userAnswers[itemName] === correctAnswers[itemName] ? 1 : 0);
      }, 0);
      
      setShowQuizResult({ 
        ...showQuizResult, 
        [sectionId]: {
          score: score,
          total: Object.keys(correctAnswers).length,
          percentage: Math.round((score / Object.keys(correctAnswers).length) * 100)
        }
      });
    }
  };

  const renderImagePlaceholder = (src, alt, className = "") => {
    // If it's a real image path and not a placeholder, try to render the actual image
    if (src && !src.includes('/api/placeholder')) {
      return (
        <div className={`relative ${className}`}>
          <Image 
            src={src} 
            alt={alt} 
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
          {/* Fallback placeholder - hidden by default */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-dashed border-blue-300 rounded-lg items-center justify-center">
            <div className="text-center p-2">
              <div className="text-lg sm:text-xl mb-1">🖼️</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{alt}</div>
            </div>
          </div>
        </div>
      );
    }
    
    // Render placeholder for missing images
    return (
      <div className={`bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-2">
          <div className="text-xl sm:text-2xl mb-1">🖼️</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">{alt}</div>
          <div className="text-xs text-gray-500 mt-1 hidden sm:block">Placeholder Image</div>
        </div>
      </div>
    );
  };

  const renderInteractiveContent = (section) => {
    const { interactive, studyCase, quiz } = section.content;

    return (
      <div className="space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-gray-800 mb-2">Definisi</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{section.content.definition}</p>
          </div>

          {section.content.characteristics && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Karakteristik:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {section.content.characteristics.map((char, i) => (
                  <li key={i}>{char}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Examples with Grid */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Contoh Visual:</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {section.content.examples?.map((example, i) => (
                <div key={i} className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="w-full h-24 sm:h-28 md:h-32 mb-3 relative">
                    <Image 
                      src={example.image} 
                      alt={example.name} 
                      fill
                      className="object-contain rounded"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="font-medium text-gray-800 text-sm sm:text-base">{example.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">{example.properties}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Element */}
        {interactive && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎮</span>
              Aktivitas Interaktif
            </h3>
            <p className="text-gray-600 text-sm mb-4">{interactive.instruction}</p>
            
            {interactive.type === 'shape_identifier' && (
              <div className="space-y-4">
                {(() => {
                  // Super simple approach
                  let currentQuestionIndex = shapeQuestions[section.id];
                  if (currentQuestionIndex === undefined) {
                    currentQuestionIndex = 0; // Default to first question
                  }
                  
                  const question = simpleQuestions[currentQuestionIndex];
                  const answer = shapeAnswers[section.id];
                  
                  return (
                    <>
                      {/* Question */}
                      <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                        <h4 className="font-bold text-gray-800 mb-2">Pertanyaan:</h4>
                        <p className="text-gray-700">{question.question}</p>
                      </div>

                      {/* Answer Options - Grid 2 Kolom */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {section.content.examples?.map((example, i) => {
                          let buttonStyle = "bg-white hover:bg-blue-100 border-2 hover:border-blue-300";
                          
                          if (answer?.answered) {
                            if (example.name === question.correctAnswer) {
                              buttonStyle = "bg-green-100 border-2 border-green-500";
                            } else if (example.name === answer.selectedAnswer && !answer.correct) {
                              buttonStyle = "bg-red-100 border-2 border-red-500";
                            } else {
                              buttonStyle = "bg-gray-100 border-2 border-gray-300";
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={answer?.answered}
                              className={`${buttonStyle} rounded-lg p-3 sm:p-4 transition-colors ${
                                answer?.answered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                              }`}
                              onClick={() => handleSimpleShapeAnswer(section.id, example)}
                            >
                              <div className="w-full h-20 sm:h-24 md:h-28 mb-2 relative">
                                <Image 
                                  src={example.image} 
                                  alt={example.name} 
                                  fill
                                  className="object-contain rounded"
                                  sizes="(max-width: 640px) 50vw, 25vw"
                                />
                              </div>
                              <div className="font-medium text-sm sm:text-base">{example.name}</div>
                              {answer?.answered && example.name === question.correctAnswer && (
                                <div className="text-green-600 text-xs sm:text-sm mt-1 font-bold">✓ Jawaban Benar</div>
                              )}
                              {answer?.answered && example.name === answer.selectedAnswer && !answer.correct && (
                                <div className="text-red-600 text-xs sm:text-sm mt-1 font-bold">✗ Salah</div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Result */}
                      {answer?.answered && (
                        <div className={`p-4 rounded-lg ${
                          answer.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className={`font-bold mb-2 flex items-center ${
                            answer.correct ? 'text-green-800' : 'text-red-800'
                          }`}>
                            <span className="text-2xl mr-2">
                              {answer.correct ? '🎉' : '😔'}
                            </span>
                            {answer.correct ? 'Benar! Hebat!' : 'Oops! Coba lagi!'}
                          </div>
                          <p className={`text-sm mb-3 ${
                            answer.correct ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {question.explanation}
                          </p>
                          <button
                            onClick={() => resetSimpleQuestion(section.id)}
                            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center justify-center w-full sm:w-auto"
                          >
                            <span className="mr-1">🔄</span>
                            <span>Pertanyaan Baru</span>
                          </button>
                        </div>
                      )}

                      {/* Score - Responsive */}
                      {answer?.answered && (
                        <div className="text-center">
                          <div className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold ${
                            answer.correct ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            <span className="text-base sm:text-lg mr-2">
                              {answer.correct ? '⭐' : '💪'}
                            </span>
                            {answer.correct ? 'Poin +10' : 'Tetap Semangat!'}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Study Case */}
        {studyCase && (
          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              {studyCase.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{studyCase.scenario}</p>
            
            <div className="space-y-3">
              {studyCase.tasks?.map((task, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="font-medium text-gray-800">{task.area || task.building || task.product}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-green-600">{task.shape}</span> - {task.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {quiz && (
          <div className="bg-yellow-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧩</span>
              Kuis Interaktif
            </h3>
            <p className="text-gray-600 text-sm mb-4">{quiz.instruction}</p>
            
            {quiz.type === 'classification' && (
              <div className="space-y-4">
                {/* Items to drag - Grid Responsif */}
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Seret item berikut:</h4>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {quiz.items?.map((item, i) => (
                      <div
                        key={i}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-gray-100 rounded-lg p-2 sm:p-3 cursor-move hover:bg-gray-200 transition-colors text-center"
                      >
                        <div className="w-full h-12 sm:h-16 mb-2 relative">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-contain rounded"
                            sizes="(max-width: 640px) 33vw, 20vw"
                          />
                        </div>
                        <div className="text-xs sm:text-sm font-medium">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drop zones - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className="bg-blue-100 rounded-lg p-4 sm:p-6 border-2 border-dashed border-blue-300 text-center min-h-[100px] sm:min-h-[120px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'sisi_datar')}
                  >
                    <h4 className="font-bold text-blue-700 mb-2 text-sm sm:text-base">Sisi Datar</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {Object.entries(quizAnswers[section.id] || {})
                        .filter(([, category]) => category === 'sisi_datar')
                        .map(([name]) => (
                          <div key={name} className="bg-white rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                            {name}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div
                    className="bg-red-100 rounded-lg p-4 sm:p-6 border-2 border-dashed border-red-300 text-center min-h-[100px] sm:min-h-[120px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'sisi_lengkung')}
                  >
                    <h4 className="font-bold text-red-700 mb-2 text-sm sm:text-base">Sisi Lengkung</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {Object.entries(quizAnswers[section.id] || {})
                        .filter(([, category]) => category === 'sisi_lengkung')
                        .map(([name]) => (
                          <div key={name} className="bg-white rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                            {name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => checkQuizAnswer(section.id)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium"
                >
                  Periksa Jawaban
                </button>

                {showQuizResult[section.id] && (
                  <div className={`p-4 rounded-lg ${
                    showQuizResult[section.id].percentage >= 70 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="font-bold">
                      Skor: {showQuizResult[section.id].score}/{showQuizResult[section.id].total} ({showQuizResult[section.id].percentage}%)
                    </div>
                    <div className="text-sm mt-1">
                      {showQuizResult[section.id].percentage >= 70 
                        ? '🎉 Hebat! Kamu sudah memahami materi dengan baik!' 
                        : '💪 Coba lagi! Pelajari kembali materi sebelum mengerjakan kuis.'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comparison Table - Responsive */}
        {section.content.comparison && (
          <div className="bg-white rounded-2xl p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4">{section.content.comparison.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {section.content.comparison.headers.map((header, i) => (
                      <th key={i} className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.content.comparison.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button 
          onClick={() => markAsCompleted(section.id)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium text-lg flex items-center justify-center space-x-2"
        >
          <span>✓</span>
          <span>Selesaikan Pembelajaran</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header - Responsive */}
      <div className={`bg-gradient-to-br ${materiData.color} px-4 sm:px-6 py-6 sm:py-8 text-white`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link href="/materi-pembelajaran">
            <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
              <span className="text-lg sm:text-xl">←</span>
              <span className="text-sm sm:text-base">Kembali</span>
            </button>
          </Link>
          <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm">
            {materiData.sections.length} Modul Interaktif
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{materiData.icon}</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{materiData.title}</h1>
          <p className="text-white text-opacity-90 text-sm max-w-md mx-auto">{materiData.subtitle}</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Enhanced Description - Responsive */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-2xl sm:text-3xl">📖</div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Tentang Pembelajaran Ini</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{materiData.description}</p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs">Visualisasi 3D</span>
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs">Studi Kasus</span>
                <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs">Kuis Interaktif</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs">Drag & Drop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Responsive */}
        <div className="bg-white rounded-2xl p-4 sm:p-6">
          <h2 className="font-bold text-gray-800 mb-4 text-base sm:text-lg">Progress Pembelajaran</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedTopics.size / materiData.sections.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {completedTopics.size} dari {materiData.sections.length} modul selesai
          </div>
        </div>

        {/* Daftar Topik - Responsive */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Daftar Modul Pembelajaran
          </h2>
          {materiData.sections.map((section, index) => {
            const isCompleted = completedTopics.has(section.id);
            const isAvailable = section.status === 'available' || isCompleted;
            const isActive = activeSection === section.id;

            return (
              <div key={section.id} className="mb-4 sm:mb-6">
                <div 
                  className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm cursor-pointer transition-all duration-200 ${
                    isActive ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => isAvailable && setActiveSection(isActive ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isAvailable ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{section.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <span className="mr-1">⏱</span>
                            {section.duration} menit
                          </span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full w-fit ${
                            section.type === 'interactive' ? 'bg-blue-100 text-blue-700' :
                            section.type === 'visualization' ? 'bg-purple-100 text-purple-700' :
                            section.type === 'assessment' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {section.type === 'interactive' ? '🎮 Interaktif' :
                             section.type === 'visualization' ? '👁️ Visual' :
                             section.type === 'assessment' ? '📊 Evaluasi' : section.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {!isAvailable && <span className="text-gray-400 text-base sm:text-lg">🔒</span>}
                      {isCompleted && <span className="text-green-500 text-base sm:text-lg">🏆</span>}
                      <span className={`text-gray-400 text-lg sm:text-xl transition-transform duration-200 ${
                        isActive ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {isActive && isAvailable && (
                  <div className="mt-4 animate-in slide-in-from-top duration-300">
                    {renderInteractiveContent(section)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievement Section - Responsive Grid */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-yellow-200">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center text-base sm:text-lg">
            <span className="mr-2">🏅</span>
            Pencapaian
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-lg ${completedTopics.size >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              <div className="text-xl sm:text-2xl mb-2">🎯</div>
              <div className="font-medium text-sm sm:text-base">Pemula</div>
              <div className="text-xs">Selesaikan 1 modul</div>
            </div>
            <div className={`p-3 sm:p-4 rounded-lg ${completedTopics.size >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
              <div className="text-xl sm:text-2xl mb-2">🚀</div>
              <div className="font-medium text-sm sm:text-base">Eksplorasi</div>
              <div className="text-xs">Selesaikan 3 modul</div>
            </div>
            <div className={`p-3 sm:p-4 rounded-lg ${completedTopics.size === materiData.sections.length ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
              <div className="text-xl sm:text-2xl mb-2">👑</div>
              <div className="font-medium text-sm sm:text-base">Master</div>
              <div className="text-xs">Selesaikan semua modul</div>
            </div>
            <div className={`p-3 sm:p-4 rounded-lg ${Object.keys(showQuizResult).length >= 2 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'}`}>
              <div className="text-xl sm:text-2xl mb-2">🧠</div>
              <div className="font-medium text-sm sm:text-base">Cerdas</div>
              <div className="text-xs">Lulus 2+ kuis</div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {completedTopics.size === materiData.sections.length && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white text-center">
            <div className="text-4xl mb-4">🎊</div>
            <h2 className="text-xl font-bold mb-2">Selamat!</h2>
            <p className="text-sm opacity-90 mb-4">
              Kamu telah menyelesaikan semua modul pembelajaran Pengantar Bangun Ruang. 
              Kini kamu siap mempelajari materi bangun ruang yang lebih advanced!
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-colors">
                📜 Lihat Sertifikat
              </button>
              <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-colors">
                ➡️ Lanjut ke Materi Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Tips Belajar
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">•</span>
              Klik pada setiap gambar placeholder untuk melihat detail bangun ruang
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">•</span>
              Gunakan fitur drag & drop pada kuis untuk pengalaman belajar yang interaktif
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">•</span>
              Pelajari studi kasus untuk memahami aplikasi praktis dalam kehidupan nyata
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">•</span>
              Selesaikan semua modul untuk membuka achievement dan sertifikat
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

