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
                <p className="text-center text-gray-600 text-xl">
                    Tidak ada produk yang tersedia saat ini.
                </p>
            ) : (
                <>
                    <div className="pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-screen-xl mx-auto">
                        {products.map(product => {
                            return <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />;
                        })}
                    </div>

                    {selected && (
                        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={handleCloseDetail}>
                            <div className="bg-white p-6 rounded-lg w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-white rounded-full hover:bg-gray-200 cursor-pointer absolute -top-12 right-0 p-2" onClick={handleCloseDetail}>
                                    <X />
                                </div>
                                <img src={selected.image} alt="" width={240} className="w-full mb-3 rounded-lg" />
                                <div className="space-y-2">
                                    <h2 className="font-medium text-lg">{selected.name}</h2>
                                    <h5 className="font-medium text-lg">{selected.price.toLocaleString('id-ID')}</h5>
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