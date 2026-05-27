export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  colors?: string[];
  mainImage: string;
  hoverImage: string;
  category: 'Dresses' | 'Co-ords' | 'Tops' | 'Blazers' | 'Bags' | 'Shoes';
  tags: string[];
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  reference: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryState: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  loyaltyPoints: number;
  savedAddresses?: string[];
  wishlist?: string[]; // list of product IDs
}
