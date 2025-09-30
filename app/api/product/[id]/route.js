import { NextResponse } from 'next/server';
import { put, del } from "@vercel/blob";
import { writeFile, unlink } from "fs/promises";
import prisma from '@/lib/prisma';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!product) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Product fetched',
            success: true,
            data: product
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch product: ', error);
        return NextResponse.json({
            message: error.message || 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const formData = await req.formData();

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

        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        })

        if (!existingProduct) {
            return NextResponse.json({
                message: 'Product not found',
                success: false
            }, { status: 404 });
        }

        let imageUrl = existingProduct.image;

        if (image && image?.name) {
            const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
            const isDevelopment = process.env.NODE_ENV === 'development';

            if (isDevelopment) {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

                await writeFile(uploadPath, buffer);
                imageUrl = `/uploads/${fileName}`;

                if (existingProduct.image && existingProduct.image.startsWith('/uploads/')) {
                    const oldPath = path.join(process.cwd(), "public", "uploads", existingProduct.image);
                    try {
                        await unlink(oldPath);
                        console.log('🗑️ Old local image deleted');
                    } catch (error) {
                        console.log('⚠️ Failed to delete old image:', error.message);
                    }
                }
            } else {
                const blob = await put(fileName, image, {
                    access: 'public', 
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });

                imageUrl = blob.url;

                if (existingProduct.image && existingProduct.image.includes('blob.vercel-storage.com')) {
                    try {
                        await del(existingProduct.image);
                    } catch (error) {
                        console.error('⚠️ Failed to delete old blob:', error.message);
                    } 
                }
            }
        }

        const updated = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                ...(name?.trim() && { name: name.trim() }),
                ...(description !== undefined && { description: description.trim() }),
                ...(!isNaN(price) && { price: Number(price) }),
                ...(imageUrl && { image: imageUrl })
            }
        });

        return NextResponse.json({
            message: 'Product updated',
            success: true,
            data: updated
        }, { status: 200 });
    } catch (err) {
        console.error('Failed to update product: ', err);
        return NextResponse.json({
            message: err.message || 'Internal server error',
            success: false
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!product) {
            return NextResponse.json({
                message: 'Product not found',
                success: false
            }, { status: 404 });
        }

        if (product.image) {
            const isDevelopment = process.env.NODE_ENV === 'development';

            if (isDevelopment && product.image.startsWith('/uploads/')) {
                const imagePath = path.join(process.cwd(), "public", product.image);
                try {
                    await unlink(imagePath);
                    console.log('Local image deleted');
                } catch (err) {
                    console.error('Failed to delete image: ', err);
                }
            } else if (product.image.includes('blob.vercel-storage.com')) {
                try {
                    await del(product.image);
                    console.log('Blob image deleted');
                } catch (err) {
                    console.error('Failed to delete blob data: ', err);
                }
            }
        }

        await prisma.product.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({
            message: 'Product deleted',
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete product: ', error);
        return NextResponse.json({
            message: error.message || 'Internal server error',
            success: false
        }, { status: 500 });
    }
}