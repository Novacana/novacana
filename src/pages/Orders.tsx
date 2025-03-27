
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderForm from "@/components/orders/OrderForm";
import { CartItem, Product, OrderItem } from "@/types";
import { products as mockProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toSnakeCase, toCamelCase } from "@/types/supabase";

const Orders = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    };

    // Fetch products from Supabase
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data.length > 0) {
          const transformedProducts = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            shortDescription: item.short_description,
            price: item.price,
            imageUrl: item.image_url,
            category: item.category,
            stock: item.stock,
            thcContent: item.thc_content,
            cbdContent: item.cbd_content,
            terpenes: item.terpenes,
            weight: item.weight,
            dosage: item.dosage,
            effects: item.effects,
            origin: item.origin,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at)
          }));
          setProducts(transformedProducts);
        } else {
          // Fallback to mock data if no products in database
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        });
        // Fallback to mock data on error
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
    fetchProducts();
  }, [toast]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-content py-8">
          <OrderForm
            cartItems={cartItems}
            products={products}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
