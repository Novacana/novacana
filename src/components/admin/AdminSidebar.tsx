
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={18} />
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={18} />
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FileText size={18} />
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <TrendingUp size={18} />
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />
    }
  ];
  
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-medium text-lg">Admin Panel</h2>
        </div>
        <div className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
                onClick={() => navigate(item.path)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">NA</span>
          </div>
          <div>
            <p className="font-medium">Novacana Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@novacana.de</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
          View Website
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
