export type ScreenType = 'catalog' | 'detail' | 'cart' | 'checkout' | 'diy' | 'message' | 'about' | 'login' | 'register';

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  roomSpace: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  shortDesc: string;
  story: string;
  specs: {
    material: string;
    dimensions: string;
    weight: string;
    recycledWasteAmount: string;
    finish: string;
    origin: string;
  };
  careGuide: string[];
  images: string[];
  sizes: { id: string; label: string; dimensions: string; price: number }[];
  waxTones: { id: string; label: string; hex: string }[];
  fittingOptions: { id: string; label: string; priceDelta: number }[];
  inStock: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  waxTone: string;
  fitting: string;
  unitPrice: number;
  quantity: number;
  recycledWasteAmount: string;
}

export interface DIYGuide {
  id: string;
  title: string;
  category: string;
  difficulty: 'Dễ làm (< 30p)' | 'Trung bình (1-2h)' | 'Nâng cao (> 2h)';
  estimatedTime: string;
  materialsNeeded: string[];
  toolsNeeded: string[];
  templateFileName: string;
  downloadCount: number;
  image: string;
  summary: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    tip?: string;
  }[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  roomPhoto?: string;
  helpfulCount: number;
}
