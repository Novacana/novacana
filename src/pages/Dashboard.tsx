
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrdersList from "@/components/orders/OrdersList";
import { Order } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Package,
  ShoppingBag,
  User,
  Clock,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "1",
    userId: "user1",
    pharmacyName: "Apotheke am Markt",
    pharmacyId: "PHARM123",
    orderNumber: "ORD-2023-001",
    items: [
      {
        id: "item1",
        productId: "1",
        productName: "Bedrocan",
        quantity: 2,
        unitPrice: 125.0,
        totalPrice: 250.0,
      },
      {
        id: "item2",
        productId: "3",
        productName: "Dronabinol Solution 2.5%",
        quantity: 1,
        unitPrice: 275.0,
        totalPrice: 275.0,
      },
    ],
    subtotal: 525.0,
    tax: 99.75,
    total: 624.75,
    status: "delivered",
    paymentMethod: "invoice",
    paymentStatus: "paid",
    shippingAddress: "Marktplatz 1, 10115 Berlin",
    billingAddress: "Marktplatz 1, 10115 Berlin",
    trackingNumber: "TRK12345678",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-18"),
  },
  {
    id: "2",
    userId: "user1",
    pharmacyName: "Apotheke am Markt",
    pharmacyId: "PHARM123",
    orderNumber: "ORD-2023-002",
    items: [
      {
        id: "item3",
        productId: "2",
        productName: "Bediol",
        quantity: 3,
        unitPrice: 115.0,
        totalPrice: 345.0,
      },
    ],
    subtotal: 345.0,
    tax: 65.55,
    total: 410.55,
    status: "shipped",
    paymentMethod: "invoice",
    paymentStatus: "pending",
    shippingAddress: "Marktplatz 1, 10115 Berlin",
    billingAddress: "Marktplatz 1, 10115 Berlin",
    trackingNumber: "TRK87654321",
    createdAt: new Date("2023-07-20"),
    updatedAt: new Date("2023-07-22"),
  },
  {
    id: "3",
    userId: "user1",
    pharmacyName: "Apotheke am Markt",
    pharmacyId: "PHARM123",
    orderNumber: "ORD-2023-003",
    items: [
      {
        id: "item4",
        productId: "6",
        productName: "CBD 10% Oil",
        quantity: 2,
        unitPrice: 150.0,
        totalPrice: 300.0,
      },
      {
        id: "item5",
        productId: "7",
        productName: "THC 5mg Capsules",
        quantity: 1,
        unitPrice: 210.0,
        totalPrice: 210.0,
      },
    ],
    subtotal: 510.0,
    tax: 96.9,
    total: 606.9,
    status: "processing",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    shippingAddress: "Marktplatz 1, 10115 Berlin",
    billingAddress: "Marktplatz 1, 10115 Berlin",
    createdAt: new Date("2023-08-05"),
    updatedAt: new Date("2023-08-05"),
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userInfo, setUserInfo] = useState({
    name: "Dr. Maria Schmidt",
    email: "maria@pharmacy.de",
    pharmacyName: "Apotheke am Markt",
    pharmacyId: "PHARM123",
    role: "pharmacist",
    address: "Marktplatz 1, 10115 Berlin",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = () => {
    // Simulate logout process
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  // Count orders by status
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const processingOrders = orders.filter((order) => order.status === "processing").length;
  const shippedOrders = orders.filter((order) => order.status === "shipped").length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-content py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Pharmacy Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut size={16} />
              <span>Log Out</span>
            </Button>
          </div>
          
          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  ) : (
                    orders.length
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All time
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {isLoading ? (
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  ) : (
                    pendingOrders + processingOrders
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  To be processed
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In Transit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {isLoading ? (
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  ) : (
                    shippedOrders
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Orders in shipment
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Delivered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {isLoading ? (
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  ) : (
                    deliveredOrders
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Completed orders
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <TabsTrigger value="orders" className="data-[state=active]:bg-nova-100 data-[state=active]:text-nova-800 dark:data-[state=active]:bg-nova-900/30 dark:data-[state=active]:text-nova-300">
                <ShoppingBag size={16} className="mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-nova-100 data-[state=active]:text-nova-800 dark:data-[state=active]:bg-nova-900/30 dark:data-[state=active]:text-nova-300">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-nova-100 data-[state=active]:text-nova-800 dark:data-[state=active]:bg-nova-900/30 dark:data-[state=active]:text-nova-300">
                <FileText size={16} className="mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-nova-100 data-[state=active]:text-nova-800 dark:data-[state=active]:bg-nova-900/30 dark:data-[state=active]:text-nova-300">
                <Settings size={16} className="mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Orders
                </h2>
                <Link to="/products">
                  <Button>
                    <Package size={16} className="mr-2" />
                    Order Products
                  </Button>
                </Link>
              </div>
              <OrdersList orders={orders} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="profile">
              <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Pharmacy Profile</CardTitle>
                  <CardDescription>
                    Manage your pharmacy information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Name
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {userInfo.name}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Email
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {userInfo.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Role
                            </label>
                            <p className="text-gray-900 dark:text-white capitalize">
                              {userInfo.role}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Pharmacy Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pharmacy Name
                              </label>
                              <p className="text-gray-900 dark:text-white">
                                {userInfo.pharmacyName}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pharmacy ID
                              </label>
                              <p className="text-gray-900 dark:text-white">
                                {userInfo.pharmacyId}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Address
                              </label>
                              <p className="text-gray-900 dark:text-white">
                                {userInfo.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button variant="outline">
                          Edit Profile
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Documents & Invoices</CardTitle>
                  <CardDescription>
                    Access your invoices and important documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <FileText size={20} className="text-nova-600 dark:text-nova-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Invoice #INV-2023-001
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              June 18, 2023
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <FileText size={20} className="text-nova-600 dark:text-nova-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Invoice #INV-2023-002
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              July 22, 2023
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <FileText size={20} className="text-nova-600 dark:text-nova-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Certificate of Analysis - Bedrocan
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              August 10, 2023
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-6">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Email Notifications
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive email notifications for new products and order updates
                          </p>
                        </div>
                        <Button variant="outline">
                          Configure
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Password
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Change your password
                          </p>
                        </div>
                        <Button variant="outline">
                          Update
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Language Preference
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Current language: English
                          </p>
                        </div>
                        <Button variant="outline">
                          Change
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                        <div>
                          <h3 className="font-medium text-red-700 dark:text-red-400">
                            Delete Account
                          </h3>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
