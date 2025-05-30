import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({ orderBy: { name: 'asc' } })
        return NextResponse.json(suppliers)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const supplier = await prisma.supplier.create({
            data: { name: body.name, contact: body.contact || '', email: body.email || '', phone: body.phone || '', address: body.address || '' }
        })
        return NextResponse.json(supplier, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}
