
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
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-nova-100/40 dark:bg-nova-900/20 blur-3xl"></div>
        <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="w-12 h-12 bg-nova-100 dark:bg-nova-900/50 rounded-lg flex items-center justify-center text-nova-700 dark:text-nova-300 mb-4">
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
      </div>
    </section>
  );
};

export default Features;
