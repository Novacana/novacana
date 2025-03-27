
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import DocCheckStatus from "./DocCheckStatus";
import { useToast } from "@/hooks/use-toast";

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
      // First method: check if email is admin@example.com (fallback method)
      if (user?.email === "admin@example.com") {
        setIsAdmin(true);
        return;
      }
      
      // This is where you would check the database for admin role
      // For now, we're using the simple email check above
      
      setIsAdmin(false);
    } catch (error) {
      console.error("Fehler beim Überprüfen des Admin-Status:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          checkAdminStatus(currentSession.user.id);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id);
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
