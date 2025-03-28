
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute right-0 bottom-1/2 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"></div>
            <div className="absolute left-20 top-1/3 w-72 h-72 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl"></div>
          </div>
          
          <div className="container-content relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block animate-fade-in text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('about.badge') || "About Novacana"}
              </span>
              <h1 className="animate-fade-in text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('about.heroTitle') || "Your Trusted Partner for Medical Cannabis"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
                {t('about.heroDesc') || "We are dedicated to providing high-quality medical cannabis products to pharmacies throughout Germany with exceptional service and expertise."}
              </p>
            </div>
          </div>
        </section>
        
        {/* About Content */}
        <section className="py-16 relative overflow-hidden">
          <div className="container-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('about.mission.badge') || "Our Mission"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {t('about.mission.title') || "Advancing Healthcare Through Quality Products"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('about.mission.desc') || "Founded in 2019, Novacana is committed to becoming the leading pharmaceutical wholesaler specializing in medical cannabis products in Germany. We connect licensed producers with pharmacies to ensure patients receive the highest quality treatments."}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t('about.quality') || "Highest Quality"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('about.quality.desc') || "We only work with producers who meet our strict quality standards."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t('about.expertise') || "Expert Knowledge"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('about.expertise.desc') || "Our team has deep knowledge of medical cannabis and its therapeutic applications."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t('about.reliability') || "Reliability"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('about.reliability.desc') || "Count on our reliable delivery and consistent product quality."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/30 to-gray-300/30 dark:from-gray-800/20 dark:to-gray-700/20 rounded-2xl blur-xl transform rotate-3 scale-95"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/lovable-uploads/b8e522e4-7a6e-483b-8d83-33bf4e6d3014.png" 
                    alt={t('aboutUs.supplyChain.title') || "Our Supply Chain"} 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/1170x640/gray/white?text=Supply+Chain";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('aboutUs.supplyChain.title') || "Our Supply Chain"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {t('aboutUs.supplyChain.description') || "From producer to pharmacy - quality at every step"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container-content">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('about.values.badge') || "Our Values"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('about.values.title') || "What Drives Us Forward"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('about.values.desc') || "At Novacana, our core values guide everything we do, from product selection to customer service."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.quality.title') || "Quality First"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.quality.desc') || "We never compromise on product quality, ensuring every item meets the highest pharmaceutical standards."}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.transparency.title') || "Transparency"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.transparency.desc') || "We believe in open and honest communication with our pharmacy partners and producers."}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('about.values.innovation.title') || "Innovation"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.values.innovation.desc') || "We continuously seek new products and solutions to improve patient care and pharmacy operations."}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-800/30 dark:to-transparent"></div>
          </div>
          
          <div className="container-content relative z-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('about.cta.title') || "Join Our Network of Trusted Pharmacies"}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t('about.cta.desc') || "Become a partner with Novacana and gain access to our premium selection of medical cannabis products and expert support."}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                    {t('about.cta.register') || "Register Now"}
                  </Button>
                </Link>
                <Link to="/#contact">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8">
                    {t('about.cta.contact') || "Contact Us"}
                    <ArrowRight size={16} className="ml-2" />
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
