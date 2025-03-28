
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { checkIsAdmin, checkIsPharmacist } from "@/utils/roleUtils";

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
          
          try {
            // Adminrechte prüfen, wenn nötig
            if (adminRequired) {
              updatedState.isAdmin = await checkIsAdmin(currentSession.user.id);
              console.log("Admin-Status geprüft:", updatedState.isAdmin);
            }
            
            // Apothekerstatus prüfen, wenn nötig
            if (pharmacistRequired || adminRequired) {
              updatedState.isPharmacist = await checkIsPharmacist(currentSession.user.id);
              console.log("Apotheker-Status geprüft:", updatedState.isPharmacist);
            }
          } catch (error) {
            console.error("Fehler bei der Rollenprüfung:", error);
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
          
          try {
            // Adminrechte prüfen, wenn nötig
            if (adminRequired) {
              updatedState.isAdmin = await checkIsAdmin(currentSession.user.id);
              console.log("Admin-Status geprüft:", updatedState.isAdmin);
            }
            
            // Apothekerstatus prüfen, wenn nötig
            if (pharmacistRequired || adminRequired) {
              updatedState.isPharmacist = await checkIsPharmacist(currentSession.user.id);
              console.log("Apotheker-Status geprüft:", updatedState.isPharmacist);
            }
          } catch (error) {
            console.error("Fehler bei der Rollenprüfung:", error);
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
