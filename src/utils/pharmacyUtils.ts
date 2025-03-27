
import { supabase } from "@/integrations/supabase/client";
import { addUserRole } from "./roleUtils";

/**
 * Verifiziert eine Apotheke im Rahmen des GDP-konformen Qualifizierungsprozesses
 * @param userId - Die ID des Benutzers
 * @param verificationData - Die Überprüfungsdaten der Apotheke
 */
export const verifyPharmacy = async (userId: string, verificationData: {
  licenseId: string;
  businessDocuments: string[];
  contactDetails: Record<string, string>;
  verificationStatus?: string;
}): Promise<boolean> => {
  try {
    console.log(`Verifiziere Apotheke für Benutzer ${userId}`);
    
    // Erstellen des Verifikationseintrags
    const { error } = await supabase
      .from('pharmacy_verification')
      .insert({
        user_id: userId,
        license_id: verificationData.licenseId,
        business_documents: verificationData.businessDocuments,
        contact_details: verificationData.contactDetails,
        verification_status: verificationData.verificationStatus || 'pending'
        // submitted_at wird automatisch durch den DEFAULT-Wert in der Datenbank gesetzt
      });
    
    if (error) {
      console.error("Fehler beim Erstellen des Verifikationseintrags:", error);
      return false;
    }
    
    // Dem Benutzer die Apotheker-Rolle zuweisen
    await addUserRole(userId, 'pharmacist');
    
    console.log(`Apothekenverifizierung für Benutzer ${userId} eingereicht`);
    return true;
  } catch (error) {
    console.error("Fehler bei der Apothekenverifizierung:", error);
    return false;
  }
};

/**
 * Holt den Status der Apothekenverifizierung für einen Benutzer
 * @param userId - Die ID des Benutzers
 */
export const getPharmacyVerificationStatus = async (userId: string): Promise<{
  status: string;
  submittedAt: Date | null;
  reviewedAt: Date | null;
} | null> => {
  try {
    console.log(`Hole Verifizierungsstatus für Benutzer ${userId}`);
    
    const { data, error } = await supabase
      .from('pharmacy_verification')
      .select('verification_status, submitted_at, reviewed_at')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Fehler beim Abrufen des Verifizierungsstatus:", error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      status: data.verification_status,
      submittedAt: data.submitted_at ? new Date(data.submitted_at) : null,
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : null
    };
  } catch (error) {
    console.error("Fehler beim Abrufen des Verifizierungsstatus:", error);
    return null;
  }
};
