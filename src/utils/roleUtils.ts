
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Überprüft, ob ein Benutzer Administrator-Rechte hat
 * @param userId - Die ID des Benutzers
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("Benutzer-ID fehlt bei der Admin-Rollenprüfung");
      return false;
    }
    
    // Konsolenausgabe für Debugging
    console.log("Führe Admin-Rollenprüfung durch für Benutzer:", userId);
    
    // Direkte Abfrage mit der has_role Funktion statt Direktabfrage der Tabelle
    const { data, error } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });
    
    if (error) {
      console.error("Fehler beim Überprüfen der Admin-Rolle:", error);
      return false;
    }
    
    console.log("Admin-Rollenprüfung Ergebnis:", data);
    return !!data;
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
    if (!userId) {
      console.error("Benutzer-ID fehlt bei der Apotheker-Rollenprüfung");
      return false;
    }
    
    console.log("Prüfe Apotheker-Status für Benutzer:", userId);
    
    // Direkte Abfrage mit der has_role Funktion
    const { data, error } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'pharmacist' });
    
    if (error) {
      console.error("Fehler beim Überprüfen der Apotheker-Rolle:", error);
      return false;
    }
    
    console.log("Apotheker-Rollenprüfung Ergebnis:", data);
    return !!data;
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
    if (!userId) {
      console.error("Benutzer-ID fehlt bei der Rollenabfrage");
      return [];
    }
    
    console.log("Hole Rollen für Benutzer:", userId);
    
    // Benutzen der get_user_roles Funktion statt direkter Tabellenabfrage
    const { data, error } = await supabase
      .rpc('get_user_roles', { _user_id: userId });
    
    if (error) {
      console.error("Fehler beim Abrufen der Benutzerrollen:", error);
      return [];
    }
    
    const roles = data || [];
    console.log("Benutzerrollen abgerufen:", roles);
    return roles;
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
    if (!userId) {
      console.error("Keine Benutzer-ID angegeben");
      return false;
    }
    
    console.log(`Füge Rolle ${role} für Benutzer ${userId} hinzu`);

    // Edge-Funktion aufrufen, um die Rolle hinzuzufügen
    const { data, error } = await supabase.functions.invoke('manage-user-roles', {
      body: { 
        action: 'add',
        userId, 
        role 
      }
    });
    
    if (error) {
      console.error("Fehler beim Hinzufügen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `Die Rolle ${role} konnte nicht hinzugefügt werden.`,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Rolle ${role} erfolgreich hinzugefügt:`, data);
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
    if (!userId) {
      console.error("Keine Benutzer-ID angegeben");
      return false;
    }
    
    console.log(`Entferne Rolle ${role} von Benutzer ${userId}`);
    
    // Edge-Funktion aufrufen, um die Rolle zu entfernen
    const { data, error } = await supabase.functions.invoke('manage-user-roles', {
      body: { 
        action: 'remove',
        userId, 
        role 
      }
    });
    
    if (error) {
      console.error("Fehler beim Entfernen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `Die Rolle ${role} konnte nicht entfernt werden.`,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Rolle ${role} erfolgreich entfernt:`, data);
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

// Hilfsfunktion zum Erstellen des ersten Admin-Benutzers (falls nötig)
export const createInitialAdmin = async (userId: string): Promise<boolean> => {
  return await addUserRole(userId, 'admin');
};
