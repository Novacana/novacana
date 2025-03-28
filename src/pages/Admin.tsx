
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, User, Settings, FileText, TrendingUp, Receipt, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminLayout from "@/components/layout/AdminLayout";

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Verwalten Sie Produkte, bearbeiten Sie Bestellungen und sehen Sie Apothekeninformationen ein.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Produkte</CardTitle>
              <Package className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <CardDescription>Produktinventar verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">48</div>
            <Button onClick={() => navigate('/admin/products')} className="w-full">
              Produkte anzeigen
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Bestellungen</CardTitle>
              <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <CardDescription>Apothekenbestellungen verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">12</div>
            <Button onClick={() => navigate('/admin/orders')} className="w-full">
              Bestellungen anzeigen
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Benutzer</CardTitle>
              <User className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <CardDescription>Registrierte Benutzer verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">24</div>
            <Button 
              onClick={() => navigate('/admin/users')} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Benutzerverwaltung
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Finanzen</CardTitle>
              <Receipt className="text-teal-600 dark:text-teal-400" size={24} />
            </div>
            <CardDescription>Rechnungen und Zahlungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">8</div>
            <Button 
              variant="invoice" 
              onClick={() => navigate('/admin/invoices')} 
              className="w-full"
            >
              Rechnungen anzeigen
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recent">Aktuelle Bestellungen</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-4">Aktuelle Bestellungen</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-2 font-medium">Bestellung #</th>
                  <th className="pb-2 font-medium">Apotheke</th>
                  <th className="pb-2 font-medium">Datum</th>
                  <th className="pb-2 font-medium">Betrag</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">ORD-25-03-18-0001</td>
                  <td className="py-3">MediPharm Berlin</td>
                  <td className="py-3">18. März 2025</td>
                  <td className="py-3">€1.280,00</td>
                  <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">In Bearbeitung</span></td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">ORD-25-03-17-0004</td>
                  <td className="py-3">GreenLeaf Apotheke</td>
                  <td className="py-3">17. März 2025</td>
                  <td className="py-3">€960,50</td>
                  <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Versandt</span></td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3">ORD-25-03-15-0002</td>
                  <td className="py-3">CannaMed Hamburg</td>
                  <td className="py-3">15. März 2025</td>
                  <td className="py-3">€2.145,75</td>
                  <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Geliefert</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
              Alle Bestellungen
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-4">Systembenachrichtigungen</h3>
          <ul className="space-y-4">
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Neue Bestellung eingegangen</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vor 2 Stunden</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Bestellung #ORD-25-03-18-0001 von MediPharm Berlin</p>
            </li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Rechnung überfällig</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vor 6 Stunden</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Rechnung #INV-2023-0003 an CannaMed Hamburg ist überfällig</p>
            </li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Niedriger Lagerbestand</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vor 1 Tag</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Produkt "Bedrocan" hat niedrigen Bestand (5 Einheiten übrig)</p>
            </li>
            <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Neue Anmeldung</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vor 2 Tagen</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Neue Apotheke registriert: GreenLeaf Köln</p>
            </li>
          </ul>
          <div className="mt-4 text-right">
            <Button variant="outline" size="sm">
              Alle Benachrichtigungen
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Admin;
