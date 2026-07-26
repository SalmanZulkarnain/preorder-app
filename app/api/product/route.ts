import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { requireAuth } from '@/lib/auth/requireAuth';
import { addProduct, getAllProducts } from '@/lib/services/productService';

interface ProductProps {
    price: number,
    discountPercent?: number | null;
    discountStart?: string | Date | null;
    discountEnd?: string | Date | null;
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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const result = await getAllProducts({
            minPrice: searchParams.get("minPrice") ?? undefined,
            maxPrice: searchParams.get("maxPrice") ?? undefined,
            name: searchParams.get("name") ?? undefined,

            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || 5,
        })

        const mapped = result.products.map((p) => ({
            ...p,
            finalPrice: getFinalPrice(p)
        }));

        return NextResponse.json({
            message: 'Products fetched',
            success: true,
            data: mapped,
            pagination: result.pagination
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch: ', error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await requireAuth();

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized", success: false
        }, { status: 401 })
    }

    try {
        const formData = await req.formData();

        const product = await addProduct({
            image: formData.get("image") as File | null,
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number(formData.get("price"))
        });

        return NextResponse.json({
            message: 'Product added',
            success: true,
            data: product
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to add product: ', error);

        const message = error instanceof Error ? error.message : 'Internal server error';
        const status = message === "Invalid product data" ? 400 : message === "Image is required" ? 422 : 500;
        return NextResponse.json({
            message,
            success: false
        }, { status });
    }
}