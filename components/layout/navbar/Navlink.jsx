"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { IoClose, IoMenu } from "react-icons/io5";
import clsx from "clsx";

export default function Navlink() {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <>
      {user?.role !== "ADMIN" && (
        <>
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
          >
            {!open ? (
              <IoMenu className="size-8" />
            ) : (
              <IoClose className="size-8" />
            )}
          </button>
          <div
            className={clsx("w-full md:block md:w-auto", {
              hidden: !open,
            })}
          >
            <ul className="flex flex-col font-semibold text-sm uppercase p-4 mt-4 rounded-sm bg-gray-50 md:flex-row md:items-center md:space-x-10 md:p-0 md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0"
                >
                  Cart ({totalItems})
                </Link>
              </li>
              {!user ? (
                <li className="pt-2 md:pt-0">
                  <Link
                    href="/login"
                    className="py-2.5 px-6 bg-green-700 text-white hover:bg-green-800 rounded-sm"
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
