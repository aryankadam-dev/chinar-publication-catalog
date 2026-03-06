'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookCard } from '@/components/book-card'
import { createClient } from '@/lib/supabase/client'
import type { Book } from '@/lib/types/book'
import { Label } from '@/components/ui/label'

const CATEGORIES = ['All', 'Science', 'Mathematics', 'Language', 'History', 'Geography', 'Economics', 'Technology']

type SortOption = 'newest' | 'title'

export function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching books:', error)
      } else {
        setBooks(data || [])
      }
      setLoading(false)
    }

    fetchBooks()
  }, [])

  const filteredBooks = useMemo(() => {
    let filtered = books

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query)
      )
    }

    // Sorting
    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return sorted
  }, [books, selectedCategory, searchQuery, sortBy])

  if (loading) {
    return (
      <div className="container py-12 px-4 sm:px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading catalog...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 sm:px-6 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
          Educational Books Catalog
        </h1>
        <p className="text-muted-foreground text-balance">
          Browse our collection of quality educational materials
        </p>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No books found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
