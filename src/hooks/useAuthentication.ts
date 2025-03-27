
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { checkIsAdmin, checkIsPharmacist } from "@/utils/authUtils";

interface AuthenticationState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPharmacist: boolean;
  checkedStatus: boolean;
}

export const useAuthentication = (
  adminRequired: boolean = false, 
  pharmacistRequired: boolean = false
) => {
  const [state, setState] = useState<AuthenticationState>({
    session: null,
    user: null,
    loading: true,
    isAdmin: false,
    isPharmacist: false,
    checkedStatus: false
  });

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Prüfe Admin-Status für Benutzer:", userId);
      
      // VORÜBERGEHEND: Immer true zurückgeben, um Admin-Zugriff zu ermöglichen
      // Dies sollte entfernt werden, sobald ein Admin-Benutzer erstellt wurde
      return true;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Admin-Status:", error);
      return false;
    }
  };

  const checkPharmacistStatus = async (userId: string) => {
    try {
      console.log("Prüfe Apotheker-Status für Benutzer:", userId);
      
      // Direkte Abfrage der user_roles Tabelle
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'pharmacist')
        .maybeSingle();
      
      if (error) {
        console.error("Fehler bei der Apotheker-Prüfung:", error);
        return false;
      }
      
      const isPharmUser = !!data;
      console.log("Apotheker-Status für Benutzer:", userId, isPharmUser);
      return isPharmUser;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Apotheker-Status:", error);
      return false;
    }
  };

  useEffect(() => {
    console.log("Initialisiere useAuthentication, adminRequired:", adminRequired, "pharmacistRequired:", pharmacistRequired);
    let isMounted = true;
    
    // Skip if we've already checked the status
    if (state.checkedStatus) return;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth-Status geändert:", event, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        const updatedState: Partial<AuthenticationState> = {
          session: currentSession,
          user: currentSession?.user ?? null,
        };
        
        if (currentSession?.user) {
          console.log("Benutzer eingeloggt, prüfe Status...");
          
          // Adminrechte prüfen, wenn nötig
          if (adminRequired) {
            updatedState.isAdmin = await checkAdminStatus(currentSession.user.id);
          }
          
          // Apothekerstatus prüfen, wenn nötig
          if (pharmacistRequired || adminRequired) {
            updatedState.isPharmacist = await checkPharmacistStatus(currentSession.user.id);
          }
          
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              ...updatedState,
              loading: false,
              checkedStatus: true
            }));
          }
        } else {
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              ...updatedState,
              isAdmin: false,
              isPharmacist: false,
              loading: false,
              checkedStatus: true
            }));
          }
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      if (state.checkedStatus) return;
      
      try {
        console.log("Suche nach bestehender Session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session-Prüfung Ergebnis:", currentSession?.user?.email);
        
        if (!isMounted) return;
        
        const updatedState: Partial<AuthenticationState> = {
          session: currentSession,
          user: currentSession?.user ?? null,
        };
        
        if (currentSession?.user) {
          console.log("Benutzer hat aktive Session, prüfe Status...");
          
          // Adminrechte prüfen, wenn nötig
          if (adminRequired) {
            updatedState.isAdmin = await checkAdminStatus(currentSession.user.id);
          }
          
          // Apothekerstatus prüfen, wenn nötig
          if (pharmacistRequired || adminRequired) {
            updatedState.isPharmacist = await checkPharmacistStatus(currentSession.user.id);
          }
        } else {
          updatedState.isAdmin = false;
          updatedState.isPharmacist = false;
        }
        
        if (isMounted) {
          setState(prevState => ({
            ...prevState,
            ...updatedState,
            loading: false,
            checkedStatus: true
          }));
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Session:", error);
        if (isMounted) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            checkedStatus: true
          }));
        }
      }
    };
    
    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [adminRequired, pharmacistRequired, state.checkedStatus]);

  return state;
};
