
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import DocCheckStatus from "./DocCheckStatus";
import { useToast } from "@/hooks/use-toast";
import { useAuthentication } from "@/hooks/useAuthentication";
import LoadingScreen from "./LoadingScreen";

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
  const { session, user, loading, isAdmin, isPharmacist, checkedStatus } = useAuthentication(
    adminOnly,
    pharmacistOnly
  );
  const [hasShownToast, setHasShownToast] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  if (showDocCheckCallback) {
    return <DocCheckStatus />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  console.log("Auth Status:", { 
    isAuthenticated: !!session, 
    user: user?.email, 
    isAdmin,
    isPharmacist,
    adminRequired: adminOnly,
    pharmacistRequired: pharmacistOnly,
    currentPath: location.pathname
  });

  if (!session || !user) {
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

  if (adminOnly && !isAdmin) {
    console.log("Zugriff verweigert: Admin-Rechte erforderlich");
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

  if (pharmacistOnly && !isPharmacist && !isAdmin) {
    console.log("Zugriff verweigert: Apotheker-Rechte erforderlich");
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

  return <>{children}</>;
};

export default ProtectedRoute;
