
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock, TruckDelivery } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-1/4 w-72 h-72 rounded-full bg-gray-100/70 dark:bg-gray-800/30 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 w-96 h-96 rounded-full bg-gray-100/50 dark:bg-gray-800/20 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-block mb-6 animate-fade-in">
              <img src="/logo.png" alt="Novacana" className="h-16 md:h-20 mx-auto lg:mx-0" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('hero.title')}<br />
              <span className="text-gray-700 dark:text-gray-300">{t('hero.subtitle')}</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <a href="#contact">
                <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white">
                  {t('hero.cta.contact')}
                </Button>
              </a>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group border-black text-black hover:bg-black hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900">
                  <span>{t('hero.cta.register')}</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-gray-700 dark:text-gray-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-400 font-medium">GMP Zertifiziert</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-gray-700 dark:text-gray-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-400 font-medium">24h Lieferung</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckDelivery className="text-gray-700 dark:text-gray-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-400 font-medium">Deutschlandweit</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/30 to-gray-300/30 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl blur-xl transform -rotate-6 scale-95"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/images/medical-research.jpg" 
                  alt="Medizinische Cannabisforschung" 
                  className="w-full h-auto rounded-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Qualitätskontrolle</h3>
                  <p className="text-sm text-gray-200">Jedes Produkt durchläuft strenge Qualitätsprüfungen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
