
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import AdminLayout from "@/components/layout/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import ProductSearch from "@/components/admin/ProductSearch";
import ProductList from "@/components/admin/ProductList";
import ProductImport from "@/components/admin/ProductImport"; 
import { useProducts } from "@/hooks/useProducts";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminProducts = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  
  const { 
    products, 
    loading, 
    fetchProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  const handleAddProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    const success = await addProduct(productData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const success = await updateProduct(id, updates);
    if (success) {
      setIsEditing(false);
      setCurrentProduct(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleImportClick = () => {
    setShowImport(true);
  };

  const handleProductsImported = (productsData: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    addProduct(productsData);
    setShowImport(false);
  };

  return (
    <AdminLayout title="Product Management">
      <div className="flex flex-col space-y-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Produkte</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductSearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
              onRefresh={fetchProducts}
              onAddClick={handleAddClick}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-video rounded bg-gray-200 dark:bg-gray-700 mb-4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductList 
                products={products}
                searchTerm={searchTerm}
                onEdit={handleEditClick}
                onDelete={deleteProduct}
              />
            )}
          </TabsContent>
          
          <TabsContent value="import">
            <ProductImport onProductsImported={handleProductsImported} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog 
        open={isEditing && currentProduct !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setCurrentProduct(null);
          }
        }}
      >
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
    </AdminLayout>
  );
};

export default AdminProducts;
