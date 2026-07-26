import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET() {
    const user = await requireAuth();

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized", success: false
        }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        const data = products.map((p) => ({
            Id: p.id,
            Image: p.image,
            Name: p.name,
            Description: p.description,
            Price: p.price
        }));

        const csv = Papa.unparse(data);

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="products-${Date.now()}.csv"`
            }
        });
    } catch (error) {
        console.error('Export error: ', error);
        return NextResponse.json({
            error: 'Export failed'
        }, { status: 500 });
    }
}
