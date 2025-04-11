
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  pharmacyName: string;
  message: string;
}

interface ContactFormProps {
  successMessage: string;
  errorMessage: string;
}

export const useContact = ({ successMessage, errorMessage }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    pharmacyName: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error when user starts typing again
    if (formError) {
      setFormError(null);
    }
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.name.trim()) {
      setFormError("Bitte geben Sie Ihren Namen ein.");
      return false;
    }

    if (!formData.email.trim()) {
      setFormError("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return false;
    }

    if (!formData.message.trim()) {
      setFormError("Bitte geben Sie eine Nachricht ein.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      pharmacyName: "",
      message: ""
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting contact form:", formData);

      // Call the edge function
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

      if (!data?.success) {
        throw new Error(data?.error || "Es ist ein Fehler aufgetreten");
      }

      // Show success message
      toast({
        title: "Nachricht gesendet",
        description: successMessage,
      });

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error("Contact form error:", error);

      // Show error message
      setFormError(error.message || errorMessage);
      toast({
        title: "Fehler",
        description: error.message || errorMessage,
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
    submitForm,
    resetForm
  };
};
