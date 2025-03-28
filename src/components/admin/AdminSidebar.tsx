
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ShoppingCart,
  User,
  Settings,
  BarChart,
  FileText,
  Building,
  FileCheck,
  Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-fit">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Portal</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Verwaltung & Steuerung</p>
      </div>
      <Separator />
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <Link to="/admin">
              <Button 
                variant={isActive("/admin") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <BarChart className="mr-2" size={18} />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/products">
              <Button 
                variant={isActive("/admin/products") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <Package className="mr-2" size={18} />
                Produkte
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">
              <Button 
                variant={isActive("/admin/orders") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <ShoppingCart className="mr-2" size={18} />
                Bestellungen
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/invoices">
              <Button 
                variant={isActive("/admin/invoices") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <Receipt className="mr-2" size={18} />
                Rechnungen
                <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Neu</Badge>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <Button 
                variant={isActive("/admin/users") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <User className="mr-2" size={18} />
                Benutzer
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/admin/pharmacy-verifications">
              <Button 
                variant={isActive("/admin/pharmacy-verifications") ? "secondary" : "ghost"} 
                className="w-full justify-start text-left"
              >
                <FileCheck className="mr-2" size={18} />
                Verifizierungen
              </Button>
            </Link>
          </li>
        </ul>
        
        <Separator className="my-4" />
        
        <ul className="space-y-1">
          <li>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/admin/settings">
                <Settings className="mr-2" size={18} />
                Einstellungen
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
