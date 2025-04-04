"use client"

import { Board } from "./Board"
import { Board as BoardType } from "@/types/index"
import { 
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel"

interface ProjectProps {
    title: string
    boards: BoardType[]
}

export function Project({ title, boards }: ProjectProps) {
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
            <Carousel className="w-full h-[calc(100vh-200px)]">
                <CarouselContent className="h-full">
                    {boards.map((board) => (
                        <CarouselItem key={board.id} className="h-full w-full">
                            <div className="p-1 h-full">
                                <Board
                                    id={board.id}
                                    title={board.title}
                                    tasks={board.tasks}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
