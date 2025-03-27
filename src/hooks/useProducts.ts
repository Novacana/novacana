
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";

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
      
      const convertedData: Product[] = data.map(item => ({
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
        const {
          manufacturer,
          countryOfOrigin,
          recommendedDosage,
          ...dbProduct
        } = productData[0];
        
        // Convert to the expected format for Supabase
        const productToInsert = {
          name: dbProduct.name,
          description: dbProduct.description,
          short_description: dbProduct.shortDescription,
          price: dbProduct.price,
          image_url: dbProduct.imageUrl,
          category: dbProduct.category,
          stock: dbProduct.stock,
          thc_content: dbProduct.thcContent,
          cbd_content: dbProduct.cbdContent,
          terpenes: dbProduct.terpenes,
          weight: dbProduct.weight,
          dosage: dbProduct.dosage,
          effects: dbProduct.effects,
          origin: dbProduct.origin
        };

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
      const {
        manufacturer,
        countryOfOrigin,
        recommendedDosage,
        ...dbUpdates
      } = updates;
      
      // Convert to the expected format for Supabase
      const updatesToApply: Record<string, any> = {};
      
      if (dbUpdates.name !== undefined) updatesToApply.name = dbUpdates.name;
      if (dbUpdates.description !== undefined) updatesToApply.description = dbUpdates.description;
      if (dbUpdates.shortDescription !== undefined) updatesToApply.short_description = dbUpdates.shortDescription;
      if (dbUpdates.price !== undefined) updatesToApply.price = dbUpdates.price;
      if (dbUpdates.imageUrl !== undefined) updatesToApply.image_url = dbUpdates.imageUrl;
      if (dbUpdates.category !== undefined) updatesToApply.category = dbUpdates.category;
      if (dbUpdates.stock !== undefined) updatesToApply.stock = dbUpdates.stock;
      if (dbUpdates.thcContent !== undefined) updatesToApply.thc_content = dbUpdates.thcContent;
      if (dbUpdates.cbdContent !== undefined) updatesToApply.cbd_content = dbUpdates.cbdContent;
      if (dbUpdates.terpenes !== undefined) updatesToApply.terpenes = dbUpdates.terpenes;
      if (dbUpdates.weight !== undefined) updatesToApply.weight = dbUpdates.weight;
      if (dbUpdates.dosage !== undefined) updatesToApply.dosage = dbUpdates.dosage;
      if (dbUpdates.effects !== undefined) updatesToApply.effects = dbUpdates.effects;
      if (dbUpdates.origin !== undefined) updatesToApply.origin = dbUpdates.origin;
      
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
