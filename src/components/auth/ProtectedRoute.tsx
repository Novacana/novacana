
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  showDocCheckCallback?: boolean;
}

// Funktion zum Überprüfen der Authentifizierung
const isAuthenticated = (): boolean => {
  return localStorage.getItem("authToken") === "dummy-token" || localStorage.getItem("doccheck_auth") === "true";
};

// DocCheck Redirect URL-Konfiguration
const DOCCHECK_LOGIN_ID = "d279f3d6ef165e8ccd90bb8a52a149"; // Beispiel Login-ID - durch echte ersetzen
const DOCCHECK_LOGIN_URL = `https://login.doccheck.com/code/${DOCCHECK_LOGIN_ID}/`;
const REDIRECT_URL = window.location.origin + "/doccheck-callback";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, showDocCheckCallback = false }) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    // Überprüfen, ob Benutzer bereits authentifiziert ist
    if (isAuthenticated()) {
      setShowContent(true);
      return;
    }

    // DocCheck-Callback-Parameter überprüfen (wenn Benutzer von DocCheck zurückkehrt)
    const urlParams = new URLSearchParams(window.location.search);
    const dc_uid = urlParams.get("dc_uid");
    const dc_pwh = urlParams.get("dc_pwh");
    const returnTo = urlParams.get("returnTo");
    
    if (dc_uid && dc_pwh) {
      handleDocCheckCallback(dc_uid, dc_pwh, returnTo);
    }
  }, [location, navigate]);

  // Funktion zum Verarbeiten des DocCheck-Callbacks
  const handleDocCheckCallback = (dc_uid: string, dc_pwh: string, returnTo?: string | null) => {
    setIsVerifying(true);
    
    // In einer realen Anwendung würden Sie diese Werte auf Ihrem Server validieren
    // Hier setzen wir den Auth-Status direkt für Demo-Zwecke
    setTimeout(() => {
      // Speichern der DocCheck-Auth-Daten im localStorage
      localStorage.setItem("doccheck_auth", "true");
      localStorage.setItem("doccheck_uid", dc_uid);
      
      setShowContent(true);
      setIsVerifying(false);
      
      // Weiterleitung zur angeforderten Seite, wenn returnTo angegeben ist
      if (returnTo && returnTo.startsWith('/')) {
        navigate(returnTo);
      } else {
        // Automatisch die URL-Parameter entfernen (für bessere Benutzererfahrung)
        window.history.replaceState({}, document.title, location.pathname);
      }
      
      toast({
        title: "Authentifizierung erfolgreich",
        description: "Sie wurden als Angehöriger eines Heilberufs verifiziert.",
      });
    }, 1000);
  };

  // Funktion zur Weiterleitung zu DocCheck
  const handleDocCheckAuth = () => {
    setIsVerifying(true);
    
    // Zu DocCheck weiterleiten mit Rückleitung zur aktuellen URL
    const currentPath = encodeURIComponent(location.pathname);
    const loginUrl = `${DOCCHECK_LOGIN_URL}?dc_referer=${REDIRECT_URL}?returnTo=${currentPath}`;
    
    // In einer realen Anwendung würden Sie hier direkt zu DocCheck weiterleiten
    window.location.href = loginUrl;
  };

  // Bei DocCheck-Callback und während der Verifizierung eine Ladeansicht anzeigen
  if (showDocCheckCallback && isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-24 pb-12">
          <div className="container-content max-w-3xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                DocCheck-Verifizierung
              </h1>
              <div className="flex justify-center my-8">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Ihre DocCheck-Authentifizierung wird verarbeitet. Bitte warten Sie einen Moment...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (showContent) {
    return <>{children}</>;
  }

  // Wenn nicht authentifiziert, zur Login-Seite weiterleiten
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
