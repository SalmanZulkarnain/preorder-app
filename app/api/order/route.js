import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// GET endpoint (tidak diubah)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      message: 'Orders fetched successfully',
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false
    }, { status: 500 });
  }
}

// Helper function untuk generate transaction ID
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
}

// POST endpoint untuk membuat order baru
export async function POST(request) {
  try {
    const { name, phoneNumber } = await request.json();

    if (!name || !phoneNumber) {
      return NextResponse.json({
        message: "Nama dan nomor telepon wajib diisi",
        success: false
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({
        message: "Tidak ada sesi aktif",
        success: false
      }, { status: 400 });
    }

    const carts = await prisma.cart.findMany({
      where: { sessionId },
      include: { product: true }
    });

    if (carts.length === 0) {
      return NextResponse.json({
        message: "Keranjang kosong",
        success: false
      }, { status: 400 });
    }

    const total = carts.reduce((sum, cart) =>
      sum + (cart.product.price * cart.quantity), 0
    );

    const transactionId = generateTransactionId();

    // menggunakan Prisma Transaction untuk memastikan semua operasi berhasil atau gagal
    const result = await prisma.$transaction(async (tx) => {
      // 1. check/create customer
      let customer = await tx.customer.findFirst({
        where: { phoneNumber: phoneNumber }
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: name,
            phoneNumber: phoneNumber
          }
        })
      }

      // 2. create order
      const order = await tx.order.create({
        data: {
          transactionId,
          customerId: customer.id,
          customerName: name,
          totalAmount: total,
          status: 'unpaid'
        }
      });

      // 3. create order items
      const orderItems = await tx.orderItem.createMany({
        data: carts.map(cart => ({
          orderId: order.id,
          productId: cart.productId,
          quantity: cart.quantity,
          priceAtOrder: cart.product.price
        }))
      });

      // 4. delete cart
      await tx.cart.deleteMany({
        where: { sessionId }
      });

      return {
        customer,
        order,
        orderItems
      };
    });

    cookieStore.get("myTransactions")?.value;
    // let arr = [];
    // try {
    //   arr = raw ? JSON.parse(decodeURIComponent(raw)) : [];
    //   if (!Array.isArray(arr)) arr = [];
    // } catch (e) {
    //   arr = [];
    // }
    // const txId = result.order.transactionId;
    // arr = [txId, ...arr.filter((id) => id !== txId)].slice(0, 10);

    const response = NextResponse.json({
      message: "Pesanan berhasil dibuat!",
      success: true,
      data: result
    }, { status: 201 });

    response.cookies.set("myTransactions", JSON.stringify(arr), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (error) {
    console.error('Order creation error: ', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
