
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

// Funktion zum Überprüfen der DocCheck-Authentifizierung
const handleDocCheckAuth = () => {
  // DocCheck Redirect URL-Konfiguration
  const DOCCHECK_LOGIN_ID = "d279f3d6ef165e8ccd90bb8a52a149"; // Beispiel Login-ID - durch echte ersetzen
  const DOCCHECK_LOGIN_URL = `https://login.doccheck.com/code/${DOCCHECK_LOGIN_ID}/`;
  const REDIRECT_URL = window.location.origin + "/doccheck-callback";

  // Zu DocCheck weiterleiten mit Rückleitung zur aktuellen URL
  const currentPath = encodeURIComponent(window.location.pathname);
  const loginUrl = `${DOCCHECK_LOGIN_URL}?dc_referer=${REDIRECT_URL}?returnTo=${currentPath}`;
  
  // In einer realen Anwendung würden Sie hier direkt zu DocCheck weiterleiten
  window.location.href = loginUrl;
};

const LoginForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      remember: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, log in with any email that ends with @pharmacy.de
      if (formData.email.endsWith("@pharmacy.de")) {
        localStorage.setItem("authToken", "dummy-token");
        
        toast({
          title: "Login erfolgreich",
          description: "Willkommen zurück bei Novacana!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login fehlgeschlagen",
          description: "Ungültige Anmeldedaten oder nicht autorisierter Zugriff. Bitte stellen Sie sicher, dass Sie Ihre Apotheken-E-Mail verwenden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login fehlgeschlagen",
        description: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Willkommen zurück
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Melden Sie sich bei Ihrem Apothekenkonto an
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="pharmacy@example.de"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Verwenden Sie Ihre registrierte Apotheken-E-Mail
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Passwort</Label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-nova-600 dark:text-nova-400 hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={formData.remember}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Angemeldet bleiben
          </Label>
        </div>

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
          {isLoading ? (
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
              Anmelden...
            </span>
          ) : (
            "Anmelden"
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center mt-8 mb-6">
        <Separator className="w-full" />
        <span className="absolute px-4 text-sm text-gray-500 bg-white dark:bg-gray-800">oder</span>
      </div>
      
      <Button 
        onClick={handleDocCheckAuth} 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
      >
        <img 
          src="/lovable-uploads/861c27b1-43a8-4b19-85cd-06e27ba7e28a.png" 
          alt="DocCheck" 
          className="h-5"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Crect width='100' height='20' fill='%23005EB8'/%3E%3Ctext x='50' y='13' font-family='Arial' font-size='10' fill='white' text-anchor='middle'%3EDocCheck%3C/text%3E%3C/svg%3E";
          }}
        />
        Mit DocCheck anmelden
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Noch kein Konto?{" "}
          <Link
            to="/register"
            className="font-medium text-nova-600 dark:text-nova-400 hover:underline"
          >
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
