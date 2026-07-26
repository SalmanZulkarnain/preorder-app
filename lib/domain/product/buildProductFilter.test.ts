import { describe, test, expect } from "vitest";
import { buildProductFilter } from "./buildProductFilter";

describe("buildProductFilter", () => {
    test("cuma minPrice, tanpa maxPrice", () => {
        const where = buildProductFilter({ minPrice: "50000" });
        expect(where.price).toEqual({ gte: 50000 });
    });

    test("cuma maxPrice, tanpa minPrice", () => {
        const where = buildProductFilter({ maxPrice: "100000" });
        expect(where.price).toEqual({ lte: 100000 });
    });

    test("dua-duanya diisi", () => {
        const where = buildProductFilter({ minPrice: "50000", maxPrice: "100000" });
        expect(where.price).toEqual({ gte: 50000, lte: 100000 });
    });

    test("gak ada filter harga sama sekali", () => {
        const where = buildProductFilter({});
        expect(where.price).toBeUndefined();
    });

    test("filter by name, case-insensitive", () => {
        const where = buildProductFilter({ name: "sepatu" });
        expect(where.name).toEqual({ contains: "sepatu", mode: "insensitive" });
    })
});
