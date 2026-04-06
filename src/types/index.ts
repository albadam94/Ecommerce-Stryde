export interface Color {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  gender: "men" | "women" | "unisex"
  price: number
  originalPrice?: number
  badge?: "new" | "sale" | "exclusive" | "low-stock"
  rating: number
  reviewCount: number
  colors: Color[]
  sizes: Size[]
  images: string[]
  description: string
  specs: ProductSpec
  collection: string
  inStock: boolean
}

export interface Size {
  label: string
  available: boolean
  lowStock?: boolean
}

export interface ProductSpec {
  material: string
  technology: string
  stretch: string
  moistureWicking: string
  waterResistance: string
  weight: string
  breathability: number
  elasticity: number
  durability: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  color: Color
  quantity: number
  image: string
}

export interface User {
  id: string
  name: string
  email: string
  tier: "standard" | "elite" | "pro"
  points: number
  orders: number
  totalSpent: number
}

export interface Category {
  id: string
  name: string
  slug: string
  productCount: number
  image: string
}

export interface Order {
  id: string
  date: string
  status: "confirmed" | "preparing" | "shipped" | "delivered"
  items: CartItem[]
  total: number
  trackingNumber?: string
}