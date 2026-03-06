'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import type { Book, BookInsert } from '@/lib/types/book'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const CATEGORIES = ['Science', 'Mathematics', 'Language', 'History', 'Geography', 'Economics', 'Technology']

export function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState<Omit<BookInsert, 'price'>>({
    title: '',
    author: '',
    category: 'Science',
    description: '',
    stock_quantity: 0,
    isbn: '',
    published_year: new Date().getFullYear(),
    is_available: true,
    purchase_instructions: '',
    pages: null,
    language: 'Eng',
    format: 'Paperback',
    image_url: '',
  })
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createClient()

  const fetchBooks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title')

    if (error) {
      console.error('[v0] Error fetching books:', error)
      toast.error('Failed to fetch books')
    } else {
      setBooks(data || [])
      setFilteredBooks(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = books.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query)
      )
      setFilteredBooks(filtered)
    } else {
      setFilteredBooks(books)
    }
  }, [searchQuery, books])

  const handleAdd = () => {
    setFormData({
      title: '',
      author: '',
      category: 'Science',
      description: '',
      stock_quantity: 0,
      isbn: '',
      published_year: new Date().getFullYear(),
      is_available: true,
      purchase_instructions: '',
      pages: null,
      language: 'Eng',
      format: 'Paperback',
      image_url: '',
    })
    setIsAddDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('[v0] Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (book: Book) => {
    setSelectedBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description || '',
      stock_quantity: book.stock_quantity,
      isbn: book.isbn || '',
      published_year: book.published_year || new Date().getFullYear(),
      is_available: book.is_available,
      purchase_instructions: book.purchase_instructions || '',
      pages: book.pages || null,
      language: book.language || 'Eng',
      format: book.format || 'Paperback',
      image_url: book.image_url || '',
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (book: Book) => {
    setSelectedBook(book)
    setIsDeleteDialogOpen(true)
  }

  const submitAdd = async () => {
    const { error } = await supabase.from('books').insert([formData])

    if (error) {
      console.error('[v0] Error adding book:', error)
      toast.error('Failed to add book')
    } else {
      toast.success('Book added successfully')
      setIsAddDialogOpen(false)
      fetchBooks()
    }
  }

  const submitEdit = async () => {
    if (!selectedBook) return

    const { error } = await supabase
      .from('books')
      .update(formData)
      .eq('id', selectedBook.id)

    if (error) {
      console.error('[v0] Error updating book:', error)
      toast.error('Failed to update book')
    } else {
      toast.success('Book updated successfully')
      setIsEditDialogOpen(false)
      fetchBooks()
    }
  }

  const submitDelete = async () => {
    if (!selectedBook) return

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', selectedBook.id)

    if (error) {
      console.error('[v0] Error deleting book:', error)
      toast.error('Failed to delete book')
    } else {
      toast.success('Book deleted successfully')
      setIsDeleteDialogOpen(false)
      fetchBooks()
    }
  }

  return (
    <div className="container py-8 px-4 sm:px-6 lg:py-12">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Book Management
        </h1>
        <p className="text-muted-foreground">
          Manage your book catalog with full CRUD operations
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading books...
                </TableCell>
              </TableRow>
            ) : filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    {book.image_url ? (
                      <div className="h-10 w-8 bg-muted rounded overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-8 bg-muted rounded flex items-center justify-center shadow-sm">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{book.category}</Badge>
                  </TableCell>
                  <TableCell>{book.stock_quantity}</TableCell>
                  <TableCell>
                    {book.is_available ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Available</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-300">Unavailable</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{book.isbn || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(book)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new book to the catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url ? (
                  <div className="relative h-24 w-16 bg-muted rounded overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image_url} alt="Cover preview" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 w-16 bg-muted rounded shadow-sm border border-dashed">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity ?? 0}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language || ''}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="e.g., Eng"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="format">Format</Label>
                <Input
                  id="format"
                  value={formData.format || ''}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  placeholder="e.g., Hardcover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Published Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.published_year ?? new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || new Date().getFullYear() })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchase_instructions">Purchase Instructions</Label>
              <textarea
                id="purchase_instructions"
                value={formData.purchase_instructions || ''}
                onChange={(e) => setFormData({ ...formData, purchase_instructions: e.target.value })}
                placeholder="e.g., Available at CHINAR PUBLICATION main office, University Road. Contact: +91 ..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="is_available"
                checked={formData.is_available ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
              />
              <Label htmlFor="is_available">Available for purchase</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdd}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url ? (
                  <div className="relative h-24 w-16 bg-muted rounded overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image_url} alt="Cover preview" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 w-16 bg-muted rounded shadow-sm border border-dashed">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <select
                id="edit-category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-stock">Stock Quantity *</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock_quantity ?? 0}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-pages">Pages</Label>
                <Input
                  id="edit-pages"
                  type="number"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-language">Language</Label>
                <Input
                  id="edit-language"
                  value={formData.language || ''}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-format">Format</Label>
                <Input
                  id="edit-format"
                  value={formData.format || ''}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-isbn">ISBN</Label>
                <Input
                  id="edit-isbn"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-year">Published Year</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.published_year ?? new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) || new Date().getFullYear() })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-purchase_instructions">Purchase Instructions</Label>
              <textarea
                id="edit-purchase_instructions"
                value={formData.purchase_instructions || ''}
                onChange={(e) => setFormData({ ...formData, purchase_instructions: e.target.value })}
                placeholder="e.g., Available at CHINAR PUBLICATION main office, University Road. Contact: +91 ..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="edit-is_available"
                checked={formData.is_available ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
              />
              <Label htmlFor="edit-is_available">Available for purchase</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedBook?.title}</strong> from the catalog.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
