import Link from 'next/link'
import ProductCard from '@/app/product/components/ProductCard'
import prisma from '@/lib/prisma'
import type { Product } from '@prisma/client'

const Popular = async () => {
    const products: Product[] = await prisma.product.findMany();

    return (
        <section className="py-12">
            <div className="container max-w-6xl mx-auto">
                <h2 className="mb-12 text-3xl font-bold text-center">Menu Populer</h2>

                <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/product"
                        className="px-6 py-3 font-medium text-green-600 bg-white border border-green-600 rounded hover:bg-green-50"
                    >
                        Lihat Semua Menu
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Popular