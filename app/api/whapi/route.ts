import prisma from "@/lib/db";
import { NextResponse } from "next/server";

type Subcscriber = {
  phone: string;
}

export async function GET() {
  try {
    const subscriber = await prisma.whatsappSubscriber.findMany();

    return NextResponse.json(
      { message: "Berhasil mengambil nomor", success: true, data: subscriber },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const existing = await prisma.whatsappSubscriber.findUnique({
      where: { phone }
    })

    if (existing) {
      return NextResponse.json({ message: 'Used phone number' }, { status: 400 });
    }

    const subscriber = await prisma.whatsappSubscriber.create({
      data: { phone },
    });

    return NextResponse.json(
      { message: "Phone number added", success: true, data: subscriber },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        message,
        success: false,
      },
      { status: 500 }
    );
  }
}
