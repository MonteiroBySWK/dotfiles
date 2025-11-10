"use client"

import type { ReactNode } from "react"

import DashboardSidebar from "@/components/dashboard-sidebar"
import { withAuth } from "@/hooks/use-auth"

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default withAuth(DashboardLayout)
