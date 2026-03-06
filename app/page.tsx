import { Suspense } from 'react'
import { BookCatalog } from '@/components/book-catalog'
import { Header } from '@/components/header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<div className="container py-12">Loading...</div>}>
          <BookCatalog />
        </Suspense>
      </main>
    </div>
  )
}
