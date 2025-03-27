
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addUserRole, removeUserRole } from "@/utils/authUtils";
import { User, Shield, UserCheck, UserX } from "lucide-react";

interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Benutzer und deren Rollen laden
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Benutzer von Supabase Auth holen
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw new Error(`Fehler beim Laden der Benutzer: ${authError.message}`);
      }
      
      if (!authUsers?.users?.length) {
        setUsers([]);
        return;
      }
      
      // Rollen für jeden Benutzer holen
      const usersWithRoles: UserWithRoles[] = [];
      
      for (const user of authUsers.users) {
        const { data: roles, error: rolesError } = await supabase.rpc('get_user_roles', {
          _user_id: user.id
        });
        
        if (rolesError) {
          console.error(`Fehler beim Laden der Rollen für Benutzer ${user.id}:`, rolesError);
        }
        
        usersWithRoles.push({
          id: user.id,
          email: user.email || 'Keine E-Mail',
          roles: roles || []
        });
      }
      
      setUsers(usersWithRoles);
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
            <div className="mb-4 flex justify-end">
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
