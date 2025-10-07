"use client";
import { useState } from "react";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/ui/Footer";

export default function LayoutUser({ children }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <Navbar
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setMenuOpen(!isMenuOpen)}
        />
      </header>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-md top-16 md:hidden">
          <ul className="flex flex-col p-4 space-y-2 font-semibold text-gray-700">
            <li><a href="/" className="hover:text-green-600">Home</a></li>
            <li><a href="/product" className="hover:text-green-600">Products</a></li>
            <li><a href="/cart" className="hover:text-green-600">Cart</a></li>
          </ul>
        </div>
      )}

      <main className="flex-1 p-2 sm:p-4 lg:p-6">{children}</main>
      <Footer />
    </div>
  );
}
