import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Menu } from "@headlessui/react";
import Image from "next/image";

export default function Sidebar({ onToggle, isMobile = false }) {
  const { user } = useAuth();

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <div
      className={`flex flex-col justify-between h-full relative ${
        isMobile ? "p-4 overflow-y-auto" : "p-2"
      }`}
    >
      {/* Bagian atas: logo + menu */}
      <div className="flex-1 overflow-y-auto">
        <header className={`mb-3 p-3 ${isMobile ? "border-b pb-4" : ""}`}>
          {isMobile && (
            <button
              onClick={onToggle}
              className="mb-2 text-gray-500 hover:text-gray-700"
            >
              ✕ {/* Close button for mobile */}
            </button>
          )}
          <Link href={"/admin/dashboard"} className="block text-xl font-medium text-green-600">
            MyShop
          </Link>
        </header>

        {!isMobile && <hr className="mb-3 text-gray-300" />}

        <nav>
          <ul className="space-y-2 text-sm font-semibold rounded-sm">
            <li className="rounded hover:bg-gray-200">
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined} // Auto-close on mobile link click
              >
                Dashboard
              </Link>
            </li>
            <li className="rounded hover:bg-gray-200">
              <Link
                href="/admin/transaction"
                className="block px-3 py-2 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined}
              >
                Transaction
              </Link>
            </li>
            <li className="rounded hover:bg-gray-200">
              <Link
                href="/admin/product"
                className="block px-3 py-2 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined}
              >
                Manage Product
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom: User menu */}
      <div className="flex-shrink-0 p-2 mt-auto border-t border-gray-200">
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center w-full gap-3 p-2 rounded hover:bg-gray-200">
            <div className="flex-shrink-0 p-2 bg-gray-400 rounded-full">
              <Image src="/globe.svg" alt="" width={25} height={25} />
            </div>
            <div
              className={`flex flex-col text-sm text-left ${
                isMobile ? "min-w-0" : ""
              }`}
            >
              <span className="truncate">{user.name}</span>{" "}
              {/* Truncate long names on mobile */}
              <span className="text-gray-500 truncate">{user.email}</span>
            </div>
          </Menu.Button>
          <Menu.Items className="absolute left-0 z-10 w-full mb-2 bg-white rounded-lg shadow bottom-full p- 2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full text-left p-2 text-sm rounded ${
                    active ? "bg-gray-100" : ""
                  }`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu> 
      </div>
    </div>
  );
}
