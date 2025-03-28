
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock, Truck, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-gradient-to-b from-white to-purple-50/70 dark:from-gray-900 dark:to-gray-800/70">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/3 w-64 h-64 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl"></div>
        
        {/* Animated blob shapes */}
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-teal-300/20 dark:bg-teal-300/10 rounded-full blob animate-pulse-soft"></div>
        <div className="absolute left-1/3 bottom-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-300/10 rounded-full blob animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-content relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-block mb-8 animate-fade-in">
              <img 
                src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
                alt="Novacana" 
                className="h-28 md:h-32 mx-auto lg:mx-0 transition-all duration-300 hover:scale-105" 
                onError={e => {
                  console.error("Logo konnte nicht geladen werden:", e);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }} 
              />
            </div>
            
            <h1 className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t('hero.title')}</span><br />
              <span className="text-gray-700 dark:text-gray-300 mt-3 block text-2xl md:text-3xl font-normal">{t('hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <a href="#contact" className="hover-lift">
                <Button size="lg" variant="gradient" rounded="full" className="w-full sm:w-auto">
                  {t('hero.cta.contact')}
                </Button>
              </a>
              <Link to="/register" className="hover-lift">
                <Button size="lg" variant="outline" rounded="full" className="w-full sm:w-auto group">
                  <span>{t('hero.cta.register')}</span>
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck size={22} />
                </div>
                <span className="text-sm font-medium">WDA, GDP, MedCanG</span>
              </div>
              <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
                  <Clock size={22} />
                </div>
                <span className="text-sm font-medium">24h Lieferung</span>
              </div>
              <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
                  <Truck size={22} />
                </div>
                <span className="text-sm font-medium">Deutschlandweit</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative max-w-lg">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/30 to-primary/30 dark:from-secondary/20 dark:to-primary/20 rounded-[2rem] blur-xl transform -rotate-6 scale-95"></div>
              
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-primary/20 transition-all duration-500">
                <img 
                  alt={language === 'de' ? "Medizinische Cannabisforschung" : "Medical Cannabis Research"} 
                  className="w-full h-auto rounded-3xl object-cover"
                  style={{ maxHeight: "500px" }}
                  onError={e => {
                    console.error("Bild konnte nicht geladen werden:", e);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.svg";
                  }} 
                  src="https://cdn.prod.website-files.com/6638878d99207e2fa2b8efb6/66e163656a0cea115f3334da_cannabis_apotheke_goeasy.webp" 
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-3xl"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 p-4 glass-card animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Clock size={18} />
                  </div>
                  <span className="text-sm font-medium">Schnelle Lieferung</span>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 p-4 glass-card animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-sm font-medium">Zertifizierte Qualität</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 animate-float" style={{ animationDelay: "1s" }}>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                  <Sparkles className="h-6 w-6 text-amber-500" />
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
