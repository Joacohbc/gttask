"use client"

import { Task } from "./Task"
import { Board as BoardType, Task as TaskType } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Board({ id, title, tasks }: BoardType) {
    const router = useRouter()
    
    return (
        <div className="h-full w-full rounded-lg border shadow-sm p-4 bg-background flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.push(`/boards/edit/${id}`)}
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </div>
            
            <ScrollArea className="flex-1 w-full pr-3 min-h-[calc(78vh)] max-h-[calc(100%-3rem)]">
                {tasks && tasks.length > 0 ? (
                    <div className="pb-4">
                        {tasks.map((task: TaskType) => (
                            <Task key={task.id} {...task} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full text-muted-foreground">
                        No hay tareas en este tablero
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
