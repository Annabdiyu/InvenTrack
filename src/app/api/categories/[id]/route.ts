import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json()
        const category = await prisma.category.update({ where: { id }, data: { name: body.name, description: body.description || '' } })
        return NextResponse.json(category)
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
