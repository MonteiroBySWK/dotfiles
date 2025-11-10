"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import MainDashboard from "@/components/MainDashboard"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <MainDashboard />
        </div>
  
  )
}
