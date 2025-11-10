import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ClientLayout } from "./_components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthTrack - Employee Health Dashboard",
  description: "Monitor and analyze employee health data from smartwatches in real-time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
