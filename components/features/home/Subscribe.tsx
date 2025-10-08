"use client"

import { useState } from 'react'

const Subscribe = () => {
    const [phone, setPhone] = useState("")

    const handleSubscribe = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whapi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });

            const result = await response.json();
            setPhone(result.data.phone);
        } catch (err) {
            console.error(err);
        }

        alert(
            `Thank You! Your phone number: ${phone} have been registered to get preorder information`
        );
    };

    return (
        <section className="py-12">
            <div className="container flex flex-col items-center max-w-4xl mx-auto text-center">
                <h2 className="mb-4 text-3xl font-bold">
                    Dapatkan Info Menu Terbaru
                </h2>
                <p className="mb-8 text-muted-foreground">
                    Daftarkan email Anda untuk mendapatkan informasi menu terbaru dan
                    promo spesial
                </p>

                <form className="flex flex-col justify-center gap-4 md:flex-row">
                    <div className="flex-1 max-w-md">
                        <label htmlFor="phone" className="sr-only">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Input your phone number"
                            value={phone}
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
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