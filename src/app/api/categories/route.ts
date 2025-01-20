import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
        return NextResponse.json(categories)
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const category = await prisma.category.create({ data: { name: body.name, description: body.description || '' } })
        return NextResponse.json(category, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
    }
}
