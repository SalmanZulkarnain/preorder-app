import prisma from '@/lib/prisma';
import ProductList from '@/components/features/product/ProductList';

export default async function ProductPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true, 
      name: true, 
      description: true, 
      image: true, 
      price: true
    }
  });
  
  return (
    <ProductList products={products} />
  );
}
