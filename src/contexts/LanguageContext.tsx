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
    'features.cta.title': 'Beginnen Sie heute mit Novacana',
    'features.cta.description': 'Entdecken Sie unsere breite Palette an hochwertigen medizinischen Cannabisprodukten und erfahren Sie, wie wir Ihnen als Apotheke helfen können.',
    'features.cta.button': 'Kontaktieren Sie uns',
    
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
    'about.card.established': 'Gegründet 2019',
    'about.card.gmp.desc': 'Good Manufacturing Practice zertifiziert',
    'about.card.gdp': 'GDP-Zertifiziert',
    'about.card.wholesaler': 'Großhandelserlaubnis',
    
    // Supply Chain
    'aboutUs.supplyChain.title': 'Unsere Lieferkette',
    'aboutUs.supplyChain.description': 'Wir sorgen für eine lückenlose und transparente Lieferkette, um die höchste Qualität und Sicherheit unserer medizinischen Cannabisprodukte zu gewährleisten.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.description': 'Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Kontaktieren Sie unser Team.',
    'contact.form.title': 'Senden Sie uns eine Nachricht',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Ihr Name',
    'contact.form.email': 'E-Mail',
    'contact.form.email.placeholder': 'Ihre E-Mail-Adresse',
    'contact.form.pharmacy': 'Name der Apotheke',
    'contact.form.pharmacy.placeholder': 'Name Ihrer Apotheke',
    'contact.form.message': 'Nachricht',
    'contact.form.message.placeholder': 'Wie können wir Ihnen helfen?',
    'contact.form.sending': 'Wird gesendet...',
    'contact.form.send': 'Nachricht senden',
    'contact.message.sent': 'Nachricht gesendet',
    'contact.message.confirmation': 'Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.',
    'contact.info.title': 'Kontaktinformationen',
    'contact.info.address': 'Adresse',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'E-Mail',
    'contact.hours.title': 'Geschäftszeiten',
    'contact.hours.weekdays': 'Montag - Freitag',
    'contact.hours.weekend': 'Samstag - Sonntag',
    'contact.hours.closed': 'Geschlossen',
    
    // About Us Page
    'aboutUs.title': 'Über Novacana',
    'aboutUs.subtitle': 'Unsere Leidenschaft für medizinisches Cannabis und unsere Expertise seit 2019',
    'aboutUs.story.title': 'Unsere Geschichte',
    'aboutUs.story.p1': 'Novacana wurde 2019 mit einer klaren Vision gegründet: Apotheken in ganz Deutschland mit hochwertigen medizinischen Cannabisprodukten zu versorgen.',
    'aboutUs.story.p2': 'Was als kleine Initiative begann, ist heute zu einem führenden pharmazeutischen Großhändler mit Teilsortiment Cannabis herangewachsen, der für Qualität, Zuverlässigkeit und Fachwissen steht.',
    'aboutUs.established': 'Gegründet 2019',
    'aboutUs.mission': 'Unsere Mission ist es, den Zugang zu hochwertigen medizinischen Cannabisprodukten für Patienten in ganz Deutschland zu verbessern.',
    'aboutUs.passion.title': 'Unsere Leidenschaft für Cannabis',
    'aboutUs.passion.quality.title': 'Höchste Qualitätsstandards',
    'aboutUs.passion.quality.desc': 'Wir arbeiten nur mit Produzenten zusammen, die unsere strengen Qualitätsstandards erfüllen, um pharmazeutisch hochwertige Produkte zu garantieren.',
    'aboutUs.passion.research.title': 'Forschung & Entwicklung',
    'aboutUs.passion.research.desc': 'Wir investieren kontinuierlich in die Forschung, um unser Verständnis von Cannabis und seinen therapeutischen Eigenschaften zu vertiefen.',
    'aboutUs.passion.education.title': 'Bildung & Aufklärung',
    'aboutUs.passion.education.desc': 'Wir setzen uns für die Aufklärung über die therapeutischen Vorteile von medizinischem Cannabis ein und teilen unser Wissen mit Apotheken und medizinischen Fachkräften.',
    'aboutUs.terpenes.title': 'Unsere Expertise: Terpene in Cannabis',
    'aboutUs.terpenes.intro': 'Terpene sind aromatische Verbindungen, die dem Cannabis seinen charakteristischen Geruch verleihen und entscheidend zu seinen therapeutischen Eigenschaften beitragen. Bei Novacana haben wir ein besonderes Augenmerk auf das Terpen-Profil unserer Produkte.',
    'aboutUs.terpenes.benefits.title': 'Therapeutische Vorteile',
    'aboutUs.terpenes.benefits.1': 'Myrcen – bekannt für seine beruhigenden und muskelentspannenden Eigenschaften',
    'aboutUs.terpenes.benefits.2': 'Limonen – kann Stimmung verbessern und hat antibakterielle Eigenschaften',
    'aboutUs.terpenes.benefits.3': 'Pinen – kann Entzündungen reduzieren und die Atemwege öffnen',
    'aboutUs.terpenes.benefits.4': 'Linalool – bekannt für seine beruhigenden und angstlösenden Eigenschaften',
    'aboutUs.terpenes.entourage.title': 'Der Entourage-Effekt',
    'aboutUs.terpenes.entourage.desc': 'Unsere Expertise liegt im Verständnis des "Entourage-Effekts" – wie Cannabinoide und Terpene zusammenwirken, um therapeutische Wirkungen zu verstärken. Durch sorgfältige Analyse und Auswahl bieten wir Produkte mit optimalen Terpen-Profilen für verschiedene medizinische Anwendungen.',
    'aboutUs.terpenes.expertise': 'Spezialisiert auf terpenreiche Cannabissorten',
    'aboutUs.terpenes.conclusion': 'Durch unser tiefgreifendes Verständnis der Terpene können wir Apotheken und Ärzten dabei helfen, die am besten geeigneten Cannabisprodukte für die individuellen Bedürfnisse ihrer Patienten auszuwählen.',
    
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
    'features.cta.title': 'Get Started with Novacana Today',
    'features.cta.description': 'Discover our wide range of high-quality medical cannabis products and learn how we can assist your pharmacy.',
    'features.cta.button': 'Contact Us',
    
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
    'about.card.established': 'Established 2019',
    'about.card.gmp.desc': 'Good Manufacturing Practice Certified',
    'about.card.gdp': 'GDP Certified',
    'about.card.wholesaler': 'Pharmaceutical Wholesale License',
    
    // Supply Chain
    'aboutUs.supplyChain.title': 'Our Supply Chain',
    'aboutUs.supplyChain.description': 'We ensure a seamless and transparent supply chain to guarantee the highest quality and safety of our medical cannabis products.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Have questions about our products or services? Reach out to our team.',
    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'Your email address',
    'contact.form.pharmacy': 'Pharmacy Name',
    'contact.form.pharmacy.placeholder': 'Your pharmacy name',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'How can we help you?',
    'contact.form.sending': 'Sending...',
    'contact.form.send': 'Send Message',
    'contact.message.sent': 'Message Sent',
    'contact.message.confirmation': 'Thank you for your message. We will get back to you shortly.',
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.hours.title': 'Business Hours',
    'contact.hours.weekdays': 'Monday - Friday',
    'contact.hours.weekend': 'Saturday - Sunday',
    'contact.hours.closed': 'Closed',
    
    // About Us Page
    'aboutUs.title': 'About Novacana',
    'aboutUs.subtitle': 'Our passion for medical cannabis and expertise since 2019',
    'aboutUs.story.title': 'Our Story',
    'aboutUs.story.p1': 'Novacana was founded in 2019 with a clear vision: to supply pharmacies throughout Germany with high-quality medical cannabis products.',
    'aboutUs.story.p2': 'What began as a small initiative has now grown into a leading pharmaceutical wholesaler with a partial assortment of cannabis, known for quality, reliability, and expertise.',
    'aboutUs.established': 'Established 2019',
    'aboutUs.mission': 'Our mission is to improve access to high-quality medical cannabis products for patients throughout Germany.',
    'aboutUs.passion.title': 'Our Passion for Cannabis',
    'aboutUs.passion.quality.title': 'Highest Quality Standards',
    'aboutUs.passion.quality.desc': 'We only work with producers who meet our strict quality standards to guarantee pharmaceutical-grade products.',
    'aboutUs.passion.research.title': 'Research & Development',
    'aboutUs.passion.research.desc': 'We continuously invest in research to deepen our understanding of cannabis and its therapeutic properties.',
    'aboutUs.passion.education.title': 'Education & Awareness',
    'aboutUs.passion.education.desc': 'We are committed to educating about the therapeutic benefits of medical cannabis and sharing our knowledge with pharmacies and healthcare professionals.',
    'aboutUs.terpenes.title': 'Our Expertise: Terpene in Cannabis',
    'aboutUs.terpenes.intro': 'Terpene are aromatic compounds that give cannabis its characteristic smell and contribute significantly to its therapeutic properties. At Novacana, we pay special attention to the terpene profile of our products.',
    'aboutUs.terpenes.benefits.title': 'Therapeutic Benefits',
    'aboutUs.terpenes.benefits.1': 'Myrcene – known for its sedative and muscle relaxant properties',
    'aboutUs.terpenes.benefits.2': 'Limonene – can improve mood and has antibacterial properties',
    'aboutUs.terpenes.benefits.3': 'Pinene – can reduce inflammation and open airways',
    'aboutUs.terpenes.benefits.4': 'Linalool – known for its calming and anxiety-reducing properties',
    'aboutUs.terpenes.entourage.title': 'The Entourage Effect',
    'aboutUs.terpenes.entourage.desc': 'Our expertise lies in understanding the "entourage effect" – how cannabinoids and terpenes work together to enhance therapeutic effects. Through careful analysis and selection, we offer products with optimal terpene profiles for various medical applications.',
    'aboutUs.terpenes.expertise': 'Specialized in terpene-rich cannabis varieties',
    'aboutUs.terpenes.conclusion': 'Through our deep understanding of terpenes, we can help pharmacies and doctors select the most appropriate cannabis products for their patients\' individual needs.',
    
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
