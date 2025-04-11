
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ContactFormField from "@/components/contact/ContactFormField";
import ContactSubmitButton from "@/components/contact/ContactSubmitButton";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const { t } = useLanguage();
  
  const translations = {
    sentTitle: t('contact.message.sent') || "Nachricht gesendet",
    sentMessage: t('contact.message.confirmation') || "Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.",
    errorTitle: t('contact.message.error') || "Fehler"
  };
  
  const {
    formData,
    isSubmitting,
    formError,
    handleChange,
    handleSubmit
  } = useContactForm(translations);

  return (
    <div className={`glass-card rounded-xl p-6 md:p-8 shadow-lg ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('contact.form.title') || "Senden Sie uns eine Nachricht"}
      </h3>
      
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <ContactFormField
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('contact.form.name.placeholder') || "Ihr Name"}
          required
          label={t('contact.form.name') || "Name"}
        />
        
        <ContactFormField
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('contact.form.email.placeholder') || "Ihre E-Mail-Adresse"}
          required
          label={t('contact.form.email') || "E-Mail"}
        />
        
        <ContactFormField
          id="pharmacyName"
          name="pharmacyName"
          value={formData.pharmacyName}
          onChange={handleChange}
          placeholder={t('contact.form.pharmacy.placeholder') || "Name Ihrer Apotheke"}
          label={t('contact.form.pharmacy') || "Name der Apotheke"}
        />
        
        <ContactFormField
          id="message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('contact.form.message.placeholder') || "Wie können wir Ihnen helfen?"}
          required
          label={t('contact.form.message') || "Nachricht"}
        />
        
        <ContactSubmitButton 
          isSubmitting={isSubmitting}
          submitText={t('contact.form.send') || "Nachricht senden"}
          loadingText={t('contact.form.sending') || "Wird gesendet..."}
        />
      </form>
    </div>
  );
};

export default ContactForm;
