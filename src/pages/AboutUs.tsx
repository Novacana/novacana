
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Check, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
          <div className="container-content">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.title') || "Über Novacana"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('about.subtitle') || "Wir sind ein führender pharmazeutischer Großhändler, spezialisiert auf medizinische Cannabisprodukte für Apotheken in ganz Deutschland."}
              </p>
            </div>
          </div>
        </section>
        
        {/* Vision and Mission */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container-content">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('about.mission.title') || "Unsere Mission"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('about.mission.description') || "Unsere Mission ist es, den Zugang zu medizinischem Cannabis für Patienten zu verbessern, indem wir Apotheken in ganz Deutschland zuverlässig mit hochwertigen Produkten beliefern und ihnen dabei helfen, ihre Patienten bestmöglich zu versorgen."}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.mission.point1') || "Zuverlässige Lieferung hochwertiger medizinischer Cannabisprodukte"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.mission.point2') || "Unterstützung von Apotheken bei der Beratung ihrer Patienten"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.mission.point3') || "Förderung der Akzeptanz von medizinischem Cannabis als wirksame Therapieoption"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-first md:order-last">
                <img 
                  src="/lovable-uploads/8bf41eac-d2f2-4214-9aa7-68fd837d1862.png" 
                  alt={t('about.mission.imageAlt') || "Medizinisches Cannabis"} 
                  className="rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Supply Chain */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-content">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/lovable-uploads/b8e522e4-7a6e-483b-8d83-33bf4e6d3014.png" 
                  alt={t('about.supply.imageAlt') || "Lieferkette"} 
                  className="rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('about.supply.title') || "Unsere Lieferkette"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('about.supply.description') || "Wir arbeiten mit vertrauenswürdigen Partnern zusammen, um sicherzustellen, dass alle unsere Produkte strengen Qualitätskontrollen unterzogen werden und den höchsten pharmazeutischen Standards entsprechen."}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.supply.point1') || "Strenge Qualitätskontrollen und Einhaltung aller regulatorischen Anforderungen"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.supply.point2') || "Transparente Lieferkette von der Produktion bis zur Apotheke"}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Check className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('about.supply.point3') || "Nachhaltige und verantwortungsvolle Beschaffungspraktiken"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container-content">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.values.title') || "Unsere Werte"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('about.values.subtitle') || "Diese Grundwerte leiten unsere tägliche Arbeit und alle unsere Entscheidungen."}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-nova-100 dark:bg-nova-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.quality.title') || "Qualität"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.quality.description') || "Wir verpflichten uns, nur Produkte von höchster Qualität anzubieten, die alle geltenden Normen und Vorschriften erfüllen oder übertreffen."}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-nova-100 dark:bg-nova-900/50 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.integrity.title') || "Integrität"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.integrity.description') || "Wir handeln stets ethisch und transparent, um das Vertrauen unserer Kunden, Partner und der Öffentlichkeit zu gewinnen und zu erhalten."}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-nova-100 dark:bg-nova-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-nova-600 dark:text-nova-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.innovation.title') || "Innovation"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.innovation.description') || "Wir streben danach, das Feld der medizinischen Cannabisversorgung durch kontinuierliche Verbesserung und innovative Lösungen voranzutreiben."}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-content">
            <div className="bg-gradient-to-br from-nova-50 to-blue-50 dark:from-nova-900/30 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('about.cta.title') || "Bereit, mit uns zusammenzuarbeiten?"}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {t('about.cta.description') || "Kontaktieren Sie uns noch heute, um mehr darüber zu erfahren, wie wir Ihre Apotheke unterstützen können."}
                </p>
                <Link to="/#contact">
                  <Button size="lg" className="gap-2">
                    <Mail className="h-5 w-5" />
                    {t('about.cta.button') || "Kontaktieren Sie uns"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
