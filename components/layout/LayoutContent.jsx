"use client";

import Navbar from "@/components/layout/navbar/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function LayoutContent({ children }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay (for admin only) */}
      {user?.role === "ADMIN" && (
        <>
          {/* Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Sidebar Drawer */}
          <aside
            className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col`}
          >
            <Sidebar onToggle={toggleSidebar} isMobile={true} />
          </aside>
        </>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar (hidden on mobile) */}
        {user?.role === "ADMIN" && (
          <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg fixed left-0 top-0 h-screen">
            <Sidebar onToggle={null} />
          </aside>
        )}

        {/* Main Content */}
        <div className={`flex flex-col flex-1 w-full ${user?.role === "ADMIN" ? 'md:ml-64' : ''}`}>
          <header className="sticky inset-x-0 top-0 w-full bg-white shadow-sm z-10">
            <Navbar
              isAdmin={user?.role === "ADMIN"}
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
          </header>

          <div className="md:pt-0 md:pl-0 pl-0 md:pr-0 pr-0">
            <main className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen w-full">
              {children}
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
