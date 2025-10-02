import "@/app/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ProductProvider } from "@/lib/product-context";
import { CartProvider } from "@/lib/cart-context";
import LayoutContent from "@/components/layout/LayoutContent";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home",
  description: "Tempat PreOrder Makanan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <LayoutContent>{children}</LayoutContent>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
