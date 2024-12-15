import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const [
            totalProducts,
            lowStockProducts,
            totalCategories,
            totalSuppliers,
            recentTransactions,
            allProducts,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { quantity: { lte: prisma.product.fields.minStock } } }).catch(() =>
                // Fallback: fetch and filter manually
                prisma.product.findMany({ select: { quantity: true, minStock: true } }).then(
                    (products) => products.filter((p) => p.quantity <= p.minStock).length
                )
            ),
            prisma.category.count(),
            prisma.supplier.count(),
            prisma.transaction.findMany({
                include: { product: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            prisma.product.findMany({ select: { quantity: true, price: true, minStock: true, name: true, sku: true } }),
        ])

        const totalValue = allProducts.reduce((sum, p) => sum + p.quantity * p.price, 0)
        const lowStock = allProducts.filter((p) => p.quantity <= p.minStock)

        return NextResponse.json({
            totalProducts,
            lowStockCount: lowStock.length,
            totalCategories,
            totalSuppliers,
            totalValue,
            recentTransactions,
            lowStockItems: lowStock,
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}
