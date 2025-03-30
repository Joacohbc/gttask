import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/boards/[id] - Obtener un tablero específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const board = await prisma.board.findUnique({
            where: {
                id: params.id,
            },
            include: {
                tasks: true,
            },
        })
        if (!board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 })
        }
        return NextResponse.json({ board })
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching board' }, { status: 500 })
    }
}

// PUT /api/boards/[id] - Actualizar un tablero
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const json = await request.json()
        const board = await prisma.board.update({
            where: {
                id: params.id,
            },
            data: json,
        })
        return NextResponse.json({ board })
    } catch (error) {
        return NextResponse.json({ error: 'Error updating board' }, { status: 500 })
    }
}

// DELETE /api/boards/[id] - Eliminar un tablero
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const board = await prisma.board.delete({
            where: {
                id: params.id,
            },
        })
        return NextResponse.json({ board })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting board' }, { status: 500 })
    }
}
