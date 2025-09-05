import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBot from "../components/chatbot/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BangunAR - Pembelajaran Interaktif Bangun Ruang",
  description: "Aplikasi pembelajaran interaktif untuk memahami konsep bangun ruang dengan teknologi AR dan chatbot matematika",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
