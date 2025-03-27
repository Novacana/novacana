import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem, Address } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";
import { toSnakeCase, toCamelCase } from "@/types/supabase";
import { Json } from "@/integrations/supabase/types";

// Status color map
const statusColorMap: {
  [key: string]: {
    background: string;
    text: string;
  };
} = {
  pending: {
    background: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
  },
  processing: {
    background: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
  },
  shipped: {
    background: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-800 dark:text-purple-300",
  },
  delivered: {
    background: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
  },
  cancelled: {
    background: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
  },
};

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert data to our Order type with proper JSON handling
      const convertedData: Order[] = data.map(item => {
        const products = (typeof item.products === 'string' 
          ? JSON.parse(item.products) 
          : item.products) as OrderItem[];
          
        const shippingAddress = (typeof item.shipping_address === 'string'
          ? JSON.parse(item.shipping_address)
          : item.shipping_address) as Address;
          
        const billingAddress = (typeof item.billing_address === 'string'
          ? JSON.parse(item.billing_address)
          : item.billing_address) as Address;
        
        return {
          id: item.id,
          userId: item.user_id,
          products: products,
          totalAmount: item.total_amount,
          status: item.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
          trackingNumber: item.tracking_number,
          shippingAddress: shippingAddress,
          billingAddress: billingAddress,
          paymentMethod: item.payment_method,
          notes: item.notes,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        };
      });
      
      setOrders(convertedData);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    updates: { status?: string; trackingNumber?: string; notes?: string }
  ) => {
    try {
      // Convert camelCase to snake_case for Supabase
      const snakeCaseUpdates = toSnakeCase(updates);
      
      const { error } = await supabase
        .from('orders')
        .update(snakeCaseUpdates)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return currentStatus;
    }
    
    return statusFlow[currentIndex + 1];
  };

  if (loading) {
    return (
      <AdminLayout title="Order Management">
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Management">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            There are currently no orders in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-lg">
                    Order #{order.id.substring(0, 8)}
                  </CardTitle>
                  <Badge
                    className={`${
                      statusColorMap[order.status]?.background || "bg-gray-100 dark:bg-gray-800"
                    } ${
                      statusColorMap[order.status]?.text || "text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on {order.createdAt.toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Products</h4>
                    <div className="text-sm">
                      {order.products.map((item, index) => (
                        <div key={index} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <span>{item.name} x{item.quantity}</span>
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between mt-2 font-medium">
                        <span>Total</span>
                        <span>€{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Shipping Address</h4>
                      <p className="text-sm">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Billing Address</h4>
                      <p className="text-sm">
                        {order.billingAddress.name}<br />
                        {order.billingAddress.street}<br />
                        {order.billingAddress.city}, {order.billingAddress.postalCode}<br />
                        {order.billingAddress.country}
                      </p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Tracking Number</h4>
                      <p className="text-sm font-mono">{order.trackingNumber}</p>
                    </div>
                  )}

                  {order.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Notes</h4>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(order.id, {
                            status: getNextStatus(order.status),
                          })
                        }
                      >
                        Mark as {getNextStatus(order.status)}
                      </Button>
                    )}
                    
                    {order.status !== "cancelled" && (
                      <Button
                        variant="destructive"
                        onClick={() =>
                          updateOrderStatus(order.id, { status: "cancelled" })
                        }
                      >
                        Cancel Order
                      </Button>
                    )}
                    
                    {(order.status === "processing" || order.status === "shipped") && !order.trackingNumber && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const trackingNumber = prompt("Enter tracking number:");
                          if (trackingNumber) {
                            updateOrderStatus(order.id, { trackingNumber });
                          }
                        }}
                      >
                        Add Tracking Number
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        const notes = prompt("Enter notes for this order:", order.notes || "");
                        if (notes !== null) {
                          updateOrderStatus(order.id, { notes });
                        }
                      }}
                    >
                      {order.notes ? "Edit Notes" : "Add Notes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
