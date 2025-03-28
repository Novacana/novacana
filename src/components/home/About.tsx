
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
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
                  src="/lovable-uploads/b8e522e4-7a6e-483b-8d83-33bf4e6d3014.png" 
                  alt={t('aboutUs.supplyChain.title') || "Unsere Supply Chain"} 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/1170x640/gray/white?text=Supply+Chain";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('aboutUs.supplyChain.title') || "Unsere Supply Chain"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t('aboutUs.supplyChain.description') || "Vom Produzenten bis zur Apotheke - Qualität in jedem Schritt"}
                  </p>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 inline-block rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-700">
                      {t('about.card.established') || "Gegründet 2019"}
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
              {t('about.badge') || "Über uns"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('about.title') || "Qualität und Expertise seit 2019"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {t('about.description') || "Wir sind ein spezialisierter pharmazeutischer Großhändler mit Teilsortiment Cannabis, der Apotheken in ganz Deutschland mit hochwertigen medizinischen Cannabisprodukten versorgt."}
            </p>
            
            <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.quality') || "Höchste Qualität"}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.quality.desc') || "Wir arbeiten nur mit Produzenten zusammen, die unsere strengen Qualitätsstandards erfüllen."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.expertise') || "Fachkompetenz"}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.expertise.desc') || "Unser Team verfügt über fundiertes Wissen zu medizinischem Cannabis und seinen therapeutischen Anwendungen."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-gray-700 dark:text-gray-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.reliability') || "Zuverlässigkeit"}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.reliability.desc') || "Vertrauen Sie auf unsere zuverlässige Lieferung und konstante Produktqualität."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/about">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center group">
                  {t('about.button') || "Mehr über uns"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-content mt-20">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-8 rounded-3xl text-center shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('aboutUs.cta.title') || "Bereit für höchste Qualität?"}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('aboutUs.cta.description') || "Entdecken Sie unser Sortiment an hochwertigen medizinischen Cannabisprodukten für Ihre Apotheke."}
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full px-8 group">
              {t('aboutUs.cta.button') || "Jetzt Kontakt aufnehmen"} 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
