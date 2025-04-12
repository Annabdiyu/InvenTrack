import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true, supplier: true, transactions: { orderBy: { createdAt: 'desc' }, take: 10 } },
        })
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(product)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json()
        const product = await prisma.product.update({
            where: { id },
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
        return NextResponse.json(product)
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.transaction.deleteMany({ where: { productId: id } })
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
