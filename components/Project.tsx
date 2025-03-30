"use client"

import { Board } from "./Board"
import { Board as BoardType } from "@/types/index"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"

interface ProjectProps {
    title: string
    boards: BoardType[]
}

export function Project({ title, boards }: ProjectProps) {
    const router = useRouter()
    
    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
            <Carousel className="w-full h-[calc(100vh-200px)]">
                <CarouselContent className="h-full">
                    {boards.map((board) => (
                        <CarouselItem key={board.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Board
                                    id={board.id}
                                    title={board.title}
                                    tasks={board.tasks}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" /> */}
            </Carousel>
            
            {/* <div className="flex flex-col justify-between items-center my-4">
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
            </div> */}
        </div>
    )
}
