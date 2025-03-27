
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pharmacyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in production, this would make an API call to send the email
    setTimeout(() => {
      console.log("Contact form submitted:", {
        to: "info@novacana.de",
        from: formData.email,
        subject: `Kontaktanfrage von ${formData.name} (${formData.pharmacyName})`,
        message: formData.message
      });
      
      toast({
        title: t('contact.message.sent') || "Nachricht gesendet",
        description: t('contact.message.confirmation') || "Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.",
      });
      
      setFormData({
        name: "",
        email: "",
        pharmacyName: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-1/4 bottom-0 w-64 h-64 rounded-full bg-nova-100/40 dark:bg-nova-900/20 blur-3xl"></div>
        <div className="absolute left-0 top-1/4 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title') || "Kontakt"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('contact.description') || "Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Kontaktieren Sie unser Team."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card rounded-xl p-6 md:p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form.title') || "Senden Sie uns eine Nachricht"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.form.name') || "Name"}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.form.name.placeholder') || "Ihr Name"}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.form.email') || "E-Mail"}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.form.email.placeholder') || "Ihre E-Mail-Adresse"}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.form.pharmacy') || "Name der Apotheke"}
                </label>
                <Input
                  id="pharmacyName"
                  name="pharmacyName"
                  value={formData.pharmacyName}
                  onChange={handleChange}
                  placeholder={t('contact.form.pharmacy.placeholder') || "Name Ihrer Apotheke"}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('contact.form.message') || "Nachricht"}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.form.message.placeholder') || "Wie können wir Ihnen helfen?"}
                  required
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('contact.form.sending') || "Wird gesendet..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send size={16} className="mr-2" />
                    {t('contact.form.send') || "Nachricht senden"}
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.info.title') || "Kontaktinformationen"}
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPin size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.address') || "Adresse"}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Guerickeweg 5<br />
                      64291 Darmstadt<br />
                      Deutschland
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Phone size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.phone') || "Telefon"}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="tel:+4969945159180" className="hover:text-nova-600 dark:hover:text-nova-400">
                        +49 (0) 69 945159 18
                      </a>
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Mail size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.email') || "E-Mail"}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      <a href="mailto:info@novacana.de" className="hover:text-nova-600 dark:hover:text-nova-400">
                        info@novacana.de
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="glass-card rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('contact.hours.title') || "Geschäftszeiten"}
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-700 dark:text-gray-300">{t('contact.hours.weekdays') || "Montag - Freitag"}</dt>
                  <dd className="text-gray-600 dark:text-gray-400">9:00 - 17:00 Uhr</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-700 dark:text-gray-300">{t('contact.hours.weekend') || "Samstag - Sonntag"}</dt>
                  <dd className="text-gray-600 dark:text-gray-400">{t('contact.hours.closed') || "Geschlossen"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
