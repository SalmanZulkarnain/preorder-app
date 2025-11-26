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
  const { name, setName, phoneNumber, setPhoneNumber, nameErrorMessage, phoneNumberErrorMessage, loading, paymentStatus, paymentMessage, handleDismissPaymentStatus, handleOrder, handleUpdateQuantity, handleDelete, totalAmount, carts } = useCartPage();

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

      <CheckoutForm handleOrder={handleOrder} name={name} setName={setName} nameErrorMessage={nameErrorMessage} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} phoneNumberErrorMessage={phoneNumberErrorMessage} loading={loading} carts={carts} totalAmount={totalAmount} />
    </div>
  );
}


