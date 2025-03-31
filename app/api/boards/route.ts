import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/boards - Obtener todos los tableros
export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        tasks: true,
      },
    })
    return NextResponse.json({ boards })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error fetching boards' }, { status: 500 })
  }
}

// POST /api/boards - Crear un nuevo tablero
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const board = await prisma.board.create({
      data: json,
    })
    return NextResponse.json({ board })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error creating board' }, { status: 500 })
  }
}
