"use client";

import { Trash2, Minus, Plus } from "lucide-react";

export default function HandlerButton({ cart, onDelete, onUpdateQuantity }) {
  return (
    <>
      {/* hapus */}
      <button
        onClick={() => onDelete(cart.id)}
        className="p-3 cursor-pointer rounded-full"
      >
        <Trash2 className="size-4 text-red-700" />
      </button>
      {/* container minus, jumlah, dan plus */}
      <div className="sm:h-10 h-8 flex items-center outline outline-gray-500 rounded-full">
        {/* minus */}
        <button
          onClick={() => onUpdateQuantity(cart.id, "decrement")}
          className="p-3 cursor-pointer"
        >
          <Minus className="size-4 text-green-600" />
        </button>
        <input
          type="text"
          className="text-center sm:w-8 w-5"
          readOnly
          value={cart.quantity}
        />
        {/* plus */}
        <button
          onClick={() => onUpdateQuantity(cart.id, "increment")}
          className="p-3 cursor-pointer"
        >
          <Plus className="size-4 text-green-600" />
        </button>
      </div>
    </>
  );
}
