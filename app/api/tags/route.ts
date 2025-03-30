import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/tags - Obtener todas las etiquetas
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        
        return NextResponse.json({ tags })
    } catch (error) {
        console.error("Error fetching tags:", error)
        return NextResponse.json({ error: 'Error fetching tags' }, { status: 500 })
    }
}
