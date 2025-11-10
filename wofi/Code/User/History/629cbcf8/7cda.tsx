import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Thera",
  description: "Torne Suas Ideias Em Realidade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
