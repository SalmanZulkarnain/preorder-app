import CartItemCard from "./CartItemCard";

interface CartListProps {
    carts: any[];
    handleDelete: (cartId: string) => void;
    handleUpdateQuantity: (cartId: string, operation: "increment" | "decrement") => void;
}

const CartList = ({ carts, handleDelete, handleUpdateQuantity }: CartListProps) => {
    return (
        <div className="grid grid-cols-1 gap-2 lg:gap-6 lg:col-span-2">
            {!carts || carts.length === 0 && (
                <p className="p-20 text-xl text-center text-gray-600 lg:col-span-2">
                    Tidak ada produk di keranjang saat ini.
                </p>
            )}
            {carts.map(cart => (
                <CartItemCard
                    key={cart.id}
                    cart={cart}
                    onDelete={handleDelete}
                    onUpdateQuantity={handleUpdateQuantity}
                />
            ))}
        </div>
    )
}

export default CartList;