
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, UserX } from "lucide-react";

interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

interface UserListProps {
  users: UserWithRoles[];
  onAddRole: (userId: string, role: 'admin' | 'user' | 'pharmacist') => void;
  onRemoveRole: (userId: string, role: 'admin' | 'user' | 'pharmacist') => void;
}

const UserList: React.FC<UserListProps> = ({ users, onAddRole, onRemoveRole }) => {
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
                        onClick={() => onRemoveRole(user.id, role as any)}
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
                  onClick={() => onAddRole(user.id, 'admin')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={user.roles.includes('admin')}
                >
                  <Shield size={14} />
                  Admin
                </Button>
                <Button
                  onClick={() => onAddRole(user.id, 'pharmacist')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={user.roles.includes('pharmacist')}
                >
                  <UserCheck size={14} />
                  Apotheker
                </Button>
                <Button
                  onClick={() => onAddRole(user.id, 'user')}
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
  );
};

export default UserList;
