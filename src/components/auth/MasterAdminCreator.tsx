
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";

const MasterAdminCreator = () => {
  const [email, setEmail] = useState("master@novacana.com");
  const [password, setPassword] = useState("Nov@cana2024!");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createMasterAdmin = async () => {
    if (!email || !password) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie E-Mail und Passwort ein",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Registriere den Benutzer
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_master_admin: true,
          }
        }
      });

      if (signUpError) {
        console.error("Fehler bei der Registrierung:", signUpError);
        toast({
          title: "Registrierungsfehler",
          description: signUpError.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!signUpData.user) {
        toast({
          title: "Fehler",
          description: "Benutzer konnte nicht erstellt werden",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // 2. Die create_admin Funktion aufrufen, die Administratorberechtigungen mit Security Definer hinzufügt
      const { data: adminRoleData, error: adminRoleError } = await supabase.rpc(
        'create_admin',
        { new_admin_id: signUpData.user.id }
      );
      
      if (adminRoleError) {
        console.error("Fehler beim Hinzufügen der Admin-Rolle:", adminRoleError);
        toast({
          title: "Fehler",
          description: "Admin-Rolle konnte nicht hinzugefügt werden",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!adminRoleData) {
        console.error("Admin-Rolle konnte nicht hinzugefügt werden: Kein Rückgabewert");
        toast({
          title: "Fehler",
          description: "Admin-Rolle konnte nicht hinzugefügt werden",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // 3. Erfolg anzeigen
      toast({
        title: "Master Admin erstellt",
        description: `Der Master Admin wurde erfolgreich erstellt. Login-Daten: ${email} / ${password}`,
        duration: 10000
      });

      setLoading(false);
    } catch (error) {
      console.error("Fehler bei der Erstellung des Master Admins:", error);
      toast({
        title: "Fehler",
        description: "Beim Erstellen des Master Admins ist ein Fehler aufgetreten",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto my-4 border-purple-300 shadow-md">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Shield size={20} />
          Master Admin erstellen
        </CardTitle>
        <CardDescription>
          Erstellen Sie einen Master Admin-Account mit vollen Administratorrechten
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="masterEmail">E-Mail</Label>
          <Input
            id="masterEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@beispiel.de"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="masterPassword">Passwort</Label>
          <Input
            id="masterPassword"
            type="text" // text statt password, damit der Wert sichtbar ist
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sicheres Passwort"
          />
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50">
        <Button 
          onClick={createMasterAdmin} 
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verarbeitung...
            </>
          ) : (
            "Master Admin erstellen"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MasterAdminCreator;
