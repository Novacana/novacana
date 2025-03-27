
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addUserRole, checkAdminExists } from "@/utils/authUtils";
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
        
        // Prüfen, ob bereits Admin-Benutzer existieren
        const adminExists = await checkAdminExists();
        console.log("Admin Existenz-Check:", adminExists);
        
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
      const success = await addUserRole(user.id, 'admin');
      
      if (success) {
        toast({
          title: "Administrator erstellt",
          description: "Sie wurden erfolgreich zum Administrator ernannt.",
          variant: "default"
        });
        
        setNeedsAdmin(false);
      } else {
        toast({
          title: "Fehler",
          description: "Bei der Erstellung des Administrators ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
      }
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
