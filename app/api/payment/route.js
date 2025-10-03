import { NextResponse } from "next/server";
import { createHash } from "crypto";
import prisma from "@/lib/prisma";

// Validation helper
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export async function GET(request) {
  try {
    const start = Date.now();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.toLowerCase();
    const paymentType = searchParams.get("paymentType")?.toLowerCase();
    const date = searchParams.get("date");
    const transactionId = searchParams.get("transactionId")?.trim();

    // pagination params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const where = {};

    if (paymentType && ['qris', 'bank_transfer', 'echannel'].includes(paymentType)) {
      where.paymentType = paymentType;
    }

    if (date && isValidDate(date)) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      where.transactionTime = {
        gte: startDate,
        lt: endDate
      };
    }

    if (status && ['paid', 'pending', 'expired', 'cancelled'].includes(status)) {
      where.order = {
        status: status
      };
    }

    if (transactionId && transactionId.length > 0) {
      where.transactionId = {
        contains: transactionId,
        mode: "insensitive"
      };
    }

    const totalCount = await prisma.payment.count({ where })

    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        transactionId: true,
        midtransTransactionId: true,
        paymentType: true,
        bank: true,
        vaNumber: true,
        grossAmount: true,
        transactionStatus: true,
        fraudStatus: true,
        transactionTime: true,
        expiryTime: true,
        createdAt: true,
        updatedAt: true,
        order: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phoneNumber: true
              }
            },
            orderItems: {
              select: {
                id: true,
                quantity: true,
                priceAtOrder: true,
                product: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        transactionTime: 'desc'
      },
      skip, 
      take: limit
    });
    console.log(`Query took: ${Date.now() - start}ms`);

    return NextResponse.json({
      message: 'Success fetching payments',
      success: true,
      data: payments,
      pagination: {
        page, 
        limit, 
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Internal server error: ${error}`,
      success: false
    }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const jsonBody = await request.json();
    console.log("Midtrans webhook payload:", jsonBody);

    const {
      order_id,
      transaction_id,
      payment_type,
      va_numbers,
      gross_amount,
      transaction_status,
      fraud_status,
      transaction_time,
      settlement_time,
      expiry_time,
      status_code,
      signature_key,
    } = jsonBody;

    // ✅ Hitung signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const inputString = order_id + status_code + gross_amount + serverKey;
    const expectedSignature = createHash("sha512")
      .update(inputString)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        { message: "Invalid signature key", success: false },
        { status: 403 }
      );
    }

    // ✅ Simpan ke database
    const payments = await prisma.payment.upsert({
      where: { transactionId: order_id },
      update: {
        midtransTransactionId: transaction_id,
        paymentType: payment_type,
        bank: va_numbers?.[0]?.bank ?? null,
        vaNumber: va_numbers?.[0]?.va_number ?? null,
        grossAmount: parseInt(gross_amount),
        transactionStatus: transaction_status,
        fraudStatus: fraud_status,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        expiryTime: expiry_time ? new Date(expiry_time) : null,
        rawResponse: jsonBody,
      },
      create: {
        transactionId: order_id,
        midtransTransactionId: transaction_id,
        paymentType: payment_type,
        bank: va_numbers?.[0]?.bank ?? null,
        vaNumber: va_numbers?.[0]?.va_number ?? null,
        grossAmount: parseInt(gross_amount),
        transactionStatus: transaction_status,
        fraudStatus: fraud_status,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        expiryTime: expiry_time ? new Date(expiry_time) : null,
        rawResponse: jsonBody,
      },
    });

    // ✅ Update order status
    const updatedOrderStatus = await prisma.order.update({
      where: { transactionId: order_id },
      data: {
        status:
          transaction_status === "settlement"
            ? "paid"
            : transaction_status === "expire"
              ? "expired"
              : transaction_status === "cancel"
                ? "cancelled"
                : "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Berhasil menambah payment",
        success: true,
        data: payments,
        updatedOrderStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
