
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// This simulates checking for DocCheck authentication
// In a real implementation, this would verify with the DocCheck API
const isAuthenticated = (): boolean => {
  return localStorage.getItem("doccheck_auth") === "true";
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      setShowContent(true);
    }
  }, []);

  const handleDocCheckAuth = () => {
    setIsVerifying(true);
    
    // Simulate DocCheck authentication process
    // In a real implementation, this would redirect to DocCheck login
    setTimeout(() => {
      // Simulate successful authentication
      localStorage.setItem("doccheck_auth", "true");
      setShowContent(true);
      setIsVerifying(false);
      
      toast({
        title: "Authentifizierung erfolgreich",
        description: "Sie wurden als Angehöriger eines Heilberufs verifiziert.",
      });
    }, 2000);
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
