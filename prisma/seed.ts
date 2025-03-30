import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear tableros iniciales
  const todoBoard = await prisma.board.upsert({
    where: { id: 'clx1' },
    update: {},
    create: {
      id: 'clx1',
      title: 'Pendientes',
    },
  })

  const inProgressBoard = await prisma.board.upsert({
    where: { id: 'clx2' },
    update: {},
    create: {
      id: 'clx2',
      title: 'En Progreso',
    },
  })

  const doneBoard = await prisma.board.upsert({
    where: { id: 'clx3' },
    update: {},
    create: {
      id: 'clx3',
      title: 'Completados',
    },
  })

  // Crear tareas de ejemplo
  await prisma.task.createMany({
    data: [
      {
        title: 'Diseñar Interfaz',
        description: 'Crear mockups de la interfaz de usuario',
        status: 'todo',
        priority: 'high',
        boardId: todoBoard.id,
      },
      {
        title: 'Implementar Base de Datos',
        description: 'Configurar SQLite con Prisma',
        status: 'in-progress',
        priority: 'medium',
        boardId: inProgressBoard.id,
      },
      {
        title: 'Pruebas Unitarias',
        description: 'Escribir pruebas para los componentes',
        status: 'todo',
        priority: 'low',
        boardId: todoBoard.id,
      },
      {
        title: 'Documentación',
        description: 'Documentar la API y el código',
        status: 'done',
        priority: 'medium',
        boardId: doneBoard.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Base de datos inicializada correctamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
