
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { Product, Order } from '@/types';

// Erweiterte Datenbank-Definition
export interface Database extends OriginalDatabase {
  Tables: {
    products: {
      Row: Product;
      Insert: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
      Update: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
    };
    orders: {
      Row: Order;
      Insert: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
      Update: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;
    };
  };
}

// Hilfsfunktion zum Konvertieren von camelCase zu snake_case für Supabase
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Konvertiere camelCase zu snake_case (z.B. shortDescription zu short_description)
    const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    
    // Behandle verschachtelte Objekte rekursiv
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[snakeCaseKey] = toSnakeCase(obj[key]);
    } else {
      result[snakeCaseKey] = obj[key];
    }
  });
  
  return result;
};

// Hilfsfunktion zum Konvertieren von snake_case zu camelCase für Supabase
export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Konvertiere snake_case zu camelCase (z.B. short_description zu shortDescription)
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Behandle verschachtelte Objekte rekursiv
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[camelCaseKey] = toCamelCase(obj[key]);
    } else {
      result[camelCaseKey] = obj[key];
    }
  });
  
  return result;
};
