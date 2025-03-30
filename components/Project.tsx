"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Board } from "./Board"
import { Board as BoardType } from "@/types/index"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

interface ProjectProps {
    title: string
    boards: BoardType[]
}

export function Project({ title, boards }: ProjectProps) {
    const router = useRouter()
    
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
            <ScrollArea className="flex-1 w-full whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                    {boards.map((board) => (
                        <Board
                            key={board.id}
                            id={board.id}
                            title={board.title}
                            tasks={board.tasks}
                        />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <div className="flex flex-col justify-between items-center my-4">
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/boards/add')}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nuevo Tablero
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/tasks/add')}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nueva Tarea
                    </Button>
                </div>
            </div>
        </div>
    )
}
