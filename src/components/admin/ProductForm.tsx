
import React, { useState } from "react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types";

// Define form schema with Zod
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(5, "Short description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  imageUrl: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  thcContent: z.string().optional(),
  cbdContent: z.string().optional(),
  terpenes: z.string().optional(),
  weight: z.string().optional(),
  recommendedDosage: z.string().optional(),
  manufacturer: z.string().optional(),
  countryOfOrigin: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  // If product is provided, format the terpenes array to string for the form
  const defaultValues: Partial<ProductFormValues> = product
    ? {
        ...product,
        terpenes: product.terpenes ? product.terpenes.join(", ") : "",
      }
    : {
        name: "",
        description: "",
        shortDescription: "",
        price: 0,
        imageUrl: "",
        category: "",
        stock: 0,
        thcContent: "",
        cbdContent: "",
        terpenes: "",
        weight: "",
        recommendedDosage: "",
        manufacturer: "",
        countryOfOrigin: "",
      };

  // Setup form with validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    // Format terpenes back to array if provided
    const formattedValues = {
      ...values,
      terpenes: values.terpenes 
        ? values.terpenes.split(",").map(t => t.trim()).filter(t => t) 
        : [],
    };
    
    // If editing, include the ID
    if (product) {
      onSubmit({ id: product.id, ...formattedValues });
    } else {
      onSubmit(formattedValues);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description*</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed product description" 
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (€)*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flower">Flower</SelectItem>
                      <SelectItem value="extract">Extract</SelectItem>
                      <SelectItem value="oil">Oil</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="thcContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>THC Content</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 18%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cbdContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CBD Content</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 0.2%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="terpenes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terpenes</FormLabel>
                  <FormControl>
                    <Input placeholder="Comma separated, e.g.: Myrcene, Pinene" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recommendedDosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommended Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 0.1g - 0.3g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="countryOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Germany" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
