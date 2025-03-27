import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product, OrderItem, Address } from "@/types";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import OrderSummary from "./OrderSummary";
import AddressForm from "./AddressForm";
import OrderNotes from "./OrderNotes";
import EmptyCart from "./EmptyCart";
import { Json } from "@/integrations/supabase/types";

interface OrderFormProps {
  cartItems: CartItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

const OrderForm = ({
  cartItems,
  products,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: OrderFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingStreet: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "Germany",
    billingName: "",
    billingStreet: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "Germany",
    paymentMethod: "invoice",
    notes: "",
  });

  const cartProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const copyShippingToBilling = () => {
    setFormData({
      ...formData,
      billingName: formData.shippingName,
      billingStreet: formData.shippingStreet,
      billingCity: formData.shippingCity,
      billingPostalCode: formData.shippingPostalCode,
      billingCountry: formData.shippingCountry,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartProducts.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add products before placing an order.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.shippingName || !formData.shippingStreet || !formData.shippingCity || 
        !formData.shippingPostalCode || !formData.billingName || !formData.billingStreet || 
        !formData.billingCity || !formData.billingPostalCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to place an order");
      }
      
      const subtotal = cartProducts.reduce((total, item) => {
        if (!item.product) return total;
        return total + item.product.price * item.quantity;
      }, 0);
      
      const tax = subtotal * 0.19; // 19% VAT
      const total = subtotal + tax;
      
      const orderItems: OrderItem[] = cartProducts.map(item => ({
        productId: item.productId,
        name: item.product?.name || '',
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));
      
      const shippingAddress: Address = {
        name: formData.shippingName,
        street: formData.shippingStreet,
        city: formData.shippingCity,
        postalCode: formData.shippingPostalCode,
        country: formData.shippingCountry
      };
      
      const billingAddress: Address = {
        name: formData.billingName,
        street: formData.billingStreet,
        city: formData.billingCity,
        postalCode: formData.billingPostalCode,
        country: formData.billingCountry
      };
      
      const orderData = {
        user_id: user.id,
        products: orderItems as unknown as Json,
        total_amount: total,
        status: 'pending',
        shipping_address: shippingAddress as unknown as Json,
        billing_address: billingAddress as unknown as Json,
        payment_method: formData.paymentMethod,
        notes: formData.notes || null
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }

      toast({
        title: "Order Placed Successfully",
        description: "Your order has been received and is being processed.",
      });
      
      onClearCart();
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Order submission error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Place Your Order
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {cartProducts.length === 0 ? (
        <EmptyCart />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <OrderSummary 
            cartProducts={cartProducts}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
            onClearCart={onClearCart}
            formatPrice={formatPrice}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddressForm 
              type="shipping"
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
            />
            
            <AddressForm 
              type="billing"
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
              copyShippingToBilling={copyShippingToBilling}
            />
          </div>
          
          <OrderNotes 
            notes={formData.notes}
            onChange={handleInputChange}
          />
          
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading || cartProducts.length === 0}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderForm;
