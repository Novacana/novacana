
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Package2, 
  UserRound, 
  FileText, 
  Settings, 
  LogOut, 
  Eye, 
  ArrowUpRight 
} from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("orders");

  // Mock data - in einem echten Projekt würde dies aus einer API kommen
  const orderData = {
    total: 3,
    pending: 1,
    inTransit: 1,
    delivered: 1,
    orderList: [
      {
        id: "ORD-2023-001",
        date: "15.06.2023",
        status: "delivered",
        items: 2,
        total: "624,75 €"
      },
      {
        id: "ORD-2023-002",
        date: "20.07.2023",
        status: "shipped",
        items: 1,
        total: "410,55 €"
      },
      {
        id: "ORD-2023-003",
        date: "05.08.2023",
        status: "processing",
        items: 2,
        total: "606,90 €"
      }
    ]
  };

  useEffect(() => {
    // Hier könnten wir API-Aufrufe machen, um echte Daten zu laden
  }, []);

  const handleLogout = () => {
    // Hier würde die Logout-Logik implementiert
    localStorage.removeItem("authToken");
    window.location.href = "/";
    toast({
      title: language === 'de' ? "Erfolgreich abgemeldet" : "Successfully logged out",
      description: language === 'de' 
        ? "Sie wurden erfolgreich von Ihrem Konto abgemeldet." 
        : "You have been successfully logged out of your account.",
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "delivered":
        return t('dashboard.status.delivered');
      case "shipped":
        return t('dashboard.status.shipped');
      case "processing":
        return t('dashboard.status.processing');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.title')}
              </h1>
            </div>
            
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              <span>{t('dashboard.logout')}</span>
            </Button>
          </div>
          
          {/* Dashboard Kacheln */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('dashboard.orders.total')}
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{orderData.total}</p>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.orders.all.time')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('dashboard.orders.pending')}
              </h3>
              <p className="text-4xl font-bold text-amber-500">{orderData.pending}</p>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.orders.to.process')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('dashboard.orders.transit')}
              </h3>
              <p className="text-4xl font-bold text-blue-500">{orderData.inTransit}</p>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.orders.in.shipment')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('dashboard.orders.delivered')}
              </h3>
              <p className="text-4xl font-bold text-green-500">{orderData.delivered}</p>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.orders.completed')}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8 overflow-hidden">
            <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
              <button 
                className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "orders" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <Package2 size={18} />
                <span>{t('dashboard.actions.orders')}</span>
              </button>
              
              <button 
                className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "profile" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <UserRound size={18} />
                <span>{t('dashboard.actions.profile')}</span>
              </button>
              
              <button 
                className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "documents" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("documents")}
              >
                <FileText size={18} />
                <span>{t('dashboard.actions.documents')}</span>
              </button>
              
              <button 
                className={`px-5 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "settings" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} />
                <span>{t('dashboard.actions.settings')}</span>
              </button>
            </div>
            
            {activeTab === "orders" && (
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('dashboard.your.orders')}
                  </h2>
                  
                  <Link to="/products">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <ArrowUpRight size={16} className="mr-2" />
                      {t('dashboard.order.products')}
                    </Button>
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.orderNo')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.date')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.status')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.items')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.total')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('dashboard.table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {orderData.orderList.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {order.items}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === "profile" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('dashboard.actions.profile')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'de' 
                    ? "Profileinstellungen werden in Kürze verfügbar sein." 
                    : "Profile settings will be available soon."}
                </p>
              </div>
            )}
            
            {activeTab === "documents" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('dashboard.actions.documents')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'de' 
                    ? "Dokumentenmanagement wird in Kürze verfügbar sein." 
                    : "Document management will be available soon."}
                </p>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('dashboard.actions.settings')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'de' 
                    ? "Kontoeinstellungen werden in Kürze verfügbar sein." 
                    : "Account settings will be available soon."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
