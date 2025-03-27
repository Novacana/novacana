
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
  const { toast } = useToast();
  const location = useLocation();

  // Check if user is an admin
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Prüfe Admin-Status für Benutzer:", userId);
      const hasAdminRole = await checkIsAdmin(userId);
      console.log("Admin-Status für Benutzer:", userId, hasAdminRole);
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Admin-Status:", error);
      setIsAdmin(false);
      return false;
    }
  };

  // Check if user is a pharmacist
  const checkPharmacistStatus = async (userId: string) => {
    try {
      console.log("Prüfe Apotheker-Status für Benutzer:", userId);
      const hasPharmacistRole = await checkIsPharmacist(userId);
      console.log("Apotheker-Status für Benutzer:", userId, hasPharmacistRole);
      setIsPharmacist(hasPharmacistRole);
      return hasPharmacistRole;
    } catch (error) {
      console.error("Fehler beim Überprüfen des Apotheker-Status:", error);
      setIsPharmacist(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("ProtectedRoute initialisiert, adminOnly:", adminOnly, "pharmacistOnly:", pharmacistOnly);
    let isMounted = true;
    
    // Erst Authentifizierungs-Listener einrichten
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth-Status geändert:", event, currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("Benutzer eingeloggt, prüfe Status...");
          const adminResult = await checkAdminStatus(currentSession.user.id);
          
          if (pharmacistOnly || adminOnly) {
            const pharmacistResult = await checkPharmacistStatus(currentSession.user.id);
            console.log("Status-Prüfung: Admin =", adminResult, "Apotheker =", pharmacistResult);
          }
        } else {
          setIsAdmin(false);
          setIsPharmacist(false);
        }
        
        setLoading(false);
      }
    );

    // Dann nach bestehender Session suchen
    const checkSession = async () => {
      try {
        console.log("Suche nach bestehender Session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session-Prüfung Ergebnis:", currentSession?.user?.email);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("Benutzer hat aktive Session, prüfe Status...");
          const adminResult = await checkAdminStatus(currentSession.user.id);
          
          if (pharmacistOnly || adminOnly) {
            const pharmacistResult = await checkPharmacistStatus(currentSession.user.id);
            console.log("Status-Prüfung: Admin =", adminResult, "Apotheker =", pharmacistResult);
          }
        } else {
          setIsAdmin(false);
          setIsPharmacist(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [adminOnly, pharmacistOnly]);

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
    toast({
      title: "Zugriff verweigert",
      description: "Sie benötigen Administrator-Rechte, um auf diese Seite zuzugreifen.",
      variant: "destructive"
    });
    
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
    toast({
      title: "Zugriff verweigert",
      description: "Sie benötigen Apotheker-Rechte, um auf diese Seite zuzugreifen.",
      variant: "destructive"
    });
    
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
