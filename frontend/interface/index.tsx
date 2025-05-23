export interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  available_units: number;
  display_image_url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  display_image_url: string;
  quantity: number;
  available_units: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  showCartPopup: () => void;
}

export interface PurchaseRequest {
  items: Array<{
    id: string;
    quantity: number;
  }>;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    cost: number;
  }>;
  totalCost: number;
}

export interface AdminUser {
  id: string;
  username: string;
  token: string;
}

export interface BulkProduct {
  name: string;
  price: string;
  quantity: string;
  image: File | null;
}
