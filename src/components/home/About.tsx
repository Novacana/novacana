
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const About = () => {
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
                      Good Manufacturing Practice Certified
                    </span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-nova-50 to-white dark:from-nova-800/30 dark:to-gray-900/50 rounded-lg p-4 flex items-center justify-center">
                    <span className="text-gray-800 dark:text-white text-sm font-medium text-center">
                      Pharmaceutical Wholesale License
                    </span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-nova-100 to-nova-50 dark:from-nova-900/50 dark:to-nova-800/30 rounded-lg flex items-center justify-center">
                    <span className="text-nova-700 dark:text-nova-300 text-4xl font-bold">GDP</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Regulatory Compliance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    All our operations strictly adhere to pharmaceutical regulations in Germany, ensuring the highest quality and safety standards.
                  </p>
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 inline-block rounded-full px-3 py-1 bg-gray-100 dark:bg-gray-800">
                      Established 2020
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block animate-fade-in text-sm font-medium text-nova-600 dark:text-nova-400 mb-2">
              About Novacana
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Your Trusted Partner for Medical Cannabis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Founded in 2020, Novacana GmbH is a licensed pharmaceutical wholesaler specializing in medical cannabis products for pharmacies throughout Germany.
            </p>
            
            <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-start">
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Quality Assurance</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every product in our assortment undergoes rigorous quality control to ensure it meets the highest pharmaceutical standards.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Expertise</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our team consists of pharmaceutical experts with extensive knowledge of medical cannabis products and regulations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle size={20} className="text-nova-600 dark:text-nova-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Reliability</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We maintain robust supply chains and inventory management to ensure pharmacies receive their orders promptly and reliably.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/register">
                <Button size="lg">
                  Register as a Pharmacy
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
