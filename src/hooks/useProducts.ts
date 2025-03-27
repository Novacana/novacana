
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { 
  convertProductFromDB, 
  convertProductToDB,
  convertProductUpdatesToDB 
} from "@/utils/supabaseUtils";

export const useProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const convertedData: Product[] = data.map(convertProductFromDB);
      
      setProducts(convertedData);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    try {
      if (productData.length > 0) {
        // Convert the product to database format with the correct type
        const productToInsert = convertProductToDB(productData[0]);

        // Ensure all required fields are present
        if (!productToInsert.name || !productToInsert.description || 
            !productToInsert.short_description || !productToInsert.image_url || 
            !productToInsert.category || productToInsert.price === undefined) {
          throw new Error("Missing required product fields");
        }

        const { error } = await supabase
          .from('products')
          .insert(productToInsert);

        if (error) throw error;
      }

      toast({
        title: "Product added",
        description: "The product has been successfully added."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const updatesToApply = convertProductUpdatesToDB(updates);
      
      const { error } = await supabase
        .from('products')
        .update(updatesToApply)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "The product has been successfully updated."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted."
      });

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
