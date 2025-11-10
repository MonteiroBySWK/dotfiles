"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/LoginForm"
import { useAuth } from "@/provider/AuthProvider"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, error } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="absolute top-4 left-4 z-1 justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-mono">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Dashboard Thera
        </a>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/background_login.png"
          alt="Dashboard Preview"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
