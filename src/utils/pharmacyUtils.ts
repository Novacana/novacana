
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VerificationData {
  licenseId: string;
  businessDocuments: string[];
  contactDetails: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    contactPerson?: string;
    email?: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

/**
 * Reicht eine Apothekenverifizierung zur Überprüfung ein
 * @param userId Die ID des Benutzers, der verifiziert werden soll
 * @param data Die Verifizierungsdaten
 * @returns true, wenn erfolgreich, sonst false
 */
export const verifyPharmacy = async (
  userId: string, 
  data: VerificationData
): Promise<boolean> => {
  try {
    console.log("Einreichen der Verifizierung für Benutzer:", userId, data);
    
    if (!userId) {
      console.error("Fehler: Keine Benutzer-ID angegeben");
      throw new Error("Keine Benutzer-ID angegeben");
    }
    
    // Prüfen, ob der Benutzer bereits eine Verifizierung hat
    const { data: existingVerification, error: checkError } = await supabase
      .from('pharmacy_verification')
      .select('id, verification_status')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Fehler beim Prüfen auf bestehende Verifizierung:", checkError);
      throw new Error("Fehler beim Prüfen auf bestehende Verifizierung: " + checkError.message);
    }
    
    // Wenn bereits eine Verifizierung existiert, aktualisieren wir sie nur, wenn sie abgelehnt wurde
    if (existingVerification) {
      if (existingVerification.verification_status === 'rejected') {
        // Bei abgelehnter Verifizierung aktualisieren wir die Daten
        const { error: updateError } = await supabase
          .from('pharmacy_verification')
          .update({
            license_id: data.licenseId,
            business_documents: data.businessDocuments,
            contact_details: data.contactDetails,
            verification_status: 'pending',
            submitted_at: new Date().toISOString(),
            rejection_reason: null,
            reviewed_at: null,
            reviewer_id: null
          })
          .eq('id', existingVerification.id);
        
        if (updateError) {
          console.error("Fehler beim Aktualisieren der Verifizierung:", updateError);
          throw new Error("Fehler beim Aktualisieren der Verifizierung: " + updateError.message);
        }
        
        toast({
          title: "Verifizierung aktualisiert",
          description: "Ihre Apothekenverifizierung wurde aktualisiert und wird erneut geprüft.",
        });
        
        return true;
      } else {
        // Bei ausstehender oder genehmigter Verifizierung keine Änderung
        console.log("Verifizierung existiert bereits mit Status:", existingVerification.verification_status);
        
        toast({
          title: "Verifizierung bereits eingereicht",
          description: existingVerification.verification_status === 'pending' 
            ? "Ihre Verifizierung wird bereits geprüft." 
            : "Ihre Apotheke ist bereits verifiziert.",
        });
        
        return true;
      }
    }
    
    // Neue Verifizierung einreichen
    console.log("Reiche neue Verifizierung ein für Benutzer:", userId);
    const { error: insertError } = await supabase
      .from('pharmacy_verification')
      .insert({
        user_id: userId,
        license_id: data.licenseId,
        business_documents: data.businessDocuments,
        contact_details: data.contactDetails,
        verification_status: 'pending'
      });
    
    if (insertError) {
      console.error("Fehler beim Einreichen der Verifizierung:", insertError);
      throw new Error("Fehler beim Einreichen der Verifizierung: " + insertError.message);
    }
    
    console.log("Verifizierung erfolgreich eingereicht");
    toast({
      title: "Verifizierung eingereicht",
      description: "Ihre Apothekenverifizierung wurde erfolgreich zur Überprüfung eingereicht.",
    });
    
    return true;
  } catch (error: any) {
    console.error("Fehler bei der Apothekenverifizierung:", error);
    toast({
      title: "Fehler bei der Verifizierung",
      description: error.message || "Es ist ein unbekannter Fehler aufgetreten.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Prüft den Verifizierungsstatus einer Apotheke
 * @param userId Die ID des Benutzers
 * @returns Den Verifizierungsstatus oder null, wenn keine Verifizierung existiert
 */
export const getPharmacyVerificationStatus = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.error("Fehler: Keine Benutzer-ID angegeben");
      return null;
    }
    
    console.log("Prüfe Verifizierungsstatus für Benutzer:", userId);
    
    const { data, error } = await supabase
      .from('pharmacy_verification')
      .select('verification_status')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Fehler beim Abrufen des Verifizierungsstatus:", error);
      throw new Error("Fehler beim Abrufen des Verifizierungsstatus: " + error.message);
    }
    
    console.log("Verifizierungsstatus für Benutzer:", userId, data?.verification_status || "keine Verifizierung");
    return data ? data.verification_status : null;
  } catch (error: any) {
    console.error("Fehler beim Abrufen des Verifizierungsstatus:", error);
    toast({
      title: "Fehler",
      description: "Der Verifizierungsstatus konnte nicht abgerufen werden.",
      variant: "destructive"
    });
    return null;
  }
};
