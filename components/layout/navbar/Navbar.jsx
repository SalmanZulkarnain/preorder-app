import Link from "next/link";
import Navlink from "@/components/layout/navbar/Navlink";
import { IoMenu } from "react-icons/io5";
import { Bell } from "lucide-react";

export default function Navbar({ isAdmin, onToggleSidebar, isSidebarOpen }) {
  return (
    <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 relative">
      <Link href="/" className="text-xl font-medium text-green-700">
        MyShop
      </Link>

      {/* Mobile Hamburger for Admin */}
      {isAdmin && (
        <button
          onClick={onToggleSidebar}
          className="md:hidden inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >
          <IoMenu className="size-6" />
        </button>
      )}

      {/* Non-Admin Nav (hidden for admin) */}
      {!isAdmin && <Navlink />}

      {/* Admin: Optional quick actions or search here */}

      {isAdmin && (
        <div className="hidden md:flex items-center space-x-4">
          {/* Add search, notification, etc., if needed */}
          <span className="text-sm text-gray-600">Admin Mode</span>
          {/* <div className="text-sm text-gray-600 relative">
            <Bell />
            <div className="absolute bg-white shadow-xl p-2 rounded w-70 top-10 right-0">
              <div className="bg-gray-200 rounded p-2">
                <p>New Order From: Salman</p>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
