import prisma from '@/lib/db';
import type { Product } from '@/prisma/generated/prisma/client';
import ProductList from './components/ProductList';

export default async function ProductPage() {
  const products: Product[] = await prisma.product.findMany();

  return (
    <>
      {products.length < 1 ? (
        <p className="text-xl text-center text-gray-600">
          Tidak ada produk yang tersedia saat ini.
        </p>
      ) : <ProductList products={products} />
      }
    </>
  );
}
