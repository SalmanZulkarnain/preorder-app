"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { X } from "lucide-react";

export default function ProductList({ products }) {
    const [selected, setSelected] = useState(null);

    const handleProductClick = (product) => {
        setSelected(product);
    }

    const handleCloseDetail = () => {
        setSelected(null);
    }

    return (
        <>
            {products.length === 0 ? (
                <p className="text-xl text-center text-gray-600">
                    Tidak ada produk yang tersedia saat ini.
                </p>
            ) : (
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
                                <img src={selected.image} alt="" width={240} className="w-full mb-3 rounded-lg" />
                                <div className="space-y-2">
                                    <h2 className="text-lg font-medium">{selected.name}</h2>
                                    <h5 className="text-lg font-medium">{selected.price.toLocaleString('id-ID')}</h5>
                                    <p className="text-gray-500">{selected.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}