
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addUserRole, removeUserRole } from "@/utils/authUtils";
import { User, Shield, UserCheck, UserX, UserPlus, AlertCircle } from "lucide-react";

interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin' | 'pharmacist'>('user');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const { toast } = useToast();

  // Benutzer und deren Rollen laden
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Benutzer über die get_all_users Funktion holen
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        throw new Error(`Fehler beim Laden der Benutzer: ${error.message}`);
      }
      
      const formattedUsers = data?.map(user => ({
        id: user.id,
        email: user.email,
        roles: user.roles || []
      })) || [];
      
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
  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: "Eingaben prüfen",
        description: "Bitte geben Sie eine E-Mail-Adresse und ein Passwort ein.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreatingUser(true);
      
      // Den create_user RPC-Endpunkt aufrufen
      const { data, error } = await supabase.rpc('create_user', {
        email: newUserEmail,
        password: newUserPassword,
        user_role: newUserRole
      });
      
      if (error) {
        throw new Error(`Fehler beim Erstellen des Benutzers: ${error.message}`);
      }
      
      toast({
        title: "Benutzer erstellt",
        description: `Neuer Benutzer mit der E-Mail ${newUserEmail} wurde erfolgreich erstellt.`
      });
      
      // Dialog schließen und Formular zurücksetzen
      setIsUserDialogOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole('user');
      
      // Benutzerliste aktualisieren
      loadUsers();
    } catch (error) {
      console.error("Fehler beim Erstellen des Benutzers:", error);
      toast({
        title: "Fehler",
        description: `Der Benutzer konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Rolle für einen Benutzer hinzufügen
  const handleAddRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist') => {
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
  };

  // Rolle von einem Benutzer entfernen
  const handleRemoveRole = async (userId: string, role: 'admin' | 'user' | 'pharmacist') => {
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
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'pharmacist':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'user':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Neuen Benutzer anlegen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Benutzer anlegen</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-Mail-Adresse</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="benutzer@beispiel.de"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Passwort</Label>
                      <Input 
                        id="password"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Rolle</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newUserRole === 'user' ? "default" : "outline"}
                          onClick={() => setNewUserRole('user')}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Benutzer
                        </Button>
                        <Button
                          type="button"
                          variant={newUserRole === 'pharmacist' ? "default" : "outline"}
                          onClick={() => setNewUserRole('pharmacist')}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Apotheker
                        </Button>
                        <Button
                          type="button"
                          variant={newUserRole === 'admin' ? "default" : "outline"}
                          onClick={() => setNewUserRole('admin')}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-yellow-600 flex items-start mt-2">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                      <p>
                        Achtung: Bitte merken Sie sich das Passwort. Es kann später nicht eingesehen werden.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsUserDialogOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button 
                      onClick={handleCreateUser}
                      disabled={isCreatingUser}
                    >
                      {isCreatingUser ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Wird erstellt...
                        </>
                      ) : (
                        <>Benutzer erstellen</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button onClick={() => loadUsers()} variant="outline" size="sm">
                Aktualisieren
              </Button>
            </div>
            <Table>
              <TableCaption>Liste aller Benutzer und ihrer Rollen</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rollen</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <Badge key={index} variant="outline" className={getRoleBadgeColor(role)}>
                              {role}
                              <button
                                onClick={() => handleRemoveRole(user.id, role as any)}
                                className="ml-1 hover:text-red-600"
                              >
                                ×
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm italic">Keine Rollen</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleAddRole(user.id, 'admin')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          disabled={user.roles.includes('admin')}
                        >
                          <Shield size={14} />
                          Admin
                        </Button>
                        <Button
                          onClick={() => handleAddRole(user.id, 'pharmacist')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          disabled={user.roles.includes('pharmacist')}
                        >
                          <UserCheck size={14} />
                          Apotheker
                        </Button>
                        <Button
                          onClick={() => handleAddRole(user.id, 'user')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          disabled={user.roles.includes('user')}
                        >
                          <UserX size={14} />
                          Benutzer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      Keine Benutzer gefunden
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoleManager;
