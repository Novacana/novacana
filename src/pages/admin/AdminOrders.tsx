
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Eye, 
  Truck, 
  MoreVertical, 
  Package, 
  XCircle, 
  CheckCircle
} from "lucide-react";

const AdminOrders = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (updateData: { 
      id: string, 
      status?: string, 
      trackingNumber?: string, 
      notes?: string 
    }) => {
      const { id, ...rest } = updateData;
      const { data, error } = await supabase
        .from('orders')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order Updated",
        description: "The order has been successfully updated.",
      });
      setIsUpdateDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle update order status
  const handleUpdateOrder = () => {
    if (!currentOrder) return;
    
    const updateData: any = { id: currentOrder.id };
    
    if (newStatus) {
      updateData.status = newStatus;
    }
    
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    
    if (orderNotes) {
      updateData.notes = orderNotes;
    }
    
    updateOrderMutation.mutate(updateData);
  };

  // Open view dialog
  const openViewDialog = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  // Open update dialog
  const openUpdateDialog = (order: Order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setOrderNotes(order.notes || "");
    setIsUpdateDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Filter by search query
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate total value of orders
  const calculateTotalValue = (orders: Order[]) => {
    return orders.reduce((total, order) => total + order.total, 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="flex flex-col md:flex-row gap-6">
            <AdminSidebar />
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Management
                </h1>
                
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <h3 className="text-2xl font-bold">{orders.length}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ready to Ship</p>
                      <h3 className="text-2xl font-bold">{orders.filter(o => o.status === "processing").length}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <h3 className="text-2xl font-bold">€{calculateTotalValue(orders).toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="search"
                    placeholder="Search orders by number or pharmacy name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Loading orders...</p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Pharmacy</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{order.pharmacyName}</TableCell>
                            <TableCell>{formatDate(order.createdAt.toString())}</TableCell>
                            <TableCell>€{order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === "paid" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.paymentStatus === "pending" 
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => openViewDialog(order)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openUpdateDialog(order)}>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  {order.status === "pending" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setCurrentOrder(order);
                                          setNewStatus("cancelled");
                                          setTrackingNumber("");
                                          setOrderNotes("Order cancelled by admin");
                                          setIsUpdateDialogOpen(true);
                                        }}
                                        className="text-red-600 dark:text-red-400"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Order
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {currentOrder && `Order #${currentOrder.orderNumber} from ${currentOrder.pharmacyName}`}
            </DialogDescription>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Pharmacy Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="font-medium">{currentOrder.pharmacyName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {currentOrder.pharmacyId || "N/A"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <strong>Shipping Address:</strong><br />
                      {currentOrder.shippingAddress}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(currentOrder.status)}`}>
                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-sm">{formatDate(currentOrder.createdAt.toString())}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method:</span>
                      <span className="text-sm">{currentOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        currentOrder.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-800" 
                          : currentOrder.paymentStatus === "pending" 
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {currentOrder.paymentStatus}
                      </span>
                    </div>
                    {currentOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tracking Number:</span>
                        <span className="text-sm">{currentOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">€{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">€{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal:</span>
                    <span>€{currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Tax:</span>
                    <span>€{currentOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>€{currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {currentOrder.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm">{currentOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {currentOrder && currentOrder.status !== "cancelled" && currentOrder.status !== "delivered" && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                openUpdateDialog(currentOrder);
              }}>
                Update Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Order Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              {currentOrder && `Update status for order #${currentOrder.orderNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tracking Number</label>
                <Input 
                  value={trackingNumber} 
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  value={orderNotes} 
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add notes about this order update (optional)"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminOrders;
