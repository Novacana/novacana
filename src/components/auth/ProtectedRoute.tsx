
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Funktion zum Überprüfen der DocCheck-Authentifizierung
const isAuthenticated = (): boolean => {
  return localStorage.getItem("doccheck_auth") === "true";
};

// DocCheck Redirect URL-Konfiguration
const DOCCHECK_LOGIN_ID = "d279f3d6ef165e8ccd90bb8a52a149"; // Beispiel Login-ID - durch echte ersetzen
const DOCCHECK_LOGIN_URL = `https://login.doccheck.com/code/${DOCCHECK_LOGIN_ID}/`;
const REDIRECT_URL = window.location.origin + "/doccheck-callback";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
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
    
    if (dc_uid && dc_pwh) {
      handleDocCheckCallback(dc_uid, dc_pwh);
    }
  }, [location]);

  // Funktion zum Verarbeiten des DocCheck-Callbacks
  const handleDocCheckCallback = (dc_uid: string, dc_pwh: string) => {
    setIsVerifying(true);
    
    // In einer realen Anwendung würden Sie diese Werte auf Ihrem Server validieren
    // Hier setzen wir den Auth-Status direkt für Demo-Zwecke
    setTimeout(() => {
      // Speichern der DocCheck-Auth-Daten im localStorage
      localStorage.setItem("doccheck_auth", "true");
      localStorage.setItem("doccheck_uid", dc_uid);
      
      setShowContent(true);
      setIsVerifying(false);
      
      // Automatisch die URL-Parameter entfernen (für bessere Benutzererfahrung)
      window.history.replaceState({}, document.title, location.pathname);
      
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

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-center mb-4 text-amber-500">
              <AlertTriangle size={64} />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Geschützter Bereich
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Der Zugriff auf unsere Produkte ist ausschließlich Angehörigen der Heilberufe vorbehalten. 
              Bitte authentifizieren Sie sich über DocCheck, um fortzufahren.
            </p>
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleDocCheckAuth}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifiziere...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <img 
                      src="https://www.doccheck.com/images/logos/doccheck-logo.svg" 
                      alt="DocCheck" 
                      className="h-5 mr-2" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Crect width='100' height='20' fill='%23005EB8'/%3E%3Ctext x='50' y='13' font-family='Arial' font-size='10' fill='white' text-anchor='middle'%3EDocCheck%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    Mit DocCheck anmelden
                  </span>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-8">
              Hinweis: DocCheck ist ein Authentifizierungsdienst für Angehörige der Heilberufe. 
              Gemäß dem Heilmittelwerbegesetz (HWG) sind bestimmte medizinische Informationen und 
              Produkte nur für Fachkreise zugänglich.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProtectedRoute;
