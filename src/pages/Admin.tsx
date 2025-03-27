
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, User, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Novacana Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage products, process orders, and view pharmacy information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Products</CardTitle>
                  <Package className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <CardDescription>Manage product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">48</div>
                <Button onClick={() => navigate('/admin/products')} className="w-full">
                  View Products
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Orders</CardTitle>
                  <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <CardDescription>Manage pharmacy orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">12</div>
                <Button onClick={() => navigate('/admin/orders')} className="w-full">
                  View Orders
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Users</CardTitle>
                  <User className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <CardDescription>Manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">24</div>
                <Button variant="outline" className="w-full">
                  View Users
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Settings</CardTitle>
                  <Settings className="text-gray-600 dark:text-gray-400" size={24} />
                </div>
                <CardDescription>Configure system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">
                  <span className="text-sm font-normal text-gray-500">System v1.0.0</span>
                </div>
                <Button variant="outline" className="w-full">
                  View Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="recent">Recent Orders</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b dark:border-gray-700">
                      <th className="pb-2 font-medium">Order #</th>
                      <th className="pb-2 font-medium">Pharmacy</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3">ORD-25-03-18-0001</td>
                      <td className="py-3">MediPharm Berlin</td>
                      <td className="py-3">Mar 18, 2025</td>
                      <td className="py-3">€1,280.00</td>
                      <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span></td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3">ORD-25-03-17-0004</td>
                      <td className="py-3">GreenLeaf Apotheke</td>
                      <td className="py-3">Mar 17, 2025</td>
                      <td className="py-3">€960.50</td>
                      <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Shipped</span></td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3">ORD-25-03-15-0002</td>
                      <td className="py-3">CannaMed Hamburg</td>
                      <td className="py-3">Mar 15, 2025</td>
                      <td className="py-3">€2,145.75</td>
                      <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Delivered</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
                  View All Orders
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-4">System Notifications</h3>
              <ul className="space-y-4">
                <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">New order received</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Order #ORD-25-03-18-0001 from MediPharm Berlin</p>
                </li>
                <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Low stock alert</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Product "Bedrocan" is running low (5 units remaining)</p>
                </li>
                <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">New user registration</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">New pharmacy registered: GreenLeaf Köln</p>
                </li>
              </ul>
              <div className="mt-4 text-right">
                <Button variant="outline" size="sm">
                  View All Notifications
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
