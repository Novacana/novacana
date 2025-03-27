
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Diese Komponente wird verwendet, um den ersten Admin-Benutzer zu erstellen, wenn keine Administratoren existieren
const FirstAdminSetup = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [needsAdmin, setNeedsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Prüfen, ob bereits Admin-Benutzer existieren
  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      
      try {
        // Aktuelle Session abrufen
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }
        
        setUser(session.user);
        
        // Direkte Abfrage statt über die Hilfsfunktion
        const { count, error } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');
        
        if (error) {
          console.error("Fehler beim Prüfen des Admin-Status:", error);
          setLoading(false);
          return;
        }
        
        console.log("Admin-Prüfung Ergebnis:", count);
        const adminExists = count !== null && count > 0;
        
        setNeedsAdmin(!adminExists);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Prüfen des Admin-Status:", error);
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, []);

  // Den aktuellen Benutzer zum Administrator machen
  const makeAdmin = async () => {
    if (!user) return;
    
    setProcessing(true);
    
    try {
      // Service-Role API verwenden (wenn verfügbar)
      // Oder alternativ durch Admin-Funktion
      const { data, error } = await supabase
        .rpc('create_admin', {
          new_admin_id: user.id
        });
      
      if (error) {
        console.error("Fehler beim Hinzufügen der Admin-Rolle:", error);
        
        // Direkte Einfügung versuchen
        const insertResult = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });
          
        if (insertResult.error) {
          console.error("Fehler bei direkter Einfügung:", insertResult.error);
          toast({
            title: "Fehler",
            description: `Fehler beim Hinzufügen der Rolle: ${JSON.stringify(insertResult.error)}`,
            variant: "destructive"
          });
          setProcessing(false);
          return;
        }
      }
      
      toast({
        title: "Administrator erstellt",
        description: "Sie wurden erfolgreich zum Administrator ernannt.",
        variant: "default"
      });
      
      // Seite nach kurzer Verzögerung neu laden, um die neuen Rechte zu aktualisieren
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      setNeedsAdmin(false);
    } catch (error) {
      console.error("Fehler beim Erstellen des Administrators:", error);
      toast({
        title: "Fehler",
        description: "Bei der Erstellung des Administrators ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  // Wenn noch geprüft wird, zeige Ladeanimation
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Prüfe Administrator-Status...</span>
      </div>
    );
  }

  // Wenn kein Admin benötigt wird, zeige nichts an
  if (!needsAdmin || !user) {
    return null;
  }

  // Zeige Karte zur Erstellung des ersten Administrators
  return (
    <Card className="w-full max-w-md mx-auto my-4 border-yellow-300 shadow-md">
      <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
        <CardTitle className="text-lg">Administratorrechte erforderlich</CardTitle>
        <CardDescription>
          Es wurde noch kein Administrator für diese Plattform eingerichtet.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm mb-2">
          Als erster Benutzer können Sie sich selbst zum Administrator ernennen, um alle Funktionen der Plattform verwalten zu können.
        </p>
        <p className="text-sm font-medium">
          Benutzer: {user.email}
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50">
        <Button 
          onClick={makeAdmin} 
          disabled={processing}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verarbeitung...
            </>
          ) : (
            "Zum Administrator ernennen"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirstAdminSetup;
