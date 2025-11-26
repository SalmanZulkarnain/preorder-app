import Image from "next/image";
import { Trash2 } from "lucide-react";
import QuantityStepper from "./QuantityStepper";

interface CartItemCardProps {
  cart: any;
  onDelete: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, operation: "increment" | "decrement") => void;
}

const CartItemCard = ({ cart, onDelete, onUpdateQuantity }: CartItemCardProps) => {
  return (
    <div className="flex flex-row gap-2 p-4 duration-100 bg-white border border-gray-200 rounded-sm cursor-pointer hover:outline hover:outline-green-600 hover:shadow-sm sm:p-0">
      <div className="relative rounded sm:size-40 size-20 sm:p-4">
        <Image
          src={cart.product.image}
          alt={cart.product.name}
          width={256}
          height={256}
          className="object-cover w-full h-full rounded"
        />
      </div>
      <div className="flex flex-col justify-between flex-1 gap-2 sm:p-4 sm:gap-0">
        <div className="flex flex-wrap justify-between space-x-2 space-y-2 sm:flex-col">
          <h4 className="text-sm font-medium sm:text-base">{cart.product.name}</h4>
          <h4 className="font-semibold">{cart.product.price.toLocaleString("id-ID")}</h4>
        </div>
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onDelete(cart.id)}
            className="p-3 rounded-full cursor-pointer"
            aria-label="Hapus produk dari keranjang"
          >
            <Trash2 className="size-4 text-red-700" />
          </button>
          <QuantityStepper
            value={cart.quantity}
            onDecrement={() => onUpdateQuantity(cart.id, "decrement")}
            onIncrement={() => onUpdateQuantity(cart.id, "increment")}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;

