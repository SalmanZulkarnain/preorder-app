import { createHash } from "crypto";

type MidtransSignatureParams = {
    orderId: string;
    statusCode: string;
    grossAmount: number | string;
    signatureKey: string;
    serverKey: string
}

export function verifyMidtransSignature(params: MidtransSignatureParams): boolean {
    const inputString = params.orderId + params.statusCode + params.grossAmount + params.serverKey;
    const expectedSignature = createHash("sha512").update(inputString).digest("hex");

    return expectedSignature === params.signatureKey
}