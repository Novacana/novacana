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
  recommendedDosage?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  pharmacyName: string;
  pharmacyId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'invoice' | 'bank_transfer' | 'credit_card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  billingAddress: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
