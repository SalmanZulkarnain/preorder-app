import { del, put } from "@vercel/blob";
import { unlink, writeFile } from "fs/promises";
import path from "path"

export async function uploadProductImage(image: File): Promise<string> { // kenapa promise?
    const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`; // apa arti /\s+/g, "_"
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
        const bytes = await image.arrayBuffer(); // apa artinya?
        const buffer = Buffer.from(bytes); // apa itu buffer
        const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
        await writeFile(uploadPath, buffer);
        return `/uploads/${fileName}`
    }

    const blob = await put(fileName, image, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    return blob.url;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isDevelopment && imageUrl.startsWith("/uploads/")) {
        const fileName = imageUrl.replace("/uploads/", "");
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        try {
            await unlink(filePath);
        } catch (error) {
            console.error("Gagal hapus gambar lokal:", error);
        }
        return;
    }

    if (imageUrl.includes("blob.vercel-storage.com")) {
        try {
            await del(imageUrl);
        } catch (error) {
            console.error("Gagal hapus blob:", error);
        }
    }
}