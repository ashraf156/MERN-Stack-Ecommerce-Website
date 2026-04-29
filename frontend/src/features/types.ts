// ==================== AUTH TYPES ====================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  cart: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface LoginRequest extends AuthRequest {}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

// ==================== CATEGORY TYPES ====================
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category?: Category;
  categories?: Category[];
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

// ==================== PRODUCT TYPES ====================
export interface ProductImage {
  [key: string]: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  content: number;
  images: ProductImage;
  category: string;
  checked: boolean;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  title: string;
  price: number;
  description: string;
  content: number;
  images: ProductImage;
  category: string;
}

export interface UpdateProductRequest {
  title?: string;
  price?: number;
  description?: string;
  content?: number;
  images?: ProductImage;
  category?: string;
  checked?: boolean;
  sold?: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  products?: Product[];
  total?: number;
  pages?: number;
  currentPage?: number;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  total: number;
  currentPage: number;
  pages: number;
}

// ==================== PAGINATION TYPES ====================
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

// ==================== API ERROR TYPES ====================
export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

// ==================== CART TYPES ====================
export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

export interface CartState extends Cart {
  isLoading: boolean;
  isError: boolean;
  message: string;
}
