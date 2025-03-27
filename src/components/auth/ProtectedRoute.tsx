
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import DocCheckStatus from "./DocCheckStatus";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin } from "@/utils/authUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  showDocCheckCallback?: boolean;
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
  showDocCheckCallback = false,
}: ProtectedRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Check if user is an admin
  const checkAdminStatus = async (userId: string) => {
    try {
      const hasAdminRole = await checkIsAdmin(userId);
      console.log("Admin-Status für Benutzer:", userId, hasAdminRole);
      setIsAdmin(hasAdminRole);
    } catch (error) {
      console.error("Fehler beim Überprüfen des Admin-Status:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log("ProtectedRoute initialisiert");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth-Status geändert:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          checkAdminStatus(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Bestehende Session gefunden:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle DocCheck OAuth callback if needed
  if (showDocCheckCallback) {
    return <DocCheckStatus />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nova-600"></div>
      </div>
    );
  }

  // Debug output
  console.log("Auth Status:", { 
    isAuthenticated: !!session, 
    user: user?.email, 
    isAdmin,
    adminRequired: adminOnly,
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

  // If everything is ok, render children
  return <>{children}</>;
};

export default ProtectedRoute;
