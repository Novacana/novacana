
import { supabase } from "@/integrations/supabase/client";

/**
 * Überprüft, ob ein Benutzer Administrator-Rechte hat
 * @param userId - Die ID des Benutzers
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Prüfen, ob der Benutzer die Admin-Rolle hat
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });
    
    if (error) {
      console.error("Fehler beim Überprüfen der Admin-Rolle:", error);
      return false;
    }
    
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
    const { data, error } = await supabase.rpc('get_user_roles', {
      _user_id: userId
    });
    
    if (error) {
      console.error("Fehler beim Abrufen der Benutzerrollen:", error);
      return [];
    }
    
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
    
    return true;
  } catch (error) {
    console.error("Fehler beim Entfernen der Rolle:", error);
    return false;
  }
};

/**
 * Anleitung zum Hinzufügen eines Admin-Benutzers
 * 
 * Nach der Registrierung eines neuen Benutzers muss ein bestehender Administrator
 * die Admin-Rolle zuweisen. Dies kann über die Admin-Benutzeroberfläche erfolgen.
 * 
 * Für den ersten Admin-Benutzer wurde beim Datenbanksetup automatisch der Benutzer
 * mit der E-Mail "admin@example.com" als Administrator eingerichtet.
 */
