
import { Product, Order, OrderItem, Address } from "@/types";
import { Json } from "@/integrations/supabase/types";
import { toSnakeCase, toCamelCase } from "@/types/supabase";

/**
 * Converts a product from Supabase database format to application format
 */
export const convertProductFromDB = (item: any): Product => ({
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
});

/**
 * Converts a product to Supabase database format for insertion
 */
export const convertProductToDB = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Record<string, any> => {
  // Extract fields that need special handling
  const {
    shortDescription,
    imageUrl,
    thcContent,
    cbdContent,
    dosage,
    recommendedDosage,
    manufacturer,
    countryOfOrigin,
    ...rest
  } = product;

  // Create the database-ready object
  return {
    ...rest,
    short_description: shortDescription,
    image_url: imageUrl,
    thc_content: thcContent,
    cbd_content: cbdContent,
    dosage: recommendedDosage || dosage,
    // Ignore manufacturer and countryOfOrigin as they don't map to DB fields
  };
};

/**
 * Safely parse JSON from string or return the object if already parsed
 */
export const safeParseJson = <T>(jsonData: string | any): T => {
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData) as T;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return {} as T;
    }
  }
  return jsonData as T;
};

/**
 * Converts an order from Supabase database format to application format
 */
export const convertOrderFromDB = (item: any): Order => {
  const products = safeParseJson<OrderItem[]>(item.products);
  const shippingAddress = safeParseJson<Address>(item.shipping_address);
  const billingAddress = safeParseJson<Address>(item.billing_address);
  
  return {
    id: item.id,
    userId: item.user_id,
    products,
    totalAmount: item.total_amount,
    status: item.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber: item.tracking_number,
    shippingAddress,
    billingAddress,
    paymentMethod: item.payment_method,
    notes: item.notes,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  };
};

/**
 * Prepares order updates for Supabase by converting camelCase to snake_case
 */
export const prepareOrderUpdates = (updates: Partial<Order>): Record<string, any> => {
  return toSnakeCase(updates);
};

/**
 * Converts a partial product update to database format
 */
export const convertProductUpdatesToDB = (updates: Partial<Product>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  if (updates.name !== undefined) result.name = updates.name;
  if (updates.description !== undefined) result.description = updates.description;
  if (updates.shortDescription !== undefined) result.short_description = updates.shortDescription;
  if (updates.price !== undefined) result.price = updates.price;
  if (updates.imageUrl !== undefined) result.image_url = updates.imageUrl;
  if (updates.category !== undefined) result.category = updates.category;
  if (updates.stock !== undefined) result.stock = updates.stock;
  if (updates.thcContent !== undefined) result.thc_content = updates.thcContent;
  if (updates.cbdContent !== undefined) result.cbd_content = updates.cbdContent;
  if (updates.terpenes !== undefined) result.terpenes = updates.terpenes;
  if (updates.weight !== undefined) result.weight = updates.weight;
  if (updates.dosage !== undefined) result.dosage = updates.dosage;
  if (updates.recommendedDosage !== undefined) result.dosage = updates.recommendedDosage;
  if (updates.effects !== undefined) result.effects = updates.effects;
  if (updates.origin !== undefined) result.origin = updates.origin;
  
  return result;
};
