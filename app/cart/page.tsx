"use client";
import { useCartPage } from "./hooks/useCartPage";
import CartList from "./components/CartList";
import CheckoutForm from "./components/CheckoutForm";
import CartStatusBanner from "./components/CartStatusBanner";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: any) => void;
    };
  }
}

export default function CartPage() {
  const { form, loading, paymentStatus, paymentMessage, handleDismissPaymentStatus, onOrder, handleUpdateQuantity, handleDelete, totalAmount, carts } = useCartPage();

  if (loading)
    return (
      <div className="text-xl text-center text-gray-600 lg:col-span-2">
        Loading...
      </div>
    );  

  return (
    <div className="grid items-start max-w-6xl grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
      <CartStatusBanner paymentStatus={paymentStatus} paymentMessage={paymentMessage} handleDismissPaymentStatus={handleDismissPaymentStatus} />
      
      <CartList carts={carts} handleDelete={handleDelete} handleUpdateQuantity={handleUpdateQuantity} />

      <CheckoutForm form={form} onOrder={onOrder} loading={loading} carts={carts} totalAmount={totalAmount}/>
    </div>
  );
}


