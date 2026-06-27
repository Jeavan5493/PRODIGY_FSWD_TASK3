export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  ingredients: string[];
  sizeOrWeight: string;
  stock: number;
  onSale?: boolean;
  salePrice?: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  sex: string;
  phone: string;
  address: string;
  pincode: string;
  country: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'preparing' | 'transit' | 'delivered';
  deliveryType: 'shipping' | 'eco_courier' | 'pickup';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  email: string;
  paymentMethod?: string;
  couponCode?: string;
  couponDiscount?: number;
  trackingHistory: {
    status: 'pending' | 'preparing' | 'transit' | 'delivered';
    title: string;
    description: string;
    time: string;
  }[];
}

export interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}
