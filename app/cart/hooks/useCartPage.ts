import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRef } from "react";
import { toast } from "sonner";
import { validateCheckoutForm } from "../utils/validation";

export const useCartPage = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentMessage, setPaymentMessage] = useState("");
    const { carts, setCarts, fetchCarts, totalAmount } = useCart();

    const debounceTimers = useRef({});
    const quantityRefs = useRef({});

    const handleUpdateQuantity = async (cartId, operation) => {
        const originalCarts = [...carts];

        setCarts((prev) =>
            prev
                .map((cart) => {
                    if (cart.id === cartId) {
                        const newQuantity = operation === "increment" ? cart.quantity + 1 : Math.max(0, cart.quantity - 1);

                        quantityRefs.current[cartId] = newQuantity;

                        return { ...cart, quantity: newQuantity }
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
                    setCarts(prev => prev.filter(cart => cart.id !== cartId))
                }
            } catch (error) {
                setCarts(originalCarts);
            }
        }, 400);
    }

    const handleDelete = async (cartId) => {
        const originalCarts = [...carts];
        setCarts((prev) => prev.filter((cart) => cart.id !== cartId));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
        } catch (error) {
            setCarts(originalCarts);
        }
    };

    const setPaymentFeedback = (status, message) => {
        setPaymentStatus(status);
        setPaymentMessage(message);
    };

    const handleDismissPaymentStatus = () => {
        setPaymentStatus(null);
        setPaymentMessage("");
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        handleDismissPaymentStatus();

        const { nameError, phoneError, hasError } = validateCheckoutForm(name, phoneNumber);
        setNameErrorMessage(nameError);
        setPhoneNumberErrorMessage(phoneError);
        if (hasError) return;

        setLoading(true);


        try {
            const resOrder = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phoneNumber: phoneNumber.trim(),
                }),
                credentials: "include",
            });

            const resultOrder = await resOrder.json();

            if (resultOrder.success) {
                toast.success(resultOrder.message);
                // Reset form
                setName("");
                setPhoneNumber("");
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
                    if (!window.snap) {
                        const script = document.createElement("script");
                        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
                        script.setAttribute(
                            "data-client-key",
                            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
                        ),
                            (script.onload = () => {
                                window.snap.pay(resultMidtrans.token, callbacks);
                                console.log(resultMidtrans)
                            });
                        document.body.appendChild(script);
                    } else {
                        window.snap.pay(resultMidtrans.token, callbacks);
                        console.log(resultMidtrans)
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
        name,
        setName,
        phoneNumber,
        setPhoneNumber,
        nameErrorMessage,
        setNameErrorMessage,
        phoneNumberErrorMessage,
        setPhoneNumberErrorMessage,
        loading,
        paymentStatus,
        paymentMessage,
        handleUpdateQuantity,
        handleDelete,
        handleDismissPaymentStatus,
        handleOrder,
        totalAmount,
        carts,
    }
} 