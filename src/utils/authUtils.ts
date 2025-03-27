
import { supabase } from "@/integrations/supabase/client";

/**
 * Überprüft, ob ein Benutzer Administrator-Rechte hat
 * @param userId - Die ID des Benutzers
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Konsolenausgabe für Debugging
    console.log("Führe Admin-Rollenprüfung durch für Benutzer:", userId);
    
    // Prüfen, ob der Benutzer die Admin-Rolle hat
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });
    
    if (error) {
      console.error("Fehler beim Überprüfen der Admin-Rolle:", error);
      return false;
    }
    
    console.log("Admin-Rollenprüfung Ergebnis:", data);
    return data || false;
  } catch (error) {
    console.error("Fehler beim Überprüfen des Admin-Status:", error);
    return false;
  }
};

/**
 * Überprüft, ob ein Benutzer die Apotheker-Rolle hat
 * @param userId - Die ID des Benutzers
 */
export const checkIsPharmacist = async (userId: string): Promise<boolean> => {
  try {
    console.log("Prüfe Apotheker-Status für Benutzer:", userId);
    
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'pharmacist'
    });
    
    if (error) {
      console.error("Fehler beim Überprüfen der Apotheker-Rolle:", error);
      return false;
    }
    
    console.log("Apotheker-Rollenprüfung Ergebnis:", data);
    return data || false;
  } catch (error) {
    console.error("Fehler beim Überprüfen des Apotheker-Status:", error);
    return false;
  }
};

/**
 * Holt alle Rollen eines Benutzers
 * @param userId - Die ID des Benutzers
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    console.log("Hole Rollen für Benutzer:", userId);
    
    const { data, error } = await supabase.rpc('get_user_roles', {
      _user_id: userId
    });
    
    if (error) {
      console.error("Fehler beim Abrufen der Benutzerrollen:", error);
      return [];
    }
    
    console.log("Benutzerrollen abgerufen:", data);
    return data || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerrollen:", error);
    return [];
  }
};

/**
 * Fügt einem Benutzer eine Rolle hinzu
 * @param userId - Die ID des Benutzers
 * @param role - Die hinzuzufügende Rolle
 */
export const addUserRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist'): Promise<boolean> => {
  try {
    console.log(`Füge Rolle ${role} für Benutzer ${userId} hinzu`);
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error("Fehler beim Hinzufügen der Rolle:", error);
      return false;
    }
    
    console.log(`Rolle ${role} erfolgreich hinzugefügt`);
    return true;
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Rolle:", error);
    return false;
  }
};

/**
 * Entfernt eine Rolle von einem Benutzer
 * @param userId - Die ID des Benutzers
 * @param role - Die zu entfernende Rolle
 */
export const removeUserRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist'): Promise<boolean> => {
  try {
    console.log(`Entferne Rolle ${role} von Benutzer ${userId}`);
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .match({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error("Fehler beim Entfernen der Rolle:", error);
      return false;
    }
    
    console.log(`Rolle ${role} erfolgreich entfernt`);
    return true;
  } catch (error) {
    console.error("Fehler beim Entfernen der Rolle:", error);
    return false;
  }
};

/**
 * Überprüft, ob bereits Admin-Benutzer existieren
 */
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    console.log("Prüfe, ob Admin-Benutzer existieren");
    
    const { data, error, count } = await supabase
      .from('user_roles')
      .select('id', { count: 'exact' })
      .eq('role', 'admin');
    
    if (error) {
      console.error("Fehler bei der Prüfung auf Admin-Benutzer:", error);
      return false;
    }
    
    console.log("Anzahl der Admin-Benutzer:", count);
    return count !== null && count > 0;
  } catch (error) {
    console.error("Fehler bei der Prüfung auf Admin-Benutzer:", error);
    return false;
  }
};

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

// Hilfsfunktion zum Erstellen des ersten Admin-Benutzers (falls nötig)
export const createInitialAdmin = async (userId: string): Promise<boolean> => {
  return await addUserRole(userId, 'admin');
};
