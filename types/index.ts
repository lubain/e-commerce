// ─── PRODUCT ─────────────────────────────────────────────────────────────────

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
  priceModifier: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption =
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

// ─── CART ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  promoDiscount?: number;
}

// ─── ORDER ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  shippingAddress: ShippingAddress;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserProfile extends User {
  orders: Order[];
  wishlist: WishlistItem[];
  _count: {
    orders: number;
    wishlist: number;
  };
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

// ─── REVIEW ─────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "image">;
  productId: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// ─── API RESPONSES ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  changeType: "increase" | "decrease";
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────

export type CheckoutStep = "shipping" | "payment" | "confirmation";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  promoCode?: string;
}

// ─── STRIPE ──────────────────────────────────────────────────────────────────

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  expiresAt?: Date;
}
