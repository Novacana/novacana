
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, FileText, Users, LogOut } from "lucide-react";
import FirstAdminSetup from "@/components/auth/FirstAdminSetup";
import PharmacyVerification from "@/components/auth/PharmacyVerification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Produkte</CardTitle>
                  <Package className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <CardDescription>Durchsuchen Sie alle verfügbaren Produkte</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/products')} className="w-full">
                  Zu den Produkten
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Bestellungen</CardTitle>
                  <ShoppingCart className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <CardDescription>Verwalten Sie Ihre aktuellen Bestellungen</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/orders')} className="w-full">
                  Bestellungen anzeigen
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Dokumentation</CardTitle>
                  <FileText className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <CardDescription>Lesen Sie wichtige Informationen und Hilfestellungen</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
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
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3">#ORD-2023-1205</td>
                    <td className="py-3">05.12.2023</td>
                    <td className="py-3">3 Artikel</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Geliefert</span>
                    </td>
                    <td className="py-3">€250,00</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3">#ORD-2023-1102</td>
                    <td className="py-3">02.11.2023</td>
                    <td className="py-3">1 Artikel</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Abgeschlossen</span>
                    </td>
                    <td className="py-3">€120,00</td>
                  </tr>
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
