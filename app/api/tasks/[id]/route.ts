import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/tasks/[id] - Obtener una tarea específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: params.id,
            },
        })
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }
        return NextResponse.json({ task })
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching task' }, { status: 500 })
    }
}

// PUT /api/tasks/[id] - Actualizar una tarea
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const json = await request.json()
        const task = await prisma.task.update({
            where: {
                id: params.id,
            },
            data: json,
        })
        return NextResponse.json({ task })
    } catch (error) {
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 })
    }
}

// DELETE /api/tasks/[id] - Eliminar una tarea
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const task = await prisma.task.delete({
            where: {
                id: params.id,
            },
        })
        return NextResponse.json({ task })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting task' }, { status: 500 })
    }
}
