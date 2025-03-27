
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'de' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Übersetzungen
const translations = {
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.dashboard': 'Dashboard',
    'nav.cart': 'Warenkorb',
    'nav.logout': 'Abmelden',
    
    // Home Hero
    'hero.badge': 'Cannabisgroßhandel',
    'hero.title': 'Medizinisches Cannabis',
    'hero.subtitle': 'Für Apotheken',
    'hero.description': 'Novacana ist Ihr zuverlässiger Partner für die Versorgung von Apotheken mit medizinischen Cannabisprodukten in ganz Deutschland.',
    'hero.cta.contact': 'Kontaktieren Sie uns',
    'hero.cta.register': 'Als Apotheke registrieren',
    'hero.cta.products': 'Produkte ansehen',
    'hero.license': 'Lizenzierter pharmazeutischer Großhandel mit Teilsortiment Cannabis',
    'hero.card.title': 'Qualitativ hochwertiges medizinisches Cannabis',
    'hero.card.description': 'Wir versorgen Apotheken mit hochwertigen Cannabisprodukten und gewährleisten zuverlässige Lieferketten und strenge Qualitätskontrolle.',
    'hero.card.status': 'Lizenzierter Großhändler',
    'hero.card.action': 'Jetzt registrieren',
    
    // Features
    'features.title': 'Warum Novacana wählen',
    'features.description': 'Als lizenzierter pharmazeutischer Großhändler bieten wir Apotheken zuverlässigen Zugang zu hochwertigen medizinischen Cannabisprodukten.',
    'features.pharmaceutical': 'Pharmazeutische Qualität',
    'features.pharmaceutical.desc': 'Alle unsere Produkte erfüllen höchste pharmazeutische Standards und entsprechen den deutschen Vorschriften.',
    'features.delivery': 'Schnelle Lieferung',
    'features.delivery.desc': 'Wir gewährleisten eine schnelle und zuverlässige Lieferung an Apotheken in ganz Deutschland.',
    'features.quality': 'Garantierte Qualität',
    'features.quality.desc': 'Jedes Produkt durchläuft eine strenge Qualitätskontrolle, bevor es in unser Sortiment aufgenommen wird.',
    'features.selection': 'Große Auswahl',
    'features.selection.desc': 'Wir bieten ein umfassendes Sortiment an medizinischen Cannabisprodukten, um den Bedürfnissen der Patienten gerecht zu werden.',
    'features.support': '24/7 Support',
    'features.support.desc': 'Unser engagiertes Kundendienstteam steht Ihnen jederzeit zur Verfügung.',
    'features.documentation': 'Vereinfachte Dokumentation',
    'features.documentation.desc': 'Wir kümmern uns um alle notwendigen Unterlagen und erleichtern den Bestellprozess für Apotheken.',
    
    // About
    'about.badge': 'Über Novacana',
    'about.title': 'Ihr vertrauenswürdiger Partner für medizinisches Cannabis',
    'about.description': 'Novacana ist ein lizenzierter pharmazeutischer Großhändler, der sich auf medizinische Cannabisprodukte für Apotheken in ganz Deutschland spezialisiert hat.',
    'about.quality': 'Qualitätssicherung',
    'about.quality.desc': 'Jedes Produkt in unserem Sortiment durchläuft eine strenge Qualitätskontrolle, um sicherzustellen, dass es die höchsten pharmazeutischen Standards erfüllt.',
    'about.expertise': 'Expertise',
    'about.expertise.desc': 'Unser Team besteht aus pharmazeutischen Experten mit umfangreichem Wissen über medizinische Cannabisprodukte und Vorschriften.',
    'about.reliability': 'Zuverlässigkeit',
    'about.reliability.desc': 'Wir unterhalten robuste Lieferketten und Bestandsmanagement, um sicherzustellen, dass Apotheken ihre Bestellungen pünktlich und zuverlässig erhalten.',
    'about.button': 'Als Apotheke registrieren',
    'about.card.title': 'Regulatorische Konformität',
    'about.card.description': 'Alle unsere Aktivitäten halten sich strikt an die pharmazeutischen Vorschriften in Deutschland und gewährleisten höchste Qualitäts- und Sicherheitsstandards.',
    'about.card.established': 'Gegründet 2020',
    'about.card.gmp': 'GMP-Zertifiziert',
    'about.card.gmp.desc': 'Good Manufacturing Practice zertifiziert',
    'about.card.gdp': 'GDP-Zertifiziert',
    'about.card.wholesaler': 'Großhandelserlaubnis',
    
    // Dashboard
    'dashboard.title': 'Apotheken Dashboard',
    'dashboard.orders.total': 'Alle Bestellungen',
    'dashboard.orders.pending': 'Ausstehende Bestellungen',
    'dashboard.orders.transit': 'In Lieferung',
    'dashboard.orders.delivered': 'Gelieferte Bestellungen',
    'dashboard.orders.all.time': 'Insgesamt',
    'dashboard.orders.to.process': 'Zu bearbeiten',
    'dashboard.orders.in.shipment': 'In Versand',
    'dashboard.orders.completed': 'Abgeschlossen',
    'dashboard.actions.orders': 'Bestellungen',
    'dashboard.actions.profile': 'Profil',
    'dashboard.actions.documents': 'Dokumente',
    'dashboard.actions.settings': 'Einstellungen',
    'dashboard.your.orders': 'Ihre Bestellungen',
    'dashboard.order.products': 'Produkte bestellen',
    'dashboard.table.orderNo': 'Bestellnr.',
    'dashboard.table.date': 'Datum',
    'dashboard.table.status': 'Status',
    'dashboard.table.items': 'Artikel',
    'dashboard.table.total': 'Summe',
    'dashboard.table.actions': 'Aktionen',
    'dashboard.status.delivered': 'Geliefert',
    'dashboard.status.shipped': 'Versandt',
    'dashboard.status.processing': 'In Bearbeitung',
    'dashboard.logout': 'Abmelden',
    
    // Language
    'language': 'Sprache',
    'language.de': 'Deutsch',
    'language.en': 'Englisch',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.cart': 'Cart',
    'nav.logout': 'Logout',
    
    // Home Hero
    'hero.badge': 'Cannabis Wholesaler',
    'hero.title': 'Medical Cannabis',
    'hero.subtitle': 'For Pharmacies',
    'hero.description': 'Novacana is your reliable partner for supplying pharmacies with medical cannabis products throughout Germany.',
    'hero.cta.contact': 'Contact Us',
    'hero.cta.register': 'Register as Pharmacy',
    'hero.cta.products': 'View Products',
    'hero.license': 'Licensed pharmaceutical wholesaler with partial assortment cannabis',
    'hero.card.title': 'Quality Medical Cannabis',
    'hero.card.description': 'We provide pharmacies with high-quality cannabis products, ensuring reliable supply chains and stringent quality control.',
    'hero.card.status': 'Licensed Wholesaler',
    'hero.card.action': 'Register Now',
    
    // Features
    'features.title': 'Why Choose Novacana',
    'features.description': 'As a licensed pharmaceutical wholesaler, we provide reliable access to high-quality medical cannabis products for pharmacies.',
    'features.pharmaceutical': 'Pharmaceutical Grade',
    'features.pharmaceutical.desc': 'All our products meet the highest pharmaceutical standards and comply with German regulations.',
    'features.delivery': 'Rapid Delivery',
    'features.delivery.desc': 'We ensure fast and reliable delivery to pharmacies throughout Germany.',
    'features.quality': 'Quality Guaranteed',
    'features.quality.desc': 'Every product undergoes strict quality control before being added to our assortment.',
    'features.selection': 'Wide Selection',
    'features.selection.desc': 'We offer a comprehensive range of medical cannabis products to meet patient needs.',
    'features.support': '24/7 Support',
    'features.support.desc': 'Our dedicated customer service team is available to assist you whenever needed.',
    'features.documentation': 'Simplified Documentation',
    'features.documentation.desc': 'We handle all necessary documentation, making the ordering process easier for pharmacies.',
    
    // About
    'about.badge': 'About Novacana',
    'about.title': 'Your Trusted Partner for Medical Cannabis',
    'about.description': 'Novacana is a licensed pharmaceutical wholesaler specializing in medical cannabis products for pharmacies throughout Germany.',
    'about.quality': 'Quality Assurance',
    'about.quality.desc': 'Every product in our assortment undergoes rigorous quality control to ensure it meets the highest pharmaceutical standards.',
    'about.expertise': 'Expertise',
    'about.expertise.desc': 'Our team consists of pharmaceutical experts with extensive knowledge of medical cannabis products and regulations.',
    'about.reliability': 'Reliability',
    'about.reliability.desc': 'We maintain robust supply chains and inventory management to ensure pharmacies receive their orders promptly and reliably.',
    'about.button': 'Register as a Pharmacy',
    'about.card.title': 'Regulatory Compliance',
    'about.card.description': 'All our operations strictly adhere to pharmaceutical regulations in Germany, ensuring the highest quality and safety standards.',
    'about.card.established': 'Established 2020',
    'about.card.gmp': 'GMP Certified',
    'about.card.gmp.desc': 'Good Manufacturing Practice Certified',
    'about.card.gdp': 'GDP Certified',
    'about.card.wholesaler': 'Pharmaceutical Wholesale License',
    
    // Dashboard
    'dashboard.title': 'Pharmacy Dashboard',
    'dashboard.orders.total': 'Total Orders',
    'dashboard.orders.pending': 'Pending Orders',
    'dashboard.orders.transit': 'In Transit',
    'dashboard.orders.delivered': 'Delivered',
    'dashboard.orders.all.time': 'All time',
    'dashboard.orders.to.process': 'To be processed',
    'dashboard.orders.in.shipment': 'Orders in shipment',
    'dashboard.orders.completed': 'Completed orders',
    'dashboard.actions.orders': 'Orders',
    'dashboard.actions.profile': 'Profile',
    'dashboard.actions.documents': 'Documents',
    'dashboard.actions.settings': 'Settings',
    'dashboard.your.orders': 'Your Orders',
    'dashboard.order.products': 'Order Products',
    'dashboard.table.orderNo': 'Order No.',
    'dashboard.table.date': 'Date',
    'dashboard.table.status': 'Status',
    'dashboard.table.items': 'Items',
    'dashboard.table.total': 'Total',
    'dashboard.table.actions': 'Actions',
    'dashboard.status.delivered': 'Delivered',
    'dashboard.status.shipped': 'Shipped',
    'dashboard.status.processing': 'Processing',
    'dashboard.logout': 'Log Out',
    
    // Language
    'language': 'Language',
    'language.de': 'German',
    'language.en': 'English',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    // Lese gespeicherte Sprache aus localStorage, falls vorhanden
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage as Language);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
