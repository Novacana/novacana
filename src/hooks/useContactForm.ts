
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateField } from "@/utils/formValidation";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  pharmacyName: string;
  message: string;
}

export const useContactForm = (translations: {
  sentTitle: string;
  sentMessage: string;
  errorTitle: string;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    pharmacyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing again
    if (formError) {
      setFormError(null);
    }
  };

  const validateForm = (): string | null => {
    // Check name
    const nameError = validateField('Ihren Namen', formData.name);
    if (nameError) return nameError;
    
    // Check email
    const emailError = validateField('Ihre E-Mail-Adresse', formData.email);
    if (emailError) return emailError;
    
    // Check message
    const messageError = validateField('eine Nachricht', formData.message);
    if (messageError) return messageError;
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset form error
    setFormError(null);
    
    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending contact form data:", formData);
      
      // Invoke the Edge Function
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          pharmacyName: formData.pharmacyName,
          message: formData.message
        }
      });
      
      console.log("Edge function response:", { data, error });
      
      if (error) {
        throw new Error(error.message || "Fehler beim Senden der Nachricht");
      }
      
      if (!data || !data.success) {
        throw new Error(data?.error || "Unbekannter Fehler beim Senden der Nachricht");
      }
      
      toast({
        title: translations.sentTitle,
        description: translations.sentMessage,
      });
      
      // Reset form data
      setFormData({
        name: "",
        email: "",
        pharmacyName: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      
      let errorMessage = error.message;
      if (typeof error === 'object' && error !== null) {
        if (error.error === "Edge Function returned a non-2xx status code") {
          errorMessage = "Das Kontaktformular kann derzeit nicht gesendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.";
        }
      }
      
      setFormError(errorMessage || translations.errorTitle);
      
      toast({
        title: translations.errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    formError,
    handleChange,
    handleSubmit
  };
};
