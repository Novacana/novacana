
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
 * Anleitung zum Hinzufügen eines Admin-Benutzers
 * 
 * Nach der Registrierung eines neuen Benutzers muss ein bestehender Administrator
 * die Admin-Rolle zuweisen. Dies kann über die Admin-Benutzeroberfläche erfolgen.
 * 
 * Für den ersten Admin-Benutzer kann die folgende Funktion verwendet werden:
 * 
 * createInitialAdmin(userId: string): Promise<boolean>
 */

// Hilfsfunktion zum Erstellen des ersten Admin-Benutzers (falls nötig)
export const createInitialAdmin = async (userId: string): Promise<boolean> => {
  return await addUserRole(userId, 'admin');
};
