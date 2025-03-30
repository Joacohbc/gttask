import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/tasks/[id] - Obtener una tarea específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: params.id,
            },
            include: {
                tags: true,
                parentTask: true,
                subtasks: true,
            }
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
        
        // Process dates if they exist
        if (json.startDate && typeof json.startDate === 'string') {
            json.startDate = new Date(json.startDate)
        }
        
        if (json.dueDate && typeof json.dueDate === 'string') {
            json.dueDate = new Date(json.dueDate)
        }
        
        // Format tags for Prisma if they exist
        if (json.tags && Array.isArray(json.tags)) {
            json.tags = {
                connectOrCreate: json.tags.map(tag => ({
                    where: { id: tag.id },
                    create: {
                        name: tag.name,
                        color: tag.color
                    }
                }))
            }
        }
        
        // Handle parent task relationship if needed
        if (json.parentId === 'N/A' || json.parentId === '') {
            delete json.parentId
        }
        
        const task = await prisma.task.update({
            where: {
                id: params.id,
            },
            data: json,
        })
        
        return NextResponse.json({ task })
    } catch (error) {
        console.error("Error updating task:", error)
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
