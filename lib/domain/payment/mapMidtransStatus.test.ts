import { describe, expect, test } from "vitest";
import { mapMidtransStatusToOrderStatus } from "./mapMidtransStatus";


describe("mapMidtransStatusToOrderStatus", () => {
    test("settlement jadi PAID", () => {
        expect(mapMidtransStatusToOrderStatus("settlement")).toBe("PAID");
    });

    test("capture jadi PAID", () => {
        expect(mapMidtransStatusToOrderStatus("capture")).toBe("PAID");
    });

    test("pending jadi PENDING", () => {
        expect(mapMidtransStatusToOrderStatus("pending")).toBe("PENDING");
    });

    test("expire jadi expired", () => {
        expect(mapMidtransStatusToOrderStatus("expire")).toBe("EXPIRED");
    });

    test("deny jadi expired", () => {
        expect(mapMidtransStatusToOrderStatus("deny")).toBe("EXPIRED");
    });

    test("cancel jadi expired", () => {
        expect(mapMidtransStatusToOrderStatus("cancel")).toBe("EXPIRED");
    });

    test("status yang ga dikenal harus throw error", () => {
        expect(() => mapMidtransStatusToOrderStatus("random_status")).toThrow("Status midtrans tidak dikenal");
    });
})