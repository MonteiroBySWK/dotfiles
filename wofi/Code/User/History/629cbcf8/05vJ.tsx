import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Carregando as fontes com subsets para otimização
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Melhora o Cumulative Layout Shift (CLS)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Melhora o Cumulative Layout Shift (CLS)
});

export const metadata: Metadata = {
  title: "Thera | Software House",
  description: "Thera Software House - Transformando ideias em tecnologia",
  keywords: ["thera", "software house", "desenvolvimento", "tecnologia"],
  creator: "Thera",
  publisher: "Thera Software House",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevenir zoom em dispositivos móveis para melhor experiência
  themeColor: "#212121"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
