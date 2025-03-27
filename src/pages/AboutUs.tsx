import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Leaf, Award, Users, Factory, Truck, Package, Box } from "lucide-react";
const AboutUs = () => {
  const {
    t
  } = useLanguage();
  return <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-green-100/30 dark:bg-green-900/10 blur-3xl"></div>
            <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-gray-200/30 dark:bg-gray-700/10 blur-3xl"></div>
          </div>
          
          <div className="container-content relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t('aboutUs.title') || "Über Novacana"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t('aboutUs.subtitle') || "Unsere Leidenschaft für medizinisches Cannabis und unsere Expertise seit 2019"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('aboutUs.story.title') || "Unsere Geschichte"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('aboutUs.story.p1') || "Novacana wurde 2019 mit einer klaren Vision gegründet: Apotheken in ganz Deutschland mit hochwertigen medizinischen Cannabisprodukten zu versorgen."}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('aboutUs.story.p2') || "Was als kleine Initiative begann, ist heute zu einem führenden pharmazeutischen Großhändler mit Teilsortiment Cannabis herangewachsen, der für Qualität, Zuverlässigkeit und Fachwissen steht."}
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    WDA
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    GDP
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    MedCanG
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-200/30 to-blue-200/30 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl blur-xl transform rotate-2 scale-95"></div>
                <Card className="relative overflow-hidden border-0 shadow-xl">
                  <img alt="Medizinisches Cannabis" className="w-full h-auto object-cover" onError={e => {
                  console.error("Image failed to load:", e);
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/800x400/gray/white?text=Medizinisches+Cannabis";
                }} src="https://media.istockphoto.com/id/1175657274/photo/hospital-indoor-storage-room-health-center-repository.jpg?s=612x612&w=0&k=20&c=st6kLOWp84yP38IRStwApk7bOLuEpSaMIH13AlHCjqY=" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.established') || "Gegründet 2019"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('aboutUs.mission') || "Unsere Mission ist es, den Zugang zu hochwertigen medizinischen Cannabisprodukten für Patienten in ganz Deutschland zu verbessern."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Supply Chain Section */}
            <div className="mb-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                {t('aboutUs.supplyChain.title') || "Unsere Supply Chain"}
              </h2>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 overflow-hidden">
                <img src="/lovable-uploads/b8e522e4-7a6e-483b-8d83-33bf4e6d3014.png" alt="Supply Chain" className="w-full h-auto rounded-xl mb-8" onError={e => {
                console.error("Supply Chain image failed to load:", e);
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/1200x600/gray/white?text=Supply+Chain";
              }} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4">
                      <Factory size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.supplyChain.production') || "Produktion"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.supplyChain.production.desc') || "Sorgfältige Auswahl von Premium-Cannabisproduzenten mit höchsten Qualitätsstandards"}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4">
                      <Package size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.supplyChain.quality') || "Qualitätskontrolle"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.supplyChain.quality.desc') || "Jedes Produkt durchläuft strenge Qualitätsprüfungen"}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 mb-4">
                      <Truck size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t('aboutUs.supplyChain.delivery') || "Lieferung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.supplyChain.delivery.desc') || "Sichere und schnelle Lieferung an Apotheken in ganz Deutschland"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                {t('aboutUs.passion.title') || "Unsere Leidenschaft für Cannabis"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                      <Leaf size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {t('aboutUs.passion.quality.title') || "Höchste Qualitätsstandards"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.quality.desc') || "Wir arbeiten nur mit Produzenten zusammen, die unsere strengen Qualitätsstandards erfüllen, um pharmazeutisch hochwertige Produkte zu garantieren."}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                      <Box size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {t('aboutUs.passion.research.title') || "Forschung & Entwicklung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.research.desc') || "Wir investieren kontinuierlich in die Forschung, um unser Verständnis von Cannabis und seinen therapeutischen Eigenschaften zu vertiefen."}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {t('aboutUs.passion.education.title') || "Bildung & Aufklärung"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('aboutUs.passion.education.desc') || "Wir setzen uns für die Aufklärung über die therapeutischen Vorteile von medizinischem Cannabis ein und teilen unser Wissen mit Apotheken und medizinischen Fachkräften."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-24">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t('aboutUs.terpenes.title') || "Unsere Expertise: Terpene in Cannabis"}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {t('aboutUs.terpenes.intro') || "Terpene sind aromatische Verbindungen, die dem Cannabis seinen charakteristischen Geruch verleihen und entscheidend zu seinen therapeutischen Eigenschaften beitragen. Bei Novacana haben wir ein besonderes Augenmerk auf das Terpen-Profil unserer Produkte."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('aboutUs.terpenes.benefits.title') || "Therapeutische Vorteile"}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.1') || "Myrcen – bekannt für seine beruhigenden und muskelentspannenden Eigenschaften"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.2') || "Limonen – kann Stimmung verbessern und hat antibakterielle Eigenschaften"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.3') || "Pinen – kann Entzündungen reduzieren und die Atemwege öffnen"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {t('aboutUs.terpenes.benefits.4') || "Linalool – bekannt für seine beruhigenden und angstlösenden Eigenschaften"}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('aboutUs.terpenes.entourage.title') || "Der Entourage-Effekt"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('aboutUs.terpenes.entourage.desc') || "Unsere Expertise liegt im Verständnis des 'Entourage-Effekts' – wie Cannabinoide und Terpene zusammenwirken, um therapeutische Wirkungen zu verstärken. Durch sorgfältige Analyse und Auswahl bieten wir Produkte mit optimalen Terpen-Profilen für verschiedene medizinische Anwendungen."}
                  </p>
                  <div className="flex items-center mt-4">
                    <Award size={20} className="text-amber-500 dark:text-amber-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t('aboutUs.terpenes.expertise') || "Spezialisiert auf terpenreiche Cannabissorten"}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('aboutUs.terpenes.conclusion') || "Durch unser tiefgreifendes Verständnis der Terpene können wir Apotheken und Ärzten dabei helfen, die am besten geeigneten Cannabisprodukte für die individuellen Bedürfnisse ihrer Patienten auszuwählen."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default AboutUs;