type ProductInput = {
    name: FormDataEntryValue | null;
    description: FormDataEntryValue | null;
    price: number;
    image: File | null;
}

export function validateProductInput(input: ProductInput): string | null {
    if (!input.name || !input.description || isNaN(input.price)) {
        return "Invalid product data";
    }

    if (!(input.image instanceof File) || !input.image.name) {
        return "Image is required"
    }

    return null;
}