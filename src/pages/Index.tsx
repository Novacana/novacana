
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Debugging-Info
    console.log("Index Komponente lädt...");
    
    // Lade Status von Bildern überprüfen
    const preloadImages = [
      "/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png",
      "/lovable-uploads/8e38db3b-c618-4827-bc84-c89ef43ebef7.png",
      "/images/medical-research.jpg"
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => console.log(`Bild geladen: ${src}`);
      img.onerror = () => console.error(`Fehler beim Laden des Bildes: ${src}`);
    });
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
