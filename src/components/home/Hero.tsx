
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-1/4 w-72 h-72 rounded-full bg-nova-100/30 dark:bg-nova-900/20 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 w-96 h-96 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-nova-100 text-nova-800 dark:bg-nova-900/50 dark:text-nova-200">
                Pharmaceutical Wholesaler
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Medical Cannabis<br />
              <span className="text-nova-600 dark:text-nova-400">For Pharmacies</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Novacana is a licensed pharmaceutical wholesaler specializing in medical cannabis products for pharmacies throughout Germany.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <a href="#contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </a>
              <Link to="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                  <span>View Products</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Licensed pharmaceutical wholesaler with partial assortment cannabis
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nova-200/30 to-blue-200/30 dark:from-nova-800/20 dark:to-blue-800/20 rounded-2xl blur-xl transform -rotate-6 scale-95"></div>
              <div className="relative glass-card rounded-2xl overflow-hidden shadow-xl p-6 md:p-8 max-w-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-nova-100 to-nova-50 dark:from-nova-900/50 dark:to-nova-800/30 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-nova-700 dark:text-nova-300 text-6xl font-light">Novacana</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quality Medical Cannabis</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    We provide pharmacies with high-quality cannabis products, ensuring reliable supply chains and stringent quality control.
                  </p>
                  <div className="pt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Licensed Wholesaler</span>
                    </div>
                    <Link to="/register" className="text-sm font-medium text-nova-600 dark:text-nova-400 hover:underline">
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
