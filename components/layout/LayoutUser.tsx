"use client";
import { ReactNode, useState } from "react";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export default function LayoutUser({ children }: { children: ReactNode }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <Navbar
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setMenuOpen(!isMenuOpen)}
        />
      </header>

      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-md top-16 md:hidden">
          <ul className="flex flex-col p-4 space-y-2 font-semibold text-gray-700">
            <li><Link href="/" className="hover:text-green-600">Home</Link></li>
            <li><Link href="/product" className="hover:text-green-600">Products</Link></li>
            <li><Link href="/cart" className="hover:text-green-600">Cartsaa</Link></li>
            <li><Link href="/invoice" className="hover:text-green-600">Cek Transaksi</Link></li>
          </ul>
        </div>
      )}

      <main className="flex-1 m-4 lg:p-6 mb-12">{children}</main>
      <Footer />
    </div>
  );
}
