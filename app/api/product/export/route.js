import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import Papa from "papaparse";

export async function GET() {
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