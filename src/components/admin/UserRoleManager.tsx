
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addUserRole, removeUserRole } from "@/utils/authUtils";
import { User } from "lucide-react";
import UserList from "./UserList";
import CreateUserDialog from "./CreateUserDialog";
import * as z from "zod";

interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

const formSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
  role: z.enum(["user", "admin", "pharmacist"])
});

const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Benutzer und deren Rollen laden
  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("Lade Benutzer und Rollen...");
      
      // Direkter Zugriff auf die auth.users-Tabelle und Rollen
      // Dies funktioniert mit dem Administratortoken im Backend
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
      
      if (authUsersError) {
        throw new Error(`Fehler beim Laden der Benutzer: ${authUsersError.message}`);
      }
      
      // Alle Benutzerrollen abrufen
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        throw new Error(`Fehler beim Laden der Benutzerrollen: ${rolesError.message}`);
      }
      
      // Rollen nach Benutzer-ID gruppieren
      const rolesByUserId: Record<string, string[]> = {};
      rolesData?.forEach(role => {
        if (!rolesByUserId[role.user_id]) {
          rolesByUserId[role.user_id] = [];
        }
        rolesByUserId[role.user_id].push(role.role);
      });
      
      // Benutzerdaten mit Rollen kombinieren
      const formattedUsers = authUsersData?.users.map(user => ({
        id: user.id,
        email: user.email || 'Keine E-Mail',
        roles: rolesByUserId[user.id] || []
      })) || [];
      
      console.log("Geladene Benutzer:", formattedUsers);
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer und Rollen:", error);
      toast({
        title: "Fehler",
        description: "Benutzer und Rollen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Neuen Benutzer erstellen
  const handleCreateUser = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Erstelle neuen Benutzer:", values.email, "mit Rolle:", values.role);
      
      // Benutzer mit signUp erstellen und dann die Rolle hinzufügen
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      
      if (signUpError) {
        console.error("Fehler bei der Benutzer-Registrierung:", signUpError);
        throw new Error(`Fehler bei der Benutzer-Registrierung: ${signUpError.message}`);
      }
      
      if (!signUpData.user) {
        throw new Error("Benutzer konnte nicht erstellt werden: Keine Benutzer-ID erhalten");
      }
      
      console.log("Benutzer erstellt:", signUpData.user);
      
      // Rolle hinzufügen
      const success = await addUserRole(signUpData.user.id, values.role as any);
      
      if (!success) {
        throw new Error(`Rolle "${values.role}" konnte nicht hinzugefügt werden`);
      }
      
      toast({
        title: "Benutzer erstellt",
        description: `Neuer Benutzer mit der E-Mail ${values.email} wurde erfolgreich erstellt.`
      });
      
      // Benutzerliste aktualisieren
      loadUsers();
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Benutzers:", error);
      toast({
        title: "Fehler",
        description: `Der Benutzer konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Rolle für einen Benutzer hinzufügen
  const handleAddRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist') => {
    try {
      console.log(`Füge Rolle ${role} für Benutzer ${userId} hinzu...`);
      const success = await addUserRole(userId, role);
      
      if (success) {
        toast({
          title: "Rolle hinzugefügt",
          description: `Die Rolle "${role}" wurde dem Benutzer erfolgreich hinzugefügt.`
        });
        loadUsers();
      } else {
        toast({
          title: "Fehler",
          description: `Die Rolle "${role}" konnte nicht hinzugefügt werden.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `Die Rolle konnte nicht hinzugefügt werden: ${error}`,
        variant: "destructive"
      });
    }
  };

  // Rolle von einem Benutzer entfernen
  const handleRemoveRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist') => {
    try {
      console.log(`Entferne Rolle ${role} von Benutzer ${userId}...`);
      const success = await removeUserRole(userId, role);
      
      if (success) {
        toast({
          title: "Rolle entfernt",
          description: `Die Rolle "${role}" wurde vom Benutzer erfolgreich entfernt.`
        });
        loadUsers();
      } else {
        toast({
          title: "Fehler",
          description: `Die Rolle "${role}" konnte nicht entfernt werden.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Fehler beim Entfernen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `Die Rolle konnte nicht entfernt werden: ${error}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          Benutzerverwaltung
        </CardTitle>
        <CardDescription>
          Verwalten Sie Benutzerrollen und -berechtigungen
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between">
              <CreateUserDialog onCreateUser={handleCreateUser} />
              
              <Button onClick={() => loadUsers()} variant="outline" size="sm">
                Aktualisieren
              </Button>
            </div>
            
            <UserList 
              users={users} 
              onAddRole={handleAddRole} 
              onRemoveRole={handleRemoveRole} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleManager;
