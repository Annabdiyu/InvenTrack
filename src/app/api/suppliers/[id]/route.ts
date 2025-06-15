import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json()
        const supplier = await prisma.supplier.update({
            where: { id },
            data: {
                name: body.name,
                contact: body.contact || '',
                email: body.email || '',
                phone: body.phone || '',
                address: body.address || '',
            },
        })
        return NextResponse.json(supplier)
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.supplier.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
