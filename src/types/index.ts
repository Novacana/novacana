
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'doctor';
  pharmacyName?: string;
  pharmacyId?: string;
  address?: string;
  phone?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  thcContent?: string;
  cbdContent?: string;
  terpenes?: string[];
  weight?: string;
  dosage?: string;
  effects?: string[];
  origin?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string; 
  quantity: number;
  price: number;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional fields for UI purposes
  pharmacyName?: string;
  pharmacyId?: string;
  orderNumber?: string;
  items?: OrderItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}
