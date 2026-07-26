import { describe, test, expect } from "vitest";
import { validateProductInput } from "./validateProductInput";

describe("validateProductInput", () => {
    test("semua field valid, harus return null (tidak ada error)", () => {
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
        const result = validateProductInput({
            name: "sepatu", 
            description: "sepatu keren", 
            price: 100000, 
            image: file
        });
        expect(result).toBeNull();
    });

    test("name kosong harus return error", () => {
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
        const result = validateProductInput({
            name: "",
            description: "deskripsi", 
            price: 100000, 
            image: file
        });
        expect(result).toBe("Invalid product data");
    });

    test("price bukan angka (NaN) harus return error", () => {
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
        const result = validateProductInput({
            name: "nama",
            description: "deskripsi", 
            price: NaN, 
            image: file
        });
        expect(result).toBe("Invalid product data");
    });

    test("image tidak ada harus return error khusus image", () => {
        const result = validateProductInput({
            name: "nama",
            description: "deskripsi", 
            price: 10000, 
            image: null
        });
        expect(result).toBe("Image is required");
    });
});
