'use client'

import Link from 'next/link'
import { BookOpen, Info, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Book } from '@/lib/types/book'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Book Cover Area */}
      <Link href={`/book/${book.id}`} className="block relative aspect-[3/4] w-full bg-muted/30 border-b">
        {book.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-widest opacity-50">No Cover</span>
          </div>
        )}
      </Link>

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
          {book.stock_quantity > 0 ? (
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent-foreground border-accent">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive">
              Out of Stock
            </Badge>
          )}
        </div>
        <Link href={`/book/${book.id}`}>
          <CardTitle className="text-lg leading-snug text-balance hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm mt-1">{book.author}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">
            {book.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          {book.format && <span>{book.format}</span>}
        </div>
        <Button size="sm" variant="outline" asChild className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link href={`/book/${book.id}`}>
            <Info className="h-4 w-4 mr-1 transition-transform group-hover:scale-110" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
