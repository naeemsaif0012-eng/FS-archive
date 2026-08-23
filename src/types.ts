export interface Product {
  id: number
  name: string
  subtitle: string
  description: string
  price: number
  main_category: string
  category: string
  status: 'available' | 'reserved' | 'sold'
  badge: 'New' | 'Limited' | null
  quantity: number
  images: string[]
  bg_class: string
  created_at: string
  updated_at: string
}

export interface Category { id: number; name: string; slug: string; main_category: string; created_at: string }
export interface FeaturedResponse { productIds: number[]; items: Product[] }
export interface SiteImages { hero: string | null; hero_mobile: string | null; bags: string | null; jewelry: string | null; accessories: string | null; home: string | null }
