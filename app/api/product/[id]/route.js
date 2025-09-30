import { NextResponse } from 'next/server';
import { writeFile } from "fs/promises";
import prisma from '@/lib/prisma';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Product fetched',
            success: true,
            data: product
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch product: ', error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const formData = await req.formData();

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
        const updated = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(price && { price: Number(price) }),
                ...(imagePath && { image: imagePath })
            }
        });

        return NextResponse.json({
            message: 'Product updated',
            success: true,
            data: updated
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to update product: ', err);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({
            message: 'Product deleted',
            success: true
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to delete product: ', error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}