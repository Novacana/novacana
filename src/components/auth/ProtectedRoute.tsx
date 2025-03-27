
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import DocCheckStatus from "./DocCheckStatus";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin, checkIsPharmacist } from "@/utils/authUtils";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  pharmacistOnly?: boolean;
  showDocCheckCallback?: boolean;
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
  pharmacistOnly = false,
  showDocCheckCallback = false,
}: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Überprüft, ob der Benutzer ein Administrator ist
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Prüfe Admin-Status für Benutzer:", userId);
      
      // Direkte Abfrage der user_roles Tabelle
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error("Fehler bei der Admin-Prüfung:", error);
        return false;
      }
      
      const isAdminUser = !!data;
      console.log("Admin-Status für Benutzer:", userId, isAdminUser);
      setIsAdmin(isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Admin-Status:", error);
      setIsAdmin(false);
      return false;
    }
  };

  // Überprüft, ob der Benutzer ein Apotheker ist
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
      setIsPharmacist(isPharmUser);
      return isPharmUser;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Apotheker-Status:", error);
      setIsPharmacist(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("ProtectedRoute initialisiert, adminOnly:", adminOnly, "pharmacistOnly:", pharmacistOnly);
    let isMounted = true;
    
    // Skip if we've already checked the status
    if (checkedStatus) return;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth-Status geändert:", event, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("Benutzer eingeloggt, prüfe Status...");
          
          // Adminrechte prüfen, wenn nötig
          if (adminOnly) {
            await checkAdminStatus(currentSession.user.id);
          }
          
          // Apothekerstatus prüfen, wenn nötig
          if (pharmacistOnly || adminOnly) {
            await checkPharmacistStatus(currentSession.user.id);
          }
          
          if (isMounted) {
            setLoading(false);
            setCheckedStatus(true);
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
            setIsPharmacist(false);
            setLoading(false);
            setCheckedStatus(true);
          }
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      if (checkedStatus) return;
      
      try {
        console.log("Suche nach bestehender Session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session-Prüfung Ergebnis:", currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("Benutzer hat aktive Session, prüfe Status...");
          
          // Adminrechte prüfen, wenn nötig
          if (adminOnly) {
            await checkAdminStatus(currentSession.user.id);
          }
          
          // Apothekerstatus prüfen, wenn nötig
          if (pharmacistOnly || adminOnly) {
            await checkPharmacistStatus(currentSession.user.id);
          }
        } else {
          setIsAdmin(false);
          setIsPharmacist(false);
        }
        
        if (isMounted) {
          setLoading(false);
          setCheckedStatus(true);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Session:", error);
        if (isMounted) {
          setLoading(false);
          setCheckedStatus(true);
        }
      }
    };
    
    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [adminOnly, pharmacistOnly, checkedStatus]);

  // Handle DocCheck OAuth callback if needed
  if (showDocCheckCallback) {
    return <DocCheckStatus />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-nova-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Authentifizierung wird überprüft...</p>
      </div>
    );
  }

  // Debug output
  console.log("Auth Status:", { 
    isAuthenticated: !!session, 
    user: user?.email, 
    isAdmin,
    isPharmacist,
    adminRequired: adminOnly,
    pharmacistRequired: pharmacistOnly,
    currentPath: location.pathname
  });

  // If not authenticated, redirect to login with return path
  if (!session || !user) {
    // Show toast only once
    if (!hasShownToast && !loading && checkedStatus) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie müssen angemeldet sein, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
    
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If admin only route, check user role
  if (adminOnly && !isAdmin) {
    console.log("Zugriff verweigert: Admin-Rechte erforderlich");
    // Show toast only once
    if (!hasShownToast && !loading && checkedStatus) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie benötigen Administrator-Rechte, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
    
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // If pharmacist only route, check user role
  if (pharmacistOnly && !isPharmacist && !isAdmin) {
    console.log("Zugriff verweigert: Apotheker-Rechte erforderlich");
    // Show toast only once
    if (!hasShownToast && !loading && checkedStatus) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie benötigen Apotheker-Rechte, um auf diese Seite zuzugreifen.",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
    
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // If everything is ok, render children
  return <>{children}</>;
};

export default ProtectedRoute;
