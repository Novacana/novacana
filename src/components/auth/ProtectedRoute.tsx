
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import DocCheckStatus from "./DocCheckStatus";

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
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
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
  if (adminOnly) {
    // Here you would check the user's role from your profiles table
    // For now, we'll use a mock check - replace with actual DB check later
    const userIsAdmin = user.email === "admin@example.com";
    
    if (!userIsAdmin) {
      setError("You don't have permission to access this page");
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  }

  // If everything is ok, render children
  return <>{children}</>;
};

export default ProtectedRoute;
