import prisma from '@/lib/prisma';
import ProductCard from "@/components/features/product/ProductCard";

export default async function ProductPage() {
  const products = await prisma.product.findMany();
  return (
    <>
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          Tidak ada produk yang tersedia saat ini.
        </p>
      ) : (
        <div className="pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-screen-xl mx-auto">
          {products.map(p => {
            return <ProductCard key={p.id} product={p} />;
          })}
        </div>
      )}
    </>
  );
}
