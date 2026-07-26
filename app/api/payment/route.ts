import { NextRequest, NextResponse } from "next/server";
import type { MidtransWebhookPayload } from "@/types/payment";
import { requireAuth } from "@/lib/auth/requireAuth";
import { getAllPayments, processMidtransWebhook } from "@/lib/services/paymentService";

export async function GET(req: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized", success: false
    }, { status: 401 });
  }

  try {
    const start = Date.now();
    const { searchParams } = new URL(req.url);

    const result = await getAllPayments({
      paymentType: searchParams.get("paymentType")?.toLowerCase(),
      date: searchParams.get("date"),
      status: searchParams.get("status")?.toUpperCase(),
      transactionId: searchParams.get("transactionId")?.trim(),
      page: parseInt(searchParams.get("page") ?? "1") || 1,
      limit: parseInt(searchParams.get("limit") ?? "10") || 10
    })

    // ✅ Tambahin ini buat log
    const dataSize = JSON.stringify(result.payments).length;
    console.log(`Data size: ${(dataSize / 1024).toFixed(2)} KB`);
    console.log(`Query took: ${Date.now() - start}ms`);

    return NextResponse.json({
      message: 'Payments fetched',
      success: true,
      data: result.payments,
      pagination: result.pagination
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message === "Payments not found" ? 404 : 500;
    return NextResponse.json({
      message,
      success: false
    }, { status });
  }
}


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const jsonBody: MidtransWebhookPayload = await request.json();
    console.log("Midtrans Webhook Payload: ", jsonBody);

    const payment = await processMidtransWebhook(jsonBody);

    return NextResponse.json({
      message: "Berhasil menambah payment",
      success: true,
      data: payment
    }, { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "Invalid signature key" ? 403 :
        message === "Order not found" ? 404 :
          message.startsWith("Status midtrans tidak dikenal") ? 400 :
            500

    console.error("Webhook processing error:", error);

    return NextResponse.json({
      message,
      success: false
    }, { status });
  }
}
