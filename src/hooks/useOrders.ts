
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem, Address } from "@/types";
import { toSnakeCase } from "@/types/supabase";
import { Json } from "@/integrations/supabase/types";

export const useOrders = () => {
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
      return true;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    getNextStatus
  };
};

export const statusColorMap: {
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
