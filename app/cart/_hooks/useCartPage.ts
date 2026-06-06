import { useState, useRef } from "react";
import { useCart } from "@/lib/contexts/cart-context";
import { toast } from "sonner";
import { CheckoutSchema, checkoutSchema } from "@/lib/utils/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type PaymentStatus = "success" | "pending" | "error" | "warning" | null;

export const useCartPage = () => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
    const [paymentMessage, setPaymentMessage] = useState("");
    const { carts, setCarts, fetchCarts, totalAmount } = useCart();

    const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const quantityRefs = useRef<Record<number, number>>({});

    const handleUpdateQuantity = async (cartId: number, operation: "increment" | "decrement") => {
        const originalCarts = [...carts];

        setCarts((prev) =>
            prev
                .map((cart) => {
                    if (cart.id === cartId) {
                        const newQuantity = operation === "increment" ? cart.quantity + 1 : Math.max(0, cart.quantity - 1);

                        quantityRefs.current[cartId] = newQuantity;

                        return { ...cart, quantity: newQuantity };
                    }

                    return cart;
                }).filter((cart) => cart.quantity > 0)
        );

        if (debounceTimers.current[cartId]) {
            clearTimeout(debounceTimers.current[cartId]);
        }

        debounceTimers.current[cartId] = setTimeout(async () => {
            try {
                const finalQuantity = quantityRefs.current[cartId];
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: finalQuantity }),
                });

                if (!res.ok) throw new Error("Update failed");

                const result = await res.json();

                if (result.message === "Cart deleted successfully") {
                    setCarts(prev => prev.filter(cart => cart.id !== cartId));
                }
            } catch {
                setCarts(originalCarts);
            }
        }, 400);
    };

    const handleDelete = async (cartId: number) => {
        const originalCarts = [...carts];
        setCarts((prev) => prev.filter((cart) => cart.id !== cartId));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
        } catch {
            setCarts(originalCarts);
        }
    };

    const setPaymentFeedback = (status: PaymentStatus, message: string) => {
        setPaymentStatus(status);
        setPaymentMessage(message);
    };

    const handleDismissPaymentStatus = () => {
        setPaymentStatus(null);
        setPaymentMessage("");
    };

    const form = useForm<CheckoutSchema>({
        resolver: zodResolver(checkoutSchema)
    });

    const callbacks = {
        onSuccess: function () {
            toast.success("Pembayaran berhasil!");
            fetchCarts();
            setPaymentFeedback("success", "Pembayaran berhasil! Kami akan segera memproses pesanan Anda.");
        },
        onPending: function () {
            toast.info("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
            setPaymentFeedback("pending", "Pembayaran Anda masih menunggu. Silakan selesaikan prosesnya.");
        },
        onError: function () {
            toast.error("Pembayaran gagal. Silakan coba lagi.");
            setPaymentFeedback("error", "Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: function () {
            toast.warning("Anda menutup popup pembayaran.");
            setPaymentFeedback("warning", "Anda menutup jendela pembayaran. Lanjutkan pembayaran untuk menyelesaikan pesanan.");
        },
    };

    const onOrder = async (values: CheckoutSchema, e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();
        handleDismissPaymentStatus();

        setLoading(true);

        try {
            const resOrder = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    phoneNumber: values.phoneNumber,
                }),
                credentials: "include",
            });

            const resultOrder = await resOrder.json();

            if (resultOrder.success) {
                toast.success(resultOrder.message);
                form.reset();

                const resMidtrans = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/midtrans`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderId: resultOrder.data.order.id }),
                    }
                );

                const resultMidtrans = await resMidtrans.json();

                if (resultMidtrans.token) {
                    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
                    if (!window.snap) {
                        const script = document.createElement("script");
                        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
                        script.setAttribute("data-client-key", clientKey);
                        script.onload = () => {
                            window.snap?.pay(resultMidtrans.token, callbacks);
                        };
                        document.body.appendChild(script);
                    } else {
                        window.snap.pay(resultMidtrans.token, callbacks);
                    }
                } else {
                    setPaymentFeedback("error", "Token pembayaran tidak tersedia. Silakan coba lagi.");
                }
            } else {
                toast.error(resultOrder.message);
                setPaymentFeedback("error", resultOrder.message || "Gagal membuat pesanan.");
            }
        } catch {
            toast.error("Gagal membuat pesanan. Silakan coba lagi.");
            setPaymentFeedback("error", "Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        paymentStatus,
        paymentMessage,
        handleUpdateQuantity,
        handleDelete,
        handleDismissPaymentStatus,
        onOrder,
        totalAmount,
        carts,
    };
};
