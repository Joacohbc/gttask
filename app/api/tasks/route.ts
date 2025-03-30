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
        
        const task = await prisma.task.create({
            data: json,
        })
        
        return NextResponse.json({ task })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error creating task' }, { status: 500 })
    }
}
