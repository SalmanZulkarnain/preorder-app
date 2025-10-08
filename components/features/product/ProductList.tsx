"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@prisma/client";

export default function ProductList({ products }: { products: Product[] }) {
    const [selected, setSelected] = useState(null);

    const handleProductClick = (product: Product) => {
        setSelected(product);
    }

    const handleCloseDetail = () => {
        setSelected(null);
    }

    return (
        <>
            <div className="grid max-w-screen-xl grid-cols-1 gap-2 mx-auto md:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
                {products.map(product => {
                    return <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />;
                })}
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseDetail}>
                    <div className="relative w-full max-w-sm p-6 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute right-0 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-200 -top-12" onClick={handleCloseDetail}>
                            <X />
                        </div>
                        <Image src={selected.image} alt={selected.name} width={240} height={240} className="w-full mb-3 rounded-lg" />
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">{selected.name}</h2>
                            <h5 className="text-lg font-medium">{selected.price.toLocaleString('id-ID')}</h5>
                            <p className="text-gray-500">{selected.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

