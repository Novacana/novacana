import React from "react";
import { Leaf, Shield, Truck, Award, Clock, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const Features = () => {
  const {
    t
  } = useLanguage();
  const features = [{
    title: t('features.pharmaceutical'),
    description: t('features.pharmaceutical.desc'),
    icon: Shield,
    color: "bg-purple-500/10 text-purple-500",
    delay: 0
  }, {
    title: t('features.delivery'),
    description: t('features.delivery.desc'),
    icon: Truck,
    color: "bg-secondary/10 text-secondary",
    delay: 0.1
  }, {
    title: t('features.quality'),
    description: t('features.quality.desc'),
    icon: Award,
    color: "bg-amber-500/10 text-amber-500",
    delay: 0.2
  }, {
    title: t('features.selection'),
    description: t('features.selection.desc'),
    icon: Leaf,
    color: "bg-green-500/10 text-green-500",
    delay: 0.3
  }, {
    title: t('features.support'),
    description: t('features.support.desc'),
    icon: Clock,
    color: "bg-primary/10 text-primary",
    delay: 0.4
  }, {
    title: t('features.documentation'),
    description: t('features.documentation.desc'),
    icon: FileCheck,
    color: "bg-blue-500/10 text-blue-500",
    delay: 0.5
  }];
  return <section className="py-24 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-primary/5 dark:bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-secondary/5 dark:bg-secondary/5 blur-3xl"></div>
        
        {/* Animated elements */}
        <div className="absolute -left-16 top-1/3 w-32 h-32 bg-purple-200/10 dark:bg-purple-400/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute right-0 bottom-1/4 w-48 h-48 bg-teal-200/10 dark:bg-teal-400/5 rounded-full animate-pulse-soft" style={{
        animationDelay: '1.5s'
      }}></div>
      </div>

      <div className="container-content relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => <div key={feature.title} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10 animate-fade-in" style={{
          animationDelay: `${0.1 + feature.delay}s`
        }}>
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>
        
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 p-8 md:p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">{t('features.cta.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{t('features.cta.description')}</p>
            <a href="#contact" className="btn-primary inline-block hover-lift animate-pulse-soft">
              {t('features.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>;
};
export default Features;