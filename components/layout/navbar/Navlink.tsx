"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { IoClose, IoMenu } from "react-icons/io5";
import clsx from "clsx";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";

export default function Navlink() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <>
      {user?.role !== "ADMIN" && (
        <>
          <div className="flex items-center justify-center">
            <Link
              href="/cart"
              className="block relative px-3 py-2 text-gray-500 font-bold md:p-0 hover:text-black md:hidden"
            >
              <ShoppingCart /> <span className="absolute -top-2 text-sm right-0 bg-red-500 px-1 rounded text-red-200">{totalItems}</span>
            </Link>
            <button
              onClick={() => {
                setOpen(!open);
              }}
              className="inline-flex items-center justify-center p-2 text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
            >
              {!open ? (
                <IoMenu className="size-8" />
              ) : (
                <IoClose className="size-8" />
              )}
            </button>
          </div>

          <div
            className={clsx(
              "absolute md:static bg-white top-full left-0 w-full md:block md:w-auto transform transition-all duration-300 ease-in-out origin-top md:duration-0",
              {
                "max-h-0 overflow-hidden md:max-h-none": !open,
                "max-h-screen md:max-h-none": open
              }
            )}
          >
            <ul className="flex flex-col p-4 text-sm font-semibold uppercase rounded-sm shadow-sm md:p-0 md:flex-row md:items-center md:shadow-none md:space-x-10 md:bg-white">
              <li>
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-600 md:p-0 hover:text-black "
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="block px-3 py-2 text-gray-600 md:p-0 hover:text-black "
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-gray-600 md:p-0 hover:text-black "
                >
                  Cart ({totalItems})
                </Link>
              </li>
              <li>
                <Link
                  href="/invoice"
                  className="block px-3 py-2 text-gray-600 md:p-0 hover:text-black "
                >
                  Cek Transaksi
                </Link>
              </li>
              {!user ? (
                <li>
                  <Link
                    href="/login"
                    className="block py-2 px-3 md:py-2.5 md:px-6 md:bg-green-600 md:text-gray-100 rounded"
                  >
                    Sign In
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
