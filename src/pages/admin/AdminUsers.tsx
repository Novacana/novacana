
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import UserRoleManager from "@/components/admin/UserRoleManager";

const AdminUsers = () => {
  return (
    <AdminLayout title="Benutzerverwaltung">
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Hier können Sie Benutzer erstellen und deren Rollen verwalten.
        </p>
      </div>
      <UserRoleManager />
    </AdminLayout>
  );
};

export default AdminUsers;
