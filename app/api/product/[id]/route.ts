import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { deleteProduct, getProductById, updateProduct } from '@/lib/services/productService';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) { // _ di depan req berfungsi sebagai penanda bahwa itu tidak terpakai, tapi harus ada di parameter
    try {
        const { id } = await params;

        const product = await getProductById(Number(id));

        return NextResponse.json({
            message: 'Product fetched',
            success: true,
            data: product
        }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const status = message === "Product not found" ? 404 : 500;
        return NextResponse.json({ 
            message, 
            success: false 
        }, { status });
    }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    const user = await requireAuth();

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized", success: false
        }, { status: 401 });
    }

    try {
        const { id } = await params;
        const formData = await req.formData();

        const updated = await updateProduct(Number(id), {
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            image: formData.get("image") as File | null
        })

        return NextResponse.json({
            message: 'Product updated',
            success: true,
            data: updated
        }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const status = message === "Product not found" ? 404 : message === "Invalid product data" ? 400 : 500;
        return NextResponse.json({ 
            message, 
            success: false 
        }, { status });
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
    const user = await requireAuth();

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized", success: false
        }, { status: 401 });
    }

    try {
        const { id } = await params;

        await deleteProduct(Number(id));

        return NextResponse.json({
            message: 'Product deleted',
            success: true
        }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        const status = message === "Product not found" ? 404 : 500;
        return NextResponse.json({
            message,
            success: false
        }, { status });
    }
}

// blom terpakai
// export async function PATCH(request: NextRequest, { params }: RouteContext) {
//     const user = await requireAuth();

//     if (!user) {
//         return NextResponse.json({
//             message: "Unauthorized", success: false
//         }, { status: 401 });
//     }

//     try {
//         const { id } = await params;
//         const { discountPercent } = await request.json();

//         const product = await prisma.product.findUnique({
//             where: { id: Number(id) }
//         });

//         if (!product) {
//             return NextResponse.json({
//                 success: false
//             }, { status: 400 });
//         }

//         const finalPrice = ((100 - discountPercent) / 100) * product.price;

//         const productUpdated = await prisma.product.update({
//             where: { id: Number(id) },
//             data: {
//                 discountPrice: Math.round(finalPrice),
//                 discountPercent,
//                 isDiscountActive: true,
//             }
//         });

//         return NextResponse.json({
//             data: {
//                 product: productUpdated
//             }
//         }, { status: 200 });
//     } catch (error) {
//         console.error('Failed to delete product: ', error);
//         const message = error instanceof Error ? error.message : 'Internal server error';
//         return NextResponse.json({
//             message,
//             success: false
//         }, { status: 500 });
//     }
// }
