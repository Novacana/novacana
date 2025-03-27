
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { Product, Order, Address, OrderItem } from '@/types';

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
        Insert: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          products: OrderItem[];
          total_amount: number;
          status: string;
          tracking_number?: string;
          shipping_address: Address;
          billing_address: Address;
          payment_method: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;
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
