"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartButton from "@/components/CartButton";
import SearchBar from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import Script from "next/script";   // ✅ ADD THIS

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSearch =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* ✅ GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2NCNWVFL7M"
          strategy="afterInteractive"
        />

        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2NCNWVFL7M');
          `}
        </Script>
        {/* ✅ END GOOGLE ANALYTICS */}

        <CartProvider>
          <header className="p-4 bg-blue-700 text-white flex items-center gap-4">
            {!hideSearch && (
              <div className="flex-1">
                <SearchBar />
              </div>
            )}

            <CartButton />
          </header>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}
