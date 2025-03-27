
import React from "react";
import { Leaf, Shield, Truck, Award, Clock, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.pharmaceutical'),
      description: t('features.pharmaceutical.desc'),
      icon: Shield,
    },
    {
      title: t('features.delivery'),
      description: t('features.delivery.desc'),
      icon: Truck,
    },
    {
      title: t('features.quality'),
      description: t('features.quality.desc'),
      icon: Award,
    },
    {
      title: t('features.selection'),
      description: t('features.selection.desc'),
      icon: Leaf,
    },
    {
      title: t('features.support'),
      description: t('features.support.desc'),
      icon: Clock,
    },
    {
      title: t('features.documentation'),
      description: t('features.documentation.desc'),
      icon: FileCheck,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-gray-200/40 dark:bg-gray-800/20 blur-3xl"></div>
        <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-gray-200/30 dark:bg-gray-800/10 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Imagery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="rounded-xl overflow-hidden shadow-md relative">
            <img 
              src="/images/cannabis-pharmacy.jpg" 
              alt="Cannabis in der Pharmazie" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Innovative Versorgung</h3>
              <p className="text-sm text-gray-200">Wir beliefern Apotheken mit den neuesten Produkten</p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-md relative">
            <img 
              src="/images/laboratory.jpg" 
              alt="Laboranalyse" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Strenge Qualitätskontrollen</h3>
              <p className="text-sm text-gray-200">Alle unsere Produkte werden strengen Tests unterzogen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
