import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function PATCH(req, { params }) {
//     const { id } = await params;
//     const { operation } = await req.json();
//     try {
//         const cartItem = await prisma.cart.findUnique({ where: { id: Number(id) } });

//         if (!cartItem) return NextResponse.json({ message: "Cart not found", success: false }, { status: 404 });

//         if (operation === "decrement" && cartItem.quantity <= 1) {
//             await prisma.cart.delete({ where: { id: Number(id) } });
//             return NextResponse.json({ 
//                 message: "Cart deleted successfully", 
//                 success: true 
//             }, { status: 201 });
//         }

//         const updated = await prisma.cart.update({
//             where: { id: Number(id) },
//             data: { quantity: { [operation]: 1 } }
//         });

//         return NextResponse.json({ 
//             message: "Cart item updated successfully", 
//             success: true, 
//             data: updated 
//         }, { status: 201 });
//     } catch (error) {
//         console.error('Failed to patch cart item: ', error);
//         return NextResponse.json({
//             success: false,
//             message: 'Failed to patch cart item',
//             error: 'Database connection failed'
//         }, { status: 500 });
//     }
// }

export async function PATCH(req, { params }) {
    const { id } = await params;
    const { operation } = await req.json();
    try {
        if (operation === "decrement") {
            const updated = await prisma.cart.update({
                where: { id: Number(id) },
                data: { quantity: { decrement: 1 } }
            });

            if (updated.quantity <= 0) {
                await prisma.cart.delete({
                    where: { id: Number(id) }
                });
                return NextResponse.json({
                    message: "Cart deleted successfully",
                    success: true
                }, { status: 200 });
            }

            return NextResponse.json({
                message: "Cart decremented successfully",
                success: true
            }, { status: 200 });
        }

        await prisma.cart.update({
            where: { id: Number(id) }, 
            data: { quantity: { increment: 1 }}
        })

        return NextResponse.json({
            message: "Cart incremented successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to patch cart item: ', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to patch cart item',
            error: 'Database connection failed'
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await prisma.cart.delete({ where: { id: Number(id) } });
        return NextResponse.json({
            message: "Cart item deleted successfully",
            success: true
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to delete cart item: ', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete cart item',
            error: 'Database connection failed'
        }, { status: 500 });
    }
}