
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { createInitialAdmin } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FirstAdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Aktuelle Sitzung prüfen
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        setError("Sie müssen angemeldet sein, um einen Admin-Benutzer zu erstellen. Bitte melden Sie sich zuerst an.");
        toast({
          title: "Fehler",
          description: "Sie müssen angemeldet sein, um einen Admin-Benutzer zu erstellen.",
          variant: "destructive"
        });
        return;
      }

      // Admin-Rolle zuweisen
      const userId = session.user.id;
      console.log("Erstelle ersten Admin-Benutzer mit ID:", userId);
      
      const result = await createInitialAdmin(userId);
      
      if (result) {
        setSuccess(true);
        toast({
          title: "Erfolg",
          description: "Sie wurden erfolgreich als Administrator eingerichtet. Sie können jetzt auf die Admin-Bereiche zugreifen.",
        });
      } else {
        setError("Bei der Einrichtung des Admin-Benutzers ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        toast({
          title: "Fehler",
          description: "Bei der Einrichtung des Admin-Benutzers ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error("Fehler bei der Admin-Erstellung:", err);
      setError(`Fehler: ${err.message || "Unbekannter Fehler"}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          Sie wurden erfolgreich als Administrator eingerichtet. Sie können jetzt auf die Admin-Bereiche zugreifen.
          <div className="mt-2">
            <Button 
              onClick={() => window.location.href = '/admin'} 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Zum Admin-Bereich
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Erster Administrator</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Es scheint, dass noch kein Administrator eingerichtet wurde. Als erster Benutzer können Sie sich selbst als Administrator einrichten.
      </p>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleCreateAdmin} 
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Administrator wird eingerichtet...
          </>
        ) : (
          "Als Administrator einrichten"
        )}
      </Button>
    </div>
  );
};

export default FirstAdminSetup;
