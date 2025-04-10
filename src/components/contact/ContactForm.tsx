
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  pharmacyName: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Senden der Kontaktanfrage über die Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          pharmacyName: formData.pharmacyName,
          message: formData.message
        }
      });
      
      if (error) {
        throw new Error(error.message || "Fehler beim Senden der Nachricht");
      }
      
      console.log("Kontaktformular erfolgreich gesendet:", {
        from: "noreply@novacana.de",
        to: "info@novacana.de",
        subject: `Kontaktanfrage von ${formData.name} (${formData.pharmacyName || 'Keine Apotheke angegeben'})`,
        message: formData.message
      });
      
      toast({
        title: t('contact.message.sent') || "Nachricht gesendet",
        description: t('contact.message.confirmation') || "Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.",
      });
      
      // Formular zurücksetzen
      setFormData({
        name: "",
        email: "",
        pharmacyName: "",
        message: "",
      });
    } catch (error) {
      console.error("Fehler beim Senden des Kontaktformulars:", error);
      
      toast({
        title: t('contact.message.error') || "Fehler",
        description: t('contact.message.error.description') || "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`glass-card rounded-xl p-6 md:p-8 shadow-lg ${className}`}>
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
  );
};

export default ContactForm;
