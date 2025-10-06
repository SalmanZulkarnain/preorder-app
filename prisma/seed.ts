import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
}

main()
    .then(() => console.log('Admin created'))
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect())