import { ProductWhereInput } from "@/generated/prisma/models";
import { validateProductInput } from "../domain/product/validateProductInput";
import { prisma } from "../prisma";
import { deleteProductImage, uploadProductImage } from "./imageUpload";
import { buildProductFilter } from "../domain/product/buildProductFilter";

type GetProductsParams = {
    minPrice?: string;
    maxPrice?: string;
    name?: string;
    page: number;
    limit: number;
}

export async function getAllProducts(params: GetProductsParams) {
    const where: ProductWhereInput = buildProductFilter(params);
    const skip = (params.page - 1) * params.limit;

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { id: 'desc' },
            skip,
            take: params.limit
        }),
        prisma.product.count({ where })
    ])

    return {
        products,
        pagination: {
            page: params.page,
            limit: Number(params.limit),
            totalCount,
            totalPages: Math.ceil(totalCount / params.limit),
            hasNextPage: Number(params.page) < Math.ceil(totalCount / params.limit),
            hasPrevPage: Number(params.page) > 1
        }
    }
}

export async function getProductById(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    return product;
}

export async function addProduct(data: { name: FormDataEntryValue | null; description: FormDataEntryValue | null; price: number; image: File | null }) {
    const validationError = validateProductInput(data);
    if (validationError) throw new Error(validationError);

    const imageUrl = await uploadProductImage(data.image as File);

    return prisma.product.create({
        data: {
            image: imageUrl,
            name: String(data.name).trim(),
            description: String(data.description).trim(),
            price: data.price
        }
    });
}

export async function updateProduct(id: number, data: { name: FormDataEntryValue | null; description: FormDataEntryValue | null; price: number; image: File | null }) {
    const validationError = validateProductInput(data);
    if (validationError) throw new Error(validationError);

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) throw new Error("Product not found");

    let imageUrl = existingProduct.image;
    if (data.image instanceof File && data.image.name) {
        imageUrl = await uploadProductImage(data.image);
        if (existingProduct.image) {
            await deleteProductImage(existingProduct.image)
        }
    }

    return prisma.product.update({
        where: { id },
        data: {
            name: String(data.name).trim(),
            description: String(data.description).trim(),
            price: data.price,
            image: imageUrl
        }
    })
}

export async function deleteProduct(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    if (product.image) {
        await deleteProductImage(product.image);
    }

    return prisma.product.delete({ where: { id } });
}