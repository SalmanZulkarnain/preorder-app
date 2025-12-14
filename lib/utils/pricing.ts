import type { Product } from "@/prisma/generated/prisma/client";
import { Prisma } from "@/prisma/generated/prisma/client";

type CartItemWithProduct = Prisma.CartGetPayload<{ include: { product: true }}>

export function getCurrentPrice(product: Product) {
    const now = new Date();

    const isDiscountValid = 
    product.discountPrice && 
    product.discountStart &&
    product.discountEnd && 
    now >= product.discountStart &&
    now <= product.discountEnd

    return {
        finalPrice: isDiscountValid ? product.discountPrice : product.price,
        originalPrice: product.price,
        hasDiscount: product.isDiscountActive,
        discountPercent: isDiscountValid ? product.discountPercent : null
    }
}

export function calculateCartTotal(cartItems: CartItemWithProduct[]) {
    return cartItems.reduce((total, item) => {
        const { finalPrice } = getCurrentPrice(item.product);
        return total + ((finalPrice ?? 0) * item.quantity);
    }, 0);
}