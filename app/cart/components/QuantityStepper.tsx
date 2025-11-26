import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityStepper = ({ value, onIncrement, onDecrement }: QuantityStepperProps) => {
  return (
    <div className="flex items-center h-8 sm:h-10 rounded-full outline outline-gray-500">
      <button
        type="button"
        onClick={onDecrement}
        className="p-3 cursor-pointer"
        aria-label="Kurangi jumlah"
      >
        <Minus className="size-4 text-green-600" />
      </button>
      <input
        type="text"
        className="w-5 text-sm text-center bg-transparent sm:w-8"
        readOnly
        value={value}
        aria-label="Jumlah produk"
      />
      <button
        type="button"
        onClick={onIncrement}
        className="p-3 cursor-pointer"
        aria-label="Tambah jumlah"
      >
        <Plus className="size-4 text-green-600" />
      </button>
    </div>
  );
};

export default QuantityStepper;

