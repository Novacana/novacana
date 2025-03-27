
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, FileText, LogOut } from "lucide-react";
import FirstAdminSetup from "@/components/auth/FirstAdminSetup";
import PharmacyVerification from "@/components/auth/PharmacyVerification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { orders } = useOrders();

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    getCurrentUser();
  }, []);

  // Handle logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Fehler beim Abmelden:", error);
        toast({
          title: "Fehler",
          description: "Beim Abmelden ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      
      // Redirect to home page after logout
      navigate("/");
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
      toast({
        title: "Fehler",
        description: "Beim Abmelden ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Willkommen zurück! Hier können Sie Ihre Bestellungen verwalten und Produkte durchsuchen.
              </p>
            </div>
            
            {/* Logout Button */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Abmelden
            </Button>
          </div>

          {/* Admin-Setup-Komponente - wird nur angezeigt, wenn keine Administratoren existieren */}
          <FirstAdminSetup />
          
          {/* Apotheken-Verifizierungskomponente - nur für nicht-verifizierte Apotheken anzeigen */}
          {userId && <PharmacyVerification userId={userId} />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Produkte</CardTitle>
                  <Package className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <CardDescription>Durchsuchen Sie alle verfügbaren Produkte</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button onClick={() => navigate('/products')} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Zu den Produkten
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Bestellungen</CardTitle>
                  <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <CardDescription>Verwalten Sie Ihre aktuellen Bestellungen</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button onClick={() => navigate('/orders')} className="w-full">
                  Bestellungen anzeigen
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Dokumentation</CardTitle>
                  <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <CardDescription>Lesen Sie wichtige Informationen und Hilfestellungen</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate('/documentation')}>
                  Zur Dokumentation
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Neueste Bestellungen</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-2 font-medium">Bestellnummer</th>
                    <th className="pb-2 font-medium">Datum</th>
                    <th className="pb-2 font-medium">Produkte</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 3).map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3">{order.orderNumber || `#${order.id.substring(0, 8)}`}</td>
                        <td className="py-3">{new Date(order.createdAt).toLocaleDateString('de-DE')}</td>
                        <td className="py-3">{order.items.length} Artikel</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'pending' ? 'Ausstehend' :
                             order.status === 'processing' ? 'In Bearbeitung' :
                             order.status === 'shipped' ? 'Versendet' :
                             order.status === 'delivered' ? 'Geliefert' :
                             'Storniert'}
                          </span>
                        </td>
                        <td className="py-3">
                          {new Intl.NumberFormat('de-DE', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          }).format(order.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        Keine Bestellungen vorhanden
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                Alle Bestellungen anzeigen
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
