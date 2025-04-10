
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full bg-nova-50/30 dark:bg-nova-900/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 rounded-full bg-blue-50/20 dark:bg-blue-900/5 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="container-content relative z-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {t('hero.title') || "Ihre Partner für medizinische Cannabis-Produkte"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('hero.subtitle') || "Wir beliefern Apotheken in ganz Deutschland mit hochwertigen Cannabis-basierten Arzneimitteln und bieten einen vollständigen Kundenservice."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={scrollToContact}
              >
                {t('hero.contact') || "Kontaktieren Sie uns"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('hero.about') || "Über uns"}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="/lovable-uploads/8e38db3b-c618-4827-bc84-c89ef43ebef7.png"
              alt={t('hero.imageAlt') || "Medizinisches Cannabis"}
              className="max-w-full rounded-2xl shadow-xl"
              style={{ maxHeight: "70vh" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error("Hero image could not be loaded", e);
                target.src = "/placeholder.svg";
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
