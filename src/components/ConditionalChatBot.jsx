'use client';
import { usePathname } from 'next/navigation';
import ChatBot from './chatbot/ChatBot';

const ConditionalChatBot = () => {
  const pathname = usePathname();
  
  // List halaman di mana chatbot TIDAK boleh muncul
  const disabledPaths = [
    '/evaluasi',
    '/diagnostik-tes'
  ];
  
  // Cek apakah current path ada dalam daftar disabled
  const shouldShowChatBot = !disabledPaths.includes(pathname);
  
  // Jika chatbot tidak boleh ditampilkan, return null
  if (!shouldShowChatBot) {
    return null;
  }
  
  // Tampilkan chatbot untuk halaman lainnya
  return <ChatBot />;
};

export default ConditionalChatBot;
