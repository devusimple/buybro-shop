// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuyBro - Your One-Stop E-Commerce Destination",
  description: "Discover premium products across electronics, fashion, home & living, and more. Free shipping on orders over $100. Shop now for the best deals!",
  keywords: ["ecommerce", "online shopping", "electronics", "fashion", "home decor", "deals"],
  authors: [{ name: "BuyBro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "BuyBro - Premium Online Shopping",
    description: "Discover premium products with fast shipping and great prices",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "buyBro - Premium Online Shopping",
    description: "Discover premium products with fast shipping and great prices",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
