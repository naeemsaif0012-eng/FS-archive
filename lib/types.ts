export interface DbProduct {
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

export interface DbCategory {
  id: number
  name: string
  slug: string
  main_category: string
  created_at: string
}
