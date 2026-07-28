import { Toaster } from "sonner";
import { CheckoutSchema } from "@/lib/utils/zodSchema";
import { Cart } from "@/generated/prisma/client";
import { UseFormReturn } from "react-hook-form";

interface CheckoutFormProps {
  loading: boolean;
  carts: Cart[];
  totalAmount: number;
  form: UseFormReturn<CheckoutSchema>;
  onOrder: (values: CheckoutSchema, e?: React.BaseSyntheticEvent) => Promise<void>;
}

const CheckoutForm = ({ loading, carts, totalAmount, form, onOrder }: CheckoutFormProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    form.setValue('phoneNumber', value);
  }

  return (
    <div className="col-span-1 p-4 bg-white border border-gray-200 rounded-sm sm:p-6">
      <h3 className="mb-2 font-bold">Customer Information</h3>
      <Toaster duration={2000} richColors position="top-center"></Toaster>
      <form onSubmit={form.handleSubmit(onOrder)}>
        <div className="mb-4 space-y-2">
          <div>
            <label htmlFor="customerName" className="text-gray-500 text-[12px]">
              Customer Name <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              placeholder="Budi Santoso"
              className="outline p-2 rounded-md w-full border border-gray-300 focus:border-green-500 outline-gray-200 focus:outline-none"
              {...form.register('name')}
            />
            <span className={`text-xs text-red-700`}>{form.formState.errors.name?.message}</span>
          </div>
          <div>
            <label
              htmlFor="customerPhone"
              className="text-gray-500 text-[12px]"
            >
              Customer Phone <span className="text-red-700">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              id="customerPhone"
              placeholder="08123456789"
              className="outline p-2 rounded-md w-full border border-gray-300 focus:border-green-500 outline-gray-200 focus:outline-none"
              {...form.register('phoneNumber', { onChange: handlePhoneChange })}
            />
            <span className={`text-xs text-red-700`}>{form.formState.errors.phoneNumber?.message}</span>
          </div>
        </div>

        <hr className="flex p-0 mb-4 text-gray-300" />

        <h3 className="mb-2 font-bold">Payment Summary</h3>
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-sm text-gray-500">Total ({carts.length} item)</h5>
          <h5 className="font-bold">Rp{totalAmount.toLocaleString("id-ID")}</h5>
        </div>

        <hr className="flex p-0 mb-4 text-gray-300" />

        <button
          type="submit"
          className="w-full py-3 text-sm font-medium text-white transition-colors bg-green-600 rounded-md cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  )
}

export default CheckoutForm;