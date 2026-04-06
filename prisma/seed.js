const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@inven.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@inven.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Seeded admin user:', admin.email)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
