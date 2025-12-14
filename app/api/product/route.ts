import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from "fs/promises";
import prisma from '@/lib/db';
import path from 'path';
import { put } from "@vercel/blob";

interface ProductProps {
    price: number,
    discountPercent ?: number | null;
    discountStart ?: string | Date | null;
    discountEnd ?: string | Date | null;
}

export function getFinalPrice(product: ProductProps) {
    const now = new Date();
    const start = product.discountStart ? new Date(product.discountStart) : null;
    const end = product.discountEnd ? new Date(product.discountEnd) : null;

    const discountActive =
        (!start || now >= start) && (!end || now <= end);

    if (!discountActive) return product.price;

    if (typeof product.discountPercent === "number" && product.discountPercent > 0) {
        return Math.round(product.price * (1 - 20 / 100));
    }

    return product.price;
}

export async function getSessionId() {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookieStore.set('sessionId', sessionId, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
    }

    return sessionId;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const name = searchParams.get("name");

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 5;

        const skip = (page - 1) * limit;

        const products = await prisma.product.findMany({
            where: {
                ...(minPrice || maxPrice ? {
                    price: {
                        ...(minPrice && { gte: Number(minPrice) }),
                        ...(maxPrice && { lte: Number(maxPrice) }),
                    }
                } : {}),
                ...(name && {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                })
            },
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });

        const mapped = products.map((p) => ({
            ...p,
            finalPrice: getFinalPrice(p)
        }));

        const totalCount = await prisma.product.count();

        return NextResponse.json({
            message: 'Products fetched',
            success: true,
            data: mapped,
            pagination: {
                totalCount,
                page,
                limit: Number(limit),
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: Number(page) < Math.ceil(totalCount / limit),
                hasPrevPage: Number(page) > 1
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch: ', error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const image = formData.get("image");
        const name = formData.get("name");
        const description = formData.get("description");
        const price = Number(formData.get("price"));

        if (!name || !description || isNaN(price)) {
            return NextResponse.json(
                { message: 'Invalid product data', success: false },
                { status: 400 }
            );
        }

        if (!image || !image?.name) {
            return NextResponse.json(
                { message: 'Image is required', success: false },
                { status: 400 }
            );
        }

        let imageUrl = null;

        if (image && image?.name) {
            const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
            const isDevelopment = process.env.NODE_ENV === 'development';

            if (isDevelopment) {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

                await writeFile(uploadPath, buffer);
                imageUrl = `/uploads/${fileName}`;
            } else {
                const blob = await put(fileName, image, {
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });

                imageUrl = blob.url;
            }

        }

        const product = await prisma.product.create({
            data: {
                image: imageUrl,
                name,
                description,
                price
            }
        });

        return NextResponse.json({
            message: 'Product added',
            success: true,
            data: product
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to add product: ', err);
        return NextResponse.json({
            message: err.message || 'Internal server error',
            success: false
        }, { status: 500 });
    }
}