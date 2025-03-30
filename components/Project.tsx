"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Board } from "./Board"
import { Board as BoardType } from "@/types/index"

interface ProjectProps {
    title: string
    boards: BoardType[]
}

export function Project({ title, boards }: ProjectProps) {
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
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
        </div>
    )
}
