import prisma from '@/lib/prisma';
import ProductList from '@/components/features/product/ProductList';
import type { Product } from '@prisma/client';

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
