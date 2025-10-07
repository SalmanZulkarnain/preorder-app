"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/ui/Footer";

export default function LayoutAdmin({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="fixed hidden w-64 h-full bg-white shadow-lg md:flex md:flex-col">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="fixed inset-x-0 top-0 z-30 bg-white shadow-sm">
          <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        </header>

        <main className="min-h-screen p-4 pt-16 sm:p-6 md:p-10 bg-gray-50">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
