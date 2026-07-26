export function mapMidtransStatusToOrderStatus(midtransStatus: string) {
    switch (midtransStatus) {
        case "settlement":
        case "capture":
            return "PAID";
        case "pending":
            return "PENDING";
        case "expire":
        case "deny":
        case "cancel":
            return "EXPIRED"
        default:
            throw new Error(`Status midtrans tidak dikenal: ${midtransStatus}`);
    }
}