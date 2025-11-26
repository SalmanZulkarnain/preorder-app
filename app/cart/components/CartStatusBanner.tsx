import { X } from "lucide-react";
import { getPaymentStatusStyle } from "../utils/paymentStatus";

interface CartStatusBannerProps {
    paymentStatus: string | null;
    paymentMessage: string;
    handleDismissPaymentStatus: () => void;
}

const CartStatusBanner = ({ paymentStatus, paymentMessage, handleDismissPaymentStatus }: CartStatusBannerProps) => {
    const { wrapper, Icon } = getPaymentStatusStyle(paymentStatus);
    return (
        <>
        {paymentStatus && (
            <div className={`lg:col-span-3 flex items-start gap-3 p-4 border rounded-sm ${wrapper}`}>
              {Icon && <Icon className="mt-1 size-5" />}
              <div className="flex-1">
                <p className="text-sm font-semibold capitalize">{paymentStatus}</p>
                <p className="text-sm">{paymentMessage}</p>
              </div>
              <button
                type="button"
                aria-label="Tutup notifikasi status pembayaran"
                onClick={handleDismissPaymentStatus}
                className="text-sm text-current hover:opacity-70"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </>
        
    )
}

export default CartStatusBanner;