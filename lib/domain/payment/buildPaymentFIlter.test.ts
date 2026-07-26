import { describe, test, expect } from "vitest";
import { buildPaymentFilter } from "./buildPaymentFilter";

describe("buildPaymentFilter", () => {
    test("filter paymentType yang valid", () => {
        const where = buildPaymentFilter({ paymentType: "qris" });
        expect(where.paymentType).toBe("qris");
    });

    test("abaikan paymentType yang invalid", () => {
        const where = buildPaymentFilter({ paymentType: "bitcoin" });
        expect(where.paymentType).toBeUndefined();
    });

    test("filter by date range (1 hari penuh)", () => {
        const where = buildPaymentFilter({ date: "2026-07-25" });
        expect(where.transactionTime).toEqual({
            gte: new Date("2026-07-25"),
            lt: new Date("2026-07-26")
        });
    });

    test("abaikan date yang formatnya invalid", () => {
        const where = buildPaymentFilter({ date: "bukan-tanggal" });
        expect(where.transactionTime).toBeUndefined();
    });

    test("filter status yang valid (via relasi order)", () => {
        const where = buildPaymentFilter({ status: "PAID" });
        expect(where.order).toEqual({ status: "PAID" });
    });

    test("filter transactionId, case-insensitive partial match", () => {
        const where = buildPaymentFilter({ transactionId: "inv-123" });
        expect(where.transactionId).toEqual({ contains: "inv-123", mode: "insensitive" });
    });

    test("gada filter apapun", () => {
        const where = buildPaymentFilter({});
        expect(where).toEqual({});
    });
});
