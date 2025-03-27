
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
        <div className="absolute right-0 bottom-1/3 w-96 h-96 rounded-full bg-nova-50/70 dark:bg-nova-900/20 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-nova-200/30 to-blue-200/30 dark:from-nova-800/20 dark:to-blue-800/20 rounded-2xl blur-xl transform rotate-3 scale-95"></div>
              <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="aspect-square bg-gradient-to-br from-nova-100 to-nova-50 dark:from-nova-900/50 dark:to-nova-800/30 rounded-lg flex items-center justify-center">
                    <span className="text-nova-700 dark:text-nova-300 text-4xl font-bold">GMP</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-nova-50 to-white dark:from-nova-800/30 dark:to-gray-900/50 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-gray-800 dark:text-white text-sm font-medium text-center">
                      {t('about.card.gmp.desc')}
                    </span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-nova-50 to-white dark:from-nova-800/30 dark:to-gray-900/50 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-gray-800 dark:text-white text-sm font-medium text-center">
                      {t('about.card.wholesaler')}
                    </span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-nova-100 to-nova-50 dark:from-nova-900/50 dark:to-nova-800/30 rounded-lg flex items-center justify-center">
                    <span className="text-nova-700 dark:text-nova-300 text-4xl font-bold">GDP</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('about.card.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {t('about.card.description')}
                  </p>
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 inline-block rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-800">
                      {t('about.card.established')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block animate-fade-in text-sm font-medium text-nova-600 dark:text-nova-400 mb-2">
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
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.quality')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.quality.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.expertise')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.expertise.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('about.reliability')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('about.reliability.desc')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/register">
                <Button size="lg">
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
