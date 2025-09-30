import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from "fs/promises";
import prisma from '@/lib/prisma';
import path from 'path';

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

        const totalCount = await prisma.product.count();

        return NextResponse.json({
            message: 'Products fetched',
            success: true,
            data: products,
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
    const formData = await request.formData();

    const image = formData.get("image");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));

    if (!name || !description || isNaN(price)) {
        return NextResponse.json(
            { message: 'Invalid product data' },
            { status: 400 }
        );
    }

    let imagePath = null;

    if (image && image?.name) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

        await writeFile(uploadPath, buffer);
        imagePath = `/uploads/${fileName}`;
    }

    try {
        const products = await prisma.product.create({
            data: {
                image: imagePath,
                name,
                description,
                price
            }
        });

        return NextResponse.json({
            message: 'Product added',
            success: true,
            data: products
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to add product: ', err);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

