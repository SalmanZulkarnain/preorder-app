import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("sessionId", sessionId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return sessionId;
}

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json(
        {
          message: "Cannot find sessionId",
          success: false,
          data: [],
        },
        { status: 400 }
      );
    }

    const carts = await prisma.cart.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        message: "Carts fetched successfully",
        success: true,
        data: carts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch carts: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch carts",
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const sessionId = await getSessionId();
  const { productId } = await request.json();

  try {
    const existingCartItem = await prisma.cart.findFirst({
      where: { sessionId, productId },
    });

    let cartItem;
    if (existingCartItem) {
      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: 1 } },
      });
      cartItem = await prisma.cart.findUnique({
        where: { id: existingCartItem.id },
        include: { product: true }
      })
    } else {
      const createdCart = await prisma.cart.create({
        data: { sessionId, productId, quantity: 1
        },
      });

      cartItem = await prisma.cart.findUnique({
        where: { id: createdCart.id }, 
        include: { product: true }
      })
    }

    return NextResponse.json(
      {
        message: "Success adding to cart.",
        success: true,
        data: cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create cart item: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create cart item",
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
