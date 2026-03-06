export interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string | null
  stock_quantity: number
  isbn: string | null
  published_year: number | null
  image_url: string | null
  pages: number | null
  language: string | null
  format: string | null
  is_available: boolean
  purchase_instructions: string | null
  created_at: string
  updated_at: string
}

export interface BookInsert {
  title: string
  author: string
  category: string
  description?: string | null
  stock_quantity: number
  isbn?: string | null
  published_year?: number | null
  image_url?: string | null
  pages?: number | null
  language?: string | null
  format?: string | null
  is_available?: boolean
  purchase_instructions?: string | null
}

export interface BookUpdate extends Partial<BookInsert> {
  id: string
}
