
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginForm = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extrakt returnUrl aus URL-Parametern
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      if (data?.user) {
        console.log("Login successful:", data.user);
        toast({
          title: "Erfolgreich angemeldet",
          description: `Willkommen zurück, ${data.user.email}!`,
        });
        navigate(returnUrl);
      }
    } catch (err: any) {
      setError(
        err.message || "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
          <a 
            href="#" 
            className="text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              toast({
                title: "Passwort vergessen",
                description: "Die Funktion zur Passwortwiederherstellung ist noch in Arbeit.",
              });
            }}
          >
            Passwort vergessen?
          </a>
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Anmeldung...
          </>
        ) : (
          <>Anmelden</>
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
        Noch kein Konto? <a href="/register" className="font-medium text-black dark:text-white hover:underline">Registrieren</a>
      </p>
    </form>
  );
};

export default LoginForm;
