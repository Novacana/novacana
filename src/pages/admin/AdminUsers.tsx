
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import UserRoleManager from "@/components/admin/UserRoleManager";

const AdminUsers = () => {
  return (
    <AdminLayout title="Benutzerverwaltung">
      <UserRoleManager />
    </AdminLayout>
  );
};

export default AdminUsers;
