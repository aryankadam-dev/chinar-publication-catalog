import { Suspense } from 'react'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AdminHeader } from '@/components/admin-header'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>
        <Suspense fallback={<div className="container py-12">Loading...</div>}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
}
