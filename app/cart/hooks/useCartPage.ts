import { useState, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { CheckoutSchema, checkoutSchema } from "@/lib/utils/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCartPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string>("");
    const { carts, setCarts, fetchCarts, totalAmount } = useCart();

    const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
    const quantityRefs = useRef<Record<string, number>>({});

    const handleUpdateQuantity = async (cartId: number | string, operation: 'increment' | 'decrement') => {
        const originalCarts = [...carts];

        setCarts((prev) =>
            prev
                .map((cart) => {
                    if (cart.id === cartId) {
                        const newQuantity = operation === "increment" ? cart.quantity + 1 : Math.max(0, cart.quantity - 1);
                        const key = String(cartId);

                        quantityRefs.current[key] = newQuantity;

                        return { ...cart, quantity: newQuantity }
                    }

                    return cart;
                }).filter((cart) => cart.quantity > 0)
        );

        const key = String(cartId);
        if (debounceTimers.current[key]) {
            clearTimeout(debounceTimers.current[key]);
        }

        debounceTimers.current[key] = setTimeout(async () => {
            try {
                const finalQuantity = quantityRefs.current[key];
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${key}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: finalQuantity }),
                });

                if (!res.ok) throw new Error("Update failed");

                const result = await res.json();

                if (result.message === "Cart deleted successfully") {
                    setCarts(prev => prev.filter(cart => cart.id !== cartId))
                }
            } catch (error) {
                setCarts(originalCarts);
            }
        }, 400);
    }

    const handleDelete = async (cartId: number | string) => {
        const originalCarts = [...carts];
        setCarts((prev) => prev.filter((cart) => cart.id !== cartId));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
        } catch (error) {
            setCarts(originalCarts);
        }
    };

    const setPaymentFeedback = (status: string, message: string) => {
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

    const onOrder = async (values: CheckoutSchema) => {
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
                console.log(resultOrder.data.order.id);

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
                    if (!(window as any).snap) {
                        const script = document.createElement("script");
                        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
                        script.setAttribute(
                            "data-client-key",
                            String(process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
                        );
                        script.onload = () => {
                            (window as any).snap?.pay(resultMidtrans.token, callbacks);
                        };
                        document.body.appendChild(script);
                    } else {
                        (window as any).snap?.pay(resultMidtrans.token, callbacks);
                    }
                } else {
                    setPaymentFeedback("error", "Token pembayaran tidak tersedia. Silakan coba lagi.");
                }
            } else {
                toast.error(resultOrder.message);
                setPaymentFeedback("error", resultOrder.message || "Gagal membuat pesanan.");
            }
        } catch (error) {
            toast.error("Gagal membuat pesanan. Silakan coba lagi.");
            setPaymentFeedback("error", "Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

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
    }
} 