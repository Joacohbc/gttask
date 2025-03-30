"use client"

import { Task } from "./Task"
import { Board as BoardType, Task as TaskType } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

export function Board({ id, title, tasks }: BoardType) {
    const router = useRouter()
    
    return (
        <div className="w-[300px] rounded-lg border shadow-sm p-4 bg-background">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.push(`/boards/edit/${id}`)}
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </div>
            
            <div>
                {tasks && tasks.length > 0 ? (
                    tasks.map((task: TaskType) => (
                        <Task key={task.id} {...task} />
                    ))
                ) : (
                    <div className="text-center py-4 text-muted-foreground">
                        No hay tareas en este tablero
                    </div>
                )}
            </div>
        </div>
    )
}
