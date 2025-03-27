
import { supabase } from "@/integrations/supabase/client";

/**
 * Überprüft, ob ein Benutzer Administrator-Rechte hat
 * @param userId - Die ID des Benutzers
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  // Wenn ein Benutzer-Profil-System implementiert wird, 
  // würde hier die Rolle aus der Datenbank überprüft werden
  
  // Einfache E-Mail-Überprüfung als vorläufige Implementierung
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    return false;
  }
  
  return data?.user?.email === "admin@example.com";
};

/**
 * Anleitung zum Hinzufügen eines Admin-Benutzers
 * 
 * Derzeit können Sie einen Admin-Benutzer hinzufügen, indem Sie:
 * 1. Einen neuen Benutzer mit der E-Mail "admin@example.com" registrieren
 * 2. Mit diesem Benutzer anmelden
 * 
 * In einer robusten Implementierung würde ein User-Roles-System in der Datenbank verwendet werden.
 */
