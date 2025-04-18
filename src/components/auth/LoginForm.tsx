
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getUserRoles } from "@/utils/authUtils";

interface LoginFormProps {
  setFormStatus?: (status: {
    loading: boolean;
    error: any;
    success: boolean;
  }) => void;
}

const LoginForm = ({ setFormStatus }: LoginFormProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerMode, setRegisterMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmEmailInfo, setShowConfirmEmailInfo] = useState(false);
  const [showPasswordResetInfo, setShowPasswordResetInfo] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extrakt returnUrl aus URL-Parametern
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  // Aktualisiere den übergeordneten Status, wenn vorhanden
  useEffect(() => {
    if (setFormStatus) {
      setFormStatus({
        loading,
        error,
        success: !!successMessage
      });
    }
  }, [loading, error, successMessage, setFormStatus]);

  // Überprüfen des Bestätigungsstatus
  useEffect(() => {
    const checkConfirmationStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        console.log("Benutzer ist bereits angemeldet:", session.user.email);
        
        // Überprüfe Rollen, um zu sehen, ob Admin-Berechtigung vorhanden ist
        try {
          const roles = await getUserRoles(session.user.id);
          console.log("Benutzerrollen:", roles);
          
          // Prüfe, ob Benutzer Admin-Rolle hat
          if (returnUrl.includes("/admin") && !roles.includes("admin")) {
            toast({
              title: "Zugriff verweigert",
              description: "Sie benötigen Administrator-Rechte, um auf diese Seite zuzugreifen.",
              variant: "destructive"
            });
            navigate("/dashboard");
            return;
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Rollen:", error);
        }
        
        navigate(returnUrl);
      }
    };
    checkConfirmationStatus();
  }, [navigate, returnUrl, toast]);

  // E-Mail-Bestätigungsstatus zurücksetzen
  const resetEmailConfirmation = async (userEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Hier nutzen wir die Supabase Edge Function für benutzerdefinierte E-Mails
      const response = await supabase.functions.invoke("custom-email", {
        body: {
          email: userEmail,
          type: "signup",
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (response.error) {
        console.error("Fehler beim Zurücksetzen der E-Mail-Bestätigung:", response.error);
        setError(`Fehler beim Senden der Bestätigungs-E-Mail: ${response.error.message}`);
        return false;
      }
      
      setSuccessMessage("Eine neue Bestätigungs-E-Mail wurde an Sie gesendet. Bitte überprüfen Sie Ihren Posteingang und Spam-Ordner.");
      setShowConfirmEmailInfo(true);
      return true;
    } catch (err) {
      console.error("Allgemeiner Fehler:", err);
      setError("Bei der Anforderung einer neuen Bestätigungs-E-Mail ist ein Fehler aufgetreten.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (userEmail: string) => {
    try {
      if (!userEmail) {
        setError("Bitte geben Sie Ihre E-Mail-Adresse ein, um ein Passwort-Reset anzufordern.");
        return;
      }

      setLoading(true);
      setError(null);
      
      // Hier nutzen wir die Supabase Edge Function für benutzerdefinierte E-Mails
      const response = await supabase.functions.invoke("custom-email", {
        body: {
          email: userEmail,
          type: "recovery",
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (response.error) {
        setError(`Fehler beim Passwort-Reset: ${response.error.message}`);
        return;
      }
      
      setSuccessMessage("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet. Bitte überprüfen Sie Ihren Posteingang.");
      setShowPasswordResetInfo(true);
    } catch (err) {
      console.error("Fehler beim Passwort-Reset:", err);
      setError("Bei der Anforderung eines Passwort-Resets ist ein Fehler aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setShowConfirmEmailInfo(false);
    setShowPasswordResetInfo(false);
    setLoading(true);

    try {
      console.log(`Versuche ${registerMode ? 'Registrierung' : 'Anmeldung'} mit:`, email);
      
      // Benutzer registrieren oder anmelden
      if (registerMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`
          }
        });

        if (error) {
          console.error("Registrierungsfehler:", error);
          if (error.message.includes("User already registered")) {
            setError("E-Mail-Adresse bereits registriert. Bitte melden Sie sich an.");
          } else {
            setError(`Fehler bei der Registrierung: ${error.message}`);
          }
          return;
        }

        if (data?.user) {
          console.log("Registrierung erfolgreich:", data.user);
          setSuccessMessage("Ihr Konto wurde erstellt. Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den Link in der an Sie gesendeten E-Mail klicken. Überprüfen Sie auch Ihren Spam-Ordner.");
          setShowConfirmEmailInfo(true);
          toast({
            title: "Registrierung erfolgreich",
            description: "Bitte bestätigen Sie Ihre E-Mail-Adresse.",
          });
        }
      } else {
        // Anmeldung versuchen
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login-Fehler:", error);
          
          // Spezifische Fehlerbehandlung für E-Mail-Bestätigung
          if (error.message.includes("Email not confirmed")) {
            setError("Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte klicken Sie auf den Bestätigungslink in der an Sie gesendeten E-Mail oder fordern Sie eine neue Bestätigungs-E-Mail an.");
            setShowConfirmEmailInfo(true);
            return;
          }
          
          // Andere Anmeldefehler
          if (error.message.includes("Invalid login credentials")) {
            setError("Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort oder registrieren Sie sich für ein neues Konto.");
          } else {
            setError(`Fehler bei der Anmeldung: ${error.message}`);
          }
          return;
        }

        if (data?.user) {
          console.log("Login erfolgreich:", data.user);
          
          // Überprüfe Benutzerrollen
          try {
            const roles = await getUserRoles(data.user.id);
            console.log("Benutzerrollen nach Login:", roles);
            
            // Prüfe, ob Benutzer Admin-Rolle hat
            if (returnUrl.includes("/admin") && !roles.includes("admin")) {
              toast({
                title: "Zugriff verweigert",
                description: "Sie benötigen Administrator-Rechte, um auf diese Seite zuzugreifen.",
                variant: "destructive"
              });
              setLoading(false);
              navigate("/dashboard");
              return;
            }
          } catch (error) {
            console.error("Fehler beim Abrufen der Rollen nach Login:", error);
          }
          
          toast({
            title: "Erfolgreich angemeldet",
            description: `Willkommen zurück, ${data.user.email}!`,
          });
          
          // Kurze Verzögerung, um sicherzustellen, dass die Session aktualisiert wird
          setTimeout(() => {
            navigate(returnUrl);
          }, 500);
        }
      }
    } catch (err: any) {
      console.error("Allgemeiner Fehler:", err);
      setError(
        err.message || "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setSuccessMessage(null);
    setShowConfirmEmailInfo(false);
    setShowPasswordResetInfo(false);
    setRegisterMode(!registerMode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {error.includes("E-Mail-Adresse wurde noch nicht bestätigt") && !showConfirmEmailInfo && (
              <div className="mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => resetEmailConfirmation(email)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Neue Bestätigungs-E-Mail senden
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {showConfirmEmailInfo && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <h4 className="font-medium mb-1">Bitte bestätigen Sie Ihre E-Mail-Adresse</h4>
            <p>Wir haben Ihnen eine E-Mail mit einem Bestätigungslink geschickt. Um Ihr Konto zu aktivieren, klicken Sie bitte auf diesen Link.</p>
            <p className="mt-2 text-sm">Falls Sie keine E-Mail erhalten haben, prüfen Sie bitte Ihren Spam-Ordner oder fordern Sie eine neue Bestätigungs-E-Mail an.</p>
            <div className="mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => resetEmailConfirmation(email)}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Neue Bestätigungs-E-Mail senden
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {showPasswordResetInfo && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <h4 className="font-medium mb-1">Passwort zurücksetzen</h4>
            <p>Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts geschickt. Bitte klicken Sie auf diesen Link, um ein neues Passwort festzulegen.</p>
            <p className="mt-2 text-sm">Falls Sie keine E-Mail erhalten haben, prüfen Sie bitte Ihren Spam-Ordner oder fordern Sie erneut ein Passwort-Reset an.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="apotheke@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Passwort</Label>
          {!registerMode && (
            <button 
              type="button" 
              className="text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                handlePasswordReset(email);
              }}
            >
              Passwort vergessen?
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            {registerMode ? "Registrierung..." : "Anmeldung..."}
          </>
        ) : (
          <>{registerMode ? "Registrieren" : "Anmelden"}</>
        )}
      </Button>
      
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">oder</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => {
          toast({
            title: "DocCheck Login",
            description: "Die Integration mit DocCheck ist noch in Arbeit.",
          });
        }}
      >
        Mit DocCheck anmelden
      </Button>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {registerMode ? "Bereits ein Konto?" : "Noch kein Konto?"} 
        <button 
          type="button"
          onClick={toggleMode} 
          className="font-medium text-black dark:text-white hover:underline ml-1"
        >
          {registerMode ? "Anmelden" : "Registrieren"}
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
