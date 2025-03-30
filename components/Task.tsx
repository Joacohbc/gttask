import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskStatus, Task as TaskType } from "@/types/index"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRightIcon } from "@radix-ui/react-icons"

const statusColors = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TODO:
            return "bg-blue-500 text-white"
        case TaskStatus.IN_PROGRESS:
            return "bg-yellow-500 text-white"
        case TaskStatus.DONE:
            return "bg-green-500 text-white"
        default:
            return "bg-gray-500 text-white"
    }
}

const priorityColors = (priority: string) => {
    switch (priority) {
        case "low":
            return "bg-green-500 text-white"
        case "medium":
            return "bg-yellow-500 text-white"
        case "high":
            return "bg-red-500 text-white"
        default:
            return "bg-gray-500 text-white"
    }
}

export function Task({ id, title, description, status, priority, boardId }: TaskType) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const [boards, setBoards] = useState<any[]>([])
    const [selectedBoardId, setSelectedBoardId] = useState(boardId || "")
    
    // Cargar los tableros disponibles
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch("/api/boards")
                const data = await response.json()
                setBoards(data.boards || [])
            } catch (error) {
                console.error("Error fetching boards:", error)
            }
        }
        
        fetchBoards()
    }, [])

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            setIsDeleting(true)
            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'DELETE',
                })
                
                if (response.ok) {
                    router.refresh()
                } else {
                    console.error('Error al eliminar la tarea')
                }
            } catch (error) {
                console.error('Error de red:', error)
            } finally {
                setIsDeleting(false)
            }
        }
    }
    
    const handleMoveTask = async (newBoardId: string) => {
        if (newBoardId === boardId) return
        
        setIsMoving(true)
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boardId: newBoardId
                }),
            })
            
            if (response.ok) {
                setSelectedBoardId(newBoardId)
                router.refresh()
            } else {
                console.error('Error al mover la tarea')
            }
        } catch (error) {
            console.error('Error de red:', error)
        } finally {
            setIsMoving(false)
        }
    }

    return (
        <Card className="p-2 my-3 mx-1">
            <CardHeader className="flex flex-col justify-center items-start">
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className={statusColors(status)}>{status}</Badge>
                    <Badge variant="outline" className={priorityColors(priority)}>{priority}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-wrap">
                    {description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-2">
                <div className="flex w-full items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex-grow">
                                    <Select
                                        value={selectedBoardId}
                                        onValueChange={handleMoveTask}
                                        disabled={isMoving}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Mover a tablero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {boards.map((board) => (
                                                <SelectItem 
                                                    key={board.id} 
                                                    value={board.id}
                                                    disabled={board.id === boardId}
                                                >
                                                    {board.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mover tarea a otro tablero</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <ArrowRightIcon className={`h-4 w-4 ${isMoving ? "animate-spin" : ""}`} />
                </div>
                <div className="flex justify-end w-full">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/tasks/edit/${id}`)}>Edit</Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Delete'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
