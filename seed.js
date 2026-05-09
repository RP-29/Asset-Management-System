const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (existing) {
        console.log("Admin already exists!");
        return;
    }

    const user = await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log("Created admin user successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
