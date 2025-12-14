import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { quantity } = await req.json();
  try {
    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        {
          message: "Quantity is required",
          success: false,
        },
        { status: 400 }
      );
    }
    if (quantity < 0) {
      return NextResponse.json(
        {
          message: "Quantity cannot be negative",
          success: false,
        },
        { status: 400 }
      );
    }
    if (quantity === 0) {
      await prisma.cart.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json(
        {
          message: "Cart deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    }

    await prisma.cart.update({
      where: { id: Number(id) },
      data: { quantity },
    });

    return NextResponse.json(
      {
        message: "Cart updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to patch cart item: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to patch cart item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await prisma.cart.delete({ where: { id: Number(id) } });
    return NextResponse.json(
      {
        message: "Cart item deleted successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to delete cart item: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete cart item",
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
