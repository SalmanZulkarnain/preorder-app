"use client"

import { useState } from 'react'
import { toast, Toaster } from "sonner";

const Subscribe = () => {
    const [phone, setPhone] = useState("")
    const [phoneErrorMessage, setPhoneErrorMessage] = useState(null);

    const handleSubscribe = async (e) => {
        e.preventDefault();

        const phoneValidation = !/^[0-9]+$/.test(phone);

        setPhoneErrorMessage(phoneValidation ? 'Nomor harus berupa angka' : '');

        if (phoneValidation) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whapi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });

            await response.json();
            if (!response.ok) {
                toast.error('Nomor sudah terdaftar.')
            } else {
                toast.success("Terima kasih! Nomor anda terdaftar untuk mendapatkan informasi menu terbaru.")
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="py-12">
            <Toaster duration={6000} richColors position="top-center"></Toaster>
            <div className="container flex flex-col items-center max-w-4xl mx-auto text-center">
                <h2 className="mb-4 text-3xl font-bold">
                    Dapatkan Info Menu Terbaru
                </h2>
                <p className="mb-8 text-muted-foreground">
                    Daftarkan nomor anda untuk mendapatkan informasi menu terbaru.
                </p>

                <form className="flex flex-col justify-center gap-4 md:flex-row">
                    <div className='relative'>
                        <div className="flex-1 max-w-md ">
                            <label htmlFor="phone" className="sr-only">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Masukkan nomor telpon anda"
                                value={phone}
                                name="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />

                        </div>
                        {phoneErrorMessage && (
                            <span className={`left-0 absolute text-xs text-red-700`}>{phoneErrorMessage}</span>
                        )}
                    </div>
                    <button onClick={handleSubscribe}
                        className="px-6 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-600"
                    >
                        Subscribe
                    </button>
                </form>

            </div>
        </section>
    )
}

export default Subscribe