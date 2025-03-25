import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { category: true, supplier: true },
            orderBy: { updatedAt: 'desc' },
        })
        return NextResponse.json(products)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const product = await prisma.product.create({
            data: {
                name: body.name,
                sku: body.sku,
                description: body.description || '',
                quantity: Number(body.quantity) || 0,
                minStock: Number(body.minStock) || 10,
                price: Number(body.price) || 0,
                unit: body.unit || 'pcs',
                categoryId: body.categoryId || null,
                supplierId: body.supplierId || null,
            },
            include: { category: true, supplier: true },
        })
        return NextResponse.json(product, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed to create product' }, { status: 500 })
    }
}
