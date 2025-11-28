import { z } from "zod";

export const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, "Nomor telepon terlalu pendek. Silakan masukkan minimal 10 digit")
        .max(15, "Nomor telepon terlalu panjang. Silakan masukkan maksimal 15 digit")
        .regex(/^[0-9]+$/, "Nomor telepon harus berupa angka")
});

export type PhoneSchema = z.infer<typeof phoneSchema>;

export const checkoutSchema = z.object({
    name: z.string().nonempty("Nama wajib diisi"),
    phoneNumber: z
    .string()
    .min(10, "Nomor telepon terlalu pendek. Silakan masukkan minimal 10 digit")
    .max(15, "Nomor telepon terlalu panjang. Silakan masukkan maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor telepon harus berupa angka")
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;