// import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
  } catch (err: unknown) {
    const e = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json(
      {
        message: err.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "");

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
    return NextResponse.json(
      {
        message: e.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
