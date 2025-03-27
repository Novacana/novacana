import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus, Search, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toSnakeCase, toCamelCase } from "@/types/supabase";

const AdminProducts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    try {
      const supabaseData = productData.map(product => {
        const {
          manufacturer,
          countryOfOrigin,
          recommendedDosage,
          ...dbProduct
        } = product;
        
        return toSnakeCase(dbProduct);
      });

      if (supabaseData.length > 0) {
        const { error } = await supabase
          .from('products')
          .insert(supabaseData[0]);

        if (error) throw error;
      }

      toast({
        title: "Product added",
        description: "The product has been successfully added."
      });

      fetchProducts();
      setShowAddForm(false);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const {
        manufacturer,
        countryOfOrigin,
        recommendedDosage,
        ...dbUpdates
      } = updates;
      
      const snakeCaseUpdates = toSnakeCase(dbUpdates);
      
      const { error } = await supabase
        .from('products')
        .update(snakeCaseUpdates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "The product has been successfully updated."
      });

      fetchProducts();
      setIsEditing(false);
      setCurrentProduct(null);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

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
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Product Management">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchProducts}
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleAddProduct} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-video rounded bg-gray-200 dark:bg-gray-700 mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {searchTerm ? "Try adjusting your search term." : "Add a new product to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                  {product.category} | €{product.price.toFixed(2)}
                </p>
                <p className="text-sm mb-4 line-clamp-2">{product.shortDescription}</p>
                <div className="flex justify-between">
                  <Dialog open={isEditing && currentProduct?.id === product.id} onOpenChange={(open) => {
                    if (!open) {
                      setIsEditing(false);
                      setCurrentProduct(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsEditing(true);
                        }}
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      {currentProduct && (
                        <ProductForm 
                          product={currentProduct} 
                          onSubmit={(data) => handleUpdateProduct(currentProduct.id, data[0])}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
