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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-screen-xl mx-auto">
          {products.map(p => {
            return <ProductCard key={p.id} product={p} />;
          })}
        </div>
      )}
    </>
  );
}
