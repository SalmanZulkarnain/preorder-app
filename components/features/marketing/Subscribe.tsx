"use client"

import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneSchema, phoneSchema } from "@/lib/utils/zodSchema";

const Subscribe = () => {
    const form = useForm<PhoneSchema>({
        resolver: zodResolver(phoneSchema)
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        form.setValue('phone', value);
    }

    const onSubscribe = async (values: PhoneSchema) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whapi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: values.phone })
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Nomor sudah terdaftar.')
            } else {
                toast.success("Terima kasih! Nomor anda terdaftar untuk mendapatkan informasi menu terbaru.")
                form.reset();
            }
        } catch (err) {
            console.error(err);
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    return (
        <section className="py-12">
            <Toaster duration={4000} richColors position="top-center" />
            <div className="container flex flex-col items-center max-w-lg mx-auto text-center">
                <h2 className="mb-4 text-3xl font-bold">
                    Dapatkan Info Menu Terbaru
                </h2>
                <p className="mb-8 text-muted-foreground">
                    Daftarkan nomor anda untuk mendapatkan informasi menu terbaru.
                </p>
                <form className="flex flex-col items-center justify-center gap-4 md:flex-row" onSubmit={form.handleSubmit(onSubscribe)}>
                    <div className="relative w-full md:flex-1">
                        <label htmlFor="phone" className="sr-only">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            id="phone"
                            placeholder="Masukkan nomor telepon anda"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            {...form.register('phone', { onChange: handlePhoneChange })}
                        />
                        {form.formState.errors.phone && (
                            <span className={`block left-0 text-left mt-1 text-xs text-red-700`}>
                                {form.formState.errors.phone.message}
                            </span>
                        )}

                    </div>
                    <button type="submit" className="w-full self-start md:w-auto px-6 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-600">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Subscribe;