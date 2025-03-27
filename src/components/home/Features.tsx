
import React from "react";
import { Leaf, Shield, Truck, Award, Clock, FileCheck } from "lucide-react";

const features = [
  {
    title: "Pharmaceutical Grade",
    description: "All our products meet the highest pharmaceutical standards and comply with German regulations.",
    icon: Shield,
  },
  {
    title: "Rapid Delivery",
    description: "We ensure fast and reliable delivery to pharmacies throughout Germany.",
    icon: Truck,
  },
  {
    title: "Quality Guaranteed",
    description: "Every product undergoes strict quality control before being added to our assortment.",
    icon: Award,
  },
  {
    title: "Wide Selection",
    description: "We offer a comprehensive range of medical cannabis products to meet patient needs.",
    icon: Leaf,
  },
  {
    title: "24/7 Support",
    description: "Our dedicated customer service team is available to assist you whenever needed.",
    icon: Clock,
  },
  {
    title: "Simplified Documentation",
    description: "We handle all necessary documentation, making the ordering process easier for pharmacies.",
    icon: FileCheck,
  },
];

const Features = () => {
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
            Why Choose Novacana
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            As a licensed pharmaceutical wholesaler, we provide reliable access to high-quality medical cannabis products for pharmacies.
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
