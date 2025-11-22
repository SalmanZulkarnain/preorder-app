import Link from "next/link";
import Navlink from "@/components/layout/navbar/Navlink";
import { IoMenu } from "react-icons/io5";

export default function Navbar({ isAdmin, onToggleSidebar }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 md:py-4">
      <Link href="/" className="text-xl font-semibold text-green-600">
        PO-Man
      </Link>

      {/* Mobile Hamburger for Admin */}
      {isAdmin && (
        <button
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center p-2 text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
        >
          <IoMenu className="size-6" />
        </button>
      )}

      {/* Non-Admin Nav (hidden for admin) */}
      {!isAdmin && <Navlink />}
    </div>
  );
}
