
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { Product, Order, Address, OrderItem } from '@/types';
import { Json } from '@/integrations/supabase/types';

// Extended Database Definition
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          short_description: string;
          price: number;
          image_url: string;
          category: string;
          stock: number;
          thc_content?: string;
          cbd_content?: string;
          terpenes?: string[];
          weight?: string;
          dosage?: string;
          effects?: string[];
          origin?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'manufacturer' | 'countryOfOrigin' | 'recommendedDosage'>;
        Update: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'manufacturer' | 'countryOfOrigin' | 'recommendedDosage'>>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          products: Json;
          total_amount: number;
          status: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          products: Json;
          total_amount: number;
          status?: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes?: string | null;
        };
        Update: Partial<{
          user_id: string;
          products: Json;
          total_amount: number;
          status: string;
          tracking_number?: string | null;
          shipping_address: Json;
          billing_address: Json;
          payment_method: string;
          notes?: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}

// Utility function to convert camelCase to snake_case for Supabase
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[snakeCaseKey] = toSnakeCase(obj[key]);
    } else {
      result[snakeCaseKey] = obj[key];
    }
  });
  
  return result;
};

// Utility function to convert snake_case to camelCase for Supabase
export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[camelCaseKey] = toCamelCase(obj[key]);
    } else {
      result[camelCaseKey] = obj[key];
    }
  });
  
  return result;
};
