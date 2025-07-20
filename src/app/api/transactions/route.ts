import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('productId')
        const type = searchParams.get('type')

        const where: any = {}
        if (productId) where.productId = productId
        if (type) where.type = type

        const transactions = await prisma.transaction.findMany({
            where,
            include: { product: { include: { category: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100,
        })
        return NextResponse.json(transactions)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { productId, type, quantity, note } = body

        if (!productId || !type || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const qty = Number(quantity)
        if (isNaN(qty) || qty <= 0) {
            return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
        }

        // Update product quantity based on transaction type
        const product = await prisma.product.findUnique({ where: { id: productId } })
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        let newQty = product.quantity
        if (type === 'IN') newQty += qty
        else if (type === 'OUT') {
            if (product.quantity < qty) {
                return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
            }
            newQty -= qty
        } else if (type === 'ADJUSTMENT') {
            newQty = qty
        }

        const [transaction] = await prisma.$transaction([
            prisma.transaction.create({
                data: { productId, type, quantity: qty, note: note || '' },
                include: { product: true },
            }),
            prisma.product.update({ where: { id: productId }, data: { quantity: newQty } }),
        ])

        return NextResponse.json(transaction, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}
