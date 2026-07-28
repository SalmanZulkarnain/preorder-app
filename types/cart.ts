import { Prisma } from "@/generated/prisma/client";

export type CartWithProduct = Prisma.CartGetPayload<{
    include: { product: true }
}>