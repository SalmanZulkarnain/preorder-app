"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../prisma/generated/prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL
});
var prismaClientSingleton = function () {
    return new client_1.PrismaClient({ adapter: adapter });
};
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
