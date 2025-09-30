import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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
          <Link href={"/"} className="font-medium text-xl text-green-700 block">
            MyShop
          </Link>
        </header>

        {!isMobile && <hr className="text-gray-300 mb-3" />}

        <nav>
          <ul className="font-semibold text-sm rounded-sm space-y-2">
            <li className="hover:bg-gray-200 rounded">
              <Link
                href="/admin/dashboard"
                className="block py-2 px-3 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined} // Auto-close on mobile link click
              >
                Dashboard
              </Link>
            </li>
            <li className="hover:bg-gray-200 rounded">
              <Link
                href="/admin/transaction"
                className="block py-2 px-3 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined}
              >
                Transaction
              </Link>
            </li>
            <li className="hover:bg-gray-200 rounded">
              <Link
                href="/admin/product"
                className="block py-2 px-3 text-gray-800 rounded-sm"
                onClick={isMobile ? onToggle : undefined}
              >
                Manage Product
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom: User menu */}
      <div className="flex-shrink-0 mt-auto p-2 border-t border-gray-200">
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 w-full">
            <div className="bg-gray-400 p-2 rounded-full flex-shrink-0">
              <img src="/globe.svg" alt="" width={25} height={25} />
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
          <Menu.Items className="absolute left-0 bottom-full mb-2 w-full bg-white shadow rounded-lg p-  2 z-10">
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
