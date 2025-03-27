
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 bottom-1/3 w-96 h-96 rounded-full bg-gray-100/70 dark:bg-gray-800/20 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200/30 to-gray-300/30 dark:from-gray-800/20 dark:to-gray-700/20 rounded-2xl blur-xl transform rotate-3 scale-95"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/3cafb960-76e3-4c56-8900-a64f3a719a62.png" 
                  alt="Regulatorische Konformität" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/1170x640/gray/white?text=Regulatorische+Konformität";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('about.card.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t('about.card.description')}
                  </p>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 inline-block rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-700">
                      {t('about.card.established')}
                    </div>
                    <div className="flex space-x-3">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">WDA</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">GDP</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">MedCanG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block animate-fade-in text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('about.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('about.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t('about.description')}
            </p>
            
            <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.quality')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.quality.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.expertise')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.expertise.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.reliability')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.reliability.desc')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/about">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                  {t('about.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
