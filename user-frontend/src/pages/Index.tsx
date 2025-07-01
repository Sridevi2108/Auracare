
import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ChatBot from '@/components/ChatBot';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDarkMode } from '@/components/DarkModeProvider';

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
