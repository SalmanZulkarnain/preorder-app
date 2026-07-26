import { Prisma } from "@/generated/prisma/client";

type ProductFilterParams = {
    minPrice?: string;
    maxPrice?: string | null;
    name?: string;
}

export function buildProductFilter(params: ProductFilterParams): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (params.maxPrice || params.minPrice) {
        where.price = {};
        if (params.minPrice) where.price.gte = Number(params.minPrice);
        if (params.maxPrice) where.price.lte = Number(params.maxPrice);
    }

    if (params.name) {
        where.name = {
            contains: params.name,
            mode: "insensitive"
        };
    }

    return where;
}