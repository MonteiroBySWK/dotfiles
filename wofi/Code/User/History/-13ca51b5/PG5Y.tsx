import type React from "react"
import { Montserrat, Open_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Load Montserrat font with all required weights
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

// Load Open Sans font with all required weights
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata = {
  title: "Technos – Empresa Júnior | Soluções em Hardware & Software",
  description:
    "Technos – EJ UEMA: montagem, manutenção, consultoria e desenvolvimento de sistemas em Engenharia da Computação.",
  openGraph: {
    title: "Technos – Empresa Júnior de Engenharia da Computação",
    description: "Serviços de hardware e software prestados por alunos de Engenharia da Computação da UEMA.",
    url: "https://technosjr.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
