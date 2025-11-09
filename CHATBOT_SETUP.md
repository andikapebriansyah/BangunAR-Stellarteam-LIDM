# 🤖 Chatbot Hybrid RAG + Rule-Based Setup Guide

## 📋 Overview
Chatbot ini menggunakan **hybrid system**:
- ✅ **Rule-Based** untuk pertanyaan umum (instant response)
- ✅ **RAG dengan Gemini AI** untuk pertanyaan kompleks (< 10 detik)

---

## 🔑 Setup Gemini API Key

### 1. Dapatkan API Key
1. Buka: https://aistudio.google.com/app/apikey
2. Login dengan Google Account
3. Klik "Create API Key"
4. Copy API key yang dihasilkan

### 2. Configure API Key
1. Buka file `.env.local` di root project
2. Replace `your-api-key-here` dengan API key Anda:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...your-actual-key
   ```

### 3. Restart Development Server
```bash
npm run dev
```

---

## 🎯 How It Works

### Flow Diagram:
```
User Input
  ↓
1. Normalize Text
  ↓
2. Rule-Based Check (Priority):
   ├─ Greeting? → Instant Response ⚡
   ├─ Help/Menu? → Instant Response ⚡
   └─ Pattern Match? → Instant Response ⚡
  ↓
3. No Match? → Call Gemini RAG 🤖
   ├─ Load bangun_ruang.json (37 entries)
   ├─ Send to Gemini 1.5 Flash
   ├─ Timeout: 10 seconds
   └─ Return AI-generated answer
  ↓
4. Display Response
```

---

## 📊 Performance Targets

| Scenario | Expected Time |
|----------|---------------|
| Rule-Based (Greeting, Help) | < 0.5s |
| Rule-Based (Pattern Match) | < 0.8s |
| RAG with Gemini | < 10s |
| Timeout Fallback | 10s (max) |

---

## 🧪 Testing

### Test Rule-Based (Instant):
- "Halo"
- "Bantuan"
- "Apa itu tabung?"
- "Rumus volume kerucut"

### Test RAG (AI-powered):
- "Bagaimana cara menghitung volume tabung jika diketahui diameter?"
- "Apa perbedaan garis pelukis dan tinggi pada kerucut?"
- "Mengapa rumus volume kerucut 1/3 dari tabung?"

---

## 🔧 Troubleshooting

### Error: "Gemini API key not configured"
**Solution:** Check `.env.local` file dan pastikan API key sudah diisi dengan benar.

### Error: "Response timeout"
**Solution:** Pertanyaan terlalu kompleks. Sederhanakan pertanyaan atau coba lagi.

### Error: "fetch failed"
**Solution:** Check internet connection dan pastikan `bangun_ruang.json` ada di `/public/data/`.

---

## 📁 Files Modified

1. ✅ `src/components/chatbot/chatbotData.jsx` - Added `callGeminiRAG()` function
2. ✅ `src/components/chatbot/ChatBot.jsx` - Updated hybrid flow + thinking animation
3. ✅ `.env.local` - Added Gemini API key configuration

---

## 🎨 Features

### Rule-Based Features:
- ✅ Greeting detection
- ✅ Help menu
- ✅ Pattern matching for common questions
- ✅ Instant responses (< 1s)

### RAG Features:
- ✅ Context-aware responses using knowledge base
- ✅ Natural language understanding
- ✅ Handles complex questions
- ✅ "Thinking..." animation
- ✅ 10-second timeout protection

---

## 📚 Knowledge Base

**Source:** `/public/data/bangun_ruang.json`
- Total entries: 37
- Topics: Tabung, Kerucut, Bola
- Types: Definisi, Rumus, QA

---

## 🚀 Next Steps

1. ✅ Setup API key di `.env.local`
2. ✅ Restart development server
3. ✅ Test chatbot dengan berbagai pertanyaan
4. ✅ Monitor response time di console
5. ✅ Adjust temperature/parameters jika diperlukan

---

**Happy Coding! 🎉**
