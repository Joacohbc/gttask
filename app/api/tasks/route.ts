import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/tasks - Obtener todas las tareas
export async function GET() {
    try {
        const boards = await prisma.board.findMany({
            include: {
                tasks: true,
            },
        })
        return NextResponse.json({ boards })
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 })
    }
}

// POST /api/tasks - Crear una nueva tarea
export async function POST(request: Request) {
    try {
        const json = await request.json()
        const task = await prisma.task.create({
            data: json,
        })
        return NextResponse.json({ task })
    } catch (error) {
        return NextResponse.json({ error: 'Error creating task' }, { status: 500 })
    }
}
