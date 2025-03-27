import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product, OrderItem, Address } from "@/types";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toSnakeCase } from "@/types/supabase";
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

  const subtotal = cartProducts.reduce((total, item) => {
    if (!item.product) return total;
    return total + item.product.price * item.quantity;
  }, 0);
  
  const tax = subtotal * 0.19; // 19% VAT
  const total = subtotal + tax;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
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
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <ShoppingCart size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Your cart is empty
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add products to your cart from our catalog.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate("/products")}>Browse Products</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-card p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cart Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearCart}
                className="text-sm"
              >
                Clear Cart
              </Button>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {cartProducts.map((item) => (
                <div key={item.productId} className="py-4 flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {formatPrice(item.product?.price || 0)} per unit
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQuantity(item.productId, item.quantity - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
                        onClick={() => {
                          const maxStock = item.product?.stock || 0;
                          if (item.quantity < maxStock) {
                            onUpdateQuantity(item.productId, item.quantity + 1);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="ml-4 min-w-[80px] text-right">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </div>
                    
                    <button
                      type="button"
                      className="ml-4 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      onClick={() => onRemoveItem(item.productId)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">VAT (19%)</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatPrice(tax)}
                </span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Information
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingName">Name *</Label>
                  <Input
                    id="shippingName"
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingStreet">Street Address *</Label>
                  <Input
                    id="shippingStreet"
                    name="shippingStreet"
                    value={formData.shippingStreet}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City *</Label>
                    <Input
                      id="shippingCity"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                    <Input
                      id="shippingPostalCode"
                      name="shippingPostalCode"
                      value={formData.shippingPostalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Country *</Label>
                  <Select
                    value={formData.shippingCountry}
                    onValueChange={handleSelectChange("shippingCountry")}
                  >
                    <SelectTrigger id="shippingCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Austria">Austria</SelectItem>
                      <SelectItem value="Switzerland">Switzerland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Billing Information
                </h3>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={copyShippingToBilling}
                  className="text-sm"
                >
                  Same as shipping
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingName">Name *</Label>
                  <Input
                    id="billingName"
                    name="billingName"
                    value={formData.billingName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billingStreet">Street Address *</Label>
                  <Input
                    id="billingStreet"
                    name="billingStreet"
                    value={formData.billingStreet}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">City *</Label>
                    <Input
                      id="billingCity"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingPostalCode">Postal Code *</Label>
                    <Input
                      id="billingPostalCode"
                      name="billingPostalCode"
                      value={formData.billingPostalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billingCountry">Country *</Label>
                  <Select
                    value={formData.billingCountry}
                    onValueChange={handleSelectChange("billingCountry")}
                  >
                    <SelectTrigger id="billingCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Austria">Austria</SelectItem>
                      <SelectItem value="Switzerland">Switzerland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={handleSelectChange("paymentMethod")}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Notes
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Special delivery instructions or other notes"
                rows={3}
              />
            </div>
          </div>
          
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
