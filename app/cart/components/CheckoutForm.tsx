import { Toaster } from "sonner"

interface CheckoutFormProps {
    handleOrder: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    name: string;
    setName: (value: string) => void;
    nameErrorMessage: string | null;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    phoneNumberErrorMessage: string | null;
    loading: boolean;
    carts: any[];
    totalAmount: number;
}

const CheckoutForm = ({ handleOrder, name, setName, nameErrorMessage, phoneNumber, setPhoneNumber, phoneNumberErrorMessage, loading, carts, totalAmount }: CheckoutFormProps) => {
    return (
      <div className="col-span-1 p-4 bg-white border border-gray-200 rounded-sm sm:p-6">
      <h3 className="mb-2 font-bold">Informasi Pembeli</h3>
      <Toaster duration={2000} richColors position="top-center"></Toaster>
      <form onSubmit={handleOrder}>
        <div className="mb-4 space-y-2">
          <div>
            <label htmlFor="customerName" className="text-gray-500 text-[12px]">
              Customer Name <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="customerName"
              className="outline px-2 py-1.5 rounded w-full border border-gray-300 focus:border-green-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
            {nameErrorMessage && (
              <span className={`text-xs text-red-700`}>{nameErrorMessage}</span>
            )}
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
              name="phoneNumber"
              id="customerPhone"
              className="outline px-2 py-1.5 rounded w-full border border-gray-300 focus:border-green-500 focus:outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Contoh: 08123456789"
            />
            {phoneNumberErrorMessage && (
              <span className={`text-xs text-red-700`}>{phoneNumberErrorMessage}</span>
            )}
          </div>
        </div>

        <hr className="flex p-0 mb-4 text-gray-300" />

        <h3 className="mb-2 font-bold">Ringkasan Belanja</h3>
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
          {loading ? "Memproses..." : "Pesan"}
        </button>
      </form>
    </div>
    )
}

export default CheckoutForm;