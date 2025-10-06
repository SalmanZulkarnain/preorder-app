import Link from "next/link";
import Navlink from "@/components/layout/navbar/Navlink";
import { IoMenu } from "react-icons/io5";

export default function Navbar({ isAdmin, onToggleSidebar }) {
  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4 relative flex flex-wrap items-center justify-between">
      <div>
        <Link href="/" className="text-xl font-semibold text-green-600 px-6">
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
      </div>

      {/* Non-Admin Nav (hidden for admin) */}
      {!isAdmin && <Navlink />}
      {/* Admin: Optional quick actions or search here */}

      {isAdmin && (
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm text-gray-600">Admin Mode</span>
        </div>
      )}
    </div>
  );
}
