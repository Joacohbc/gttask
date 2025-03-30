import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ALL_TASK_STATUSES, TaskStatus, Task as TaskType } from "@/types/index"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRightIcon, EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "@/components/ui/scroll-area"

const statusColors = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TODO:
            return "bg-blue-500 text-white"
        case TaskStatus.IN_PROGRESS:
            return "bg-yellow-500 text-white"
        case TaskStatus.BLOCKED:
            return "bg-red-500 text-white"
        case TaskStatus.ON_HOLD:
            return "bg-orange-500 text-white"
        case TaskStatus.REVIEW:
            return "bg-purple-500 text-white"
        case TaskStatus.TESTING:
            return "bg-indigo-500 text-white"
        case TaskStatus.DONE:
            return "bg-green-500 text-white"
        case TaskStatus.ACHIEVED:
            return "bg-emerald-500 text-white"
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
    const [isHolding, setIsHolding] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
    
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

    // Long press handlers
    const handlePointerDown = () => {
        holdTimerRef.current = setTimeout(() => {
            setIsHolding(true)
        }, 500) // 500ms hold time to activate
    }

    const handlePointerUp = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
    }

    const handlePointerLeave = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
    }

    // Clean up timer on component unmount
    useEffect(() => {
        return () => {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current)
            }
        }
    }, [])

    // Click handler for status buttons
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Only toggle if not holding (to prevent conflicts with hold action)
        if (!isHolding) {
            setIsClicked(!isClicked);
        }
        // Prevent the click from triggering other actions
        e.stopPropagation();
    }

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClicked(false);
        };
        
        if (isClicked) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isClicked]);

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
                setIsHolding(false)
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

    const handleStatusChange = async (newStatus: TaskStatus) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                }),
            })
            
            if (response.ok) {
                router.refresh()
            } else {
                console.error('Error al cambiar el estado de la tarea')
            }
        } catch (error) {
            console.error('Error de red:', error)
        }
    }

    return (
        <Card 
            className={`p-2 my-3 mx-1 ${isHolding ? 'ring-2 ring-primary' : ''} ${isClicked ? 'ring-1 ring-muted' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            onContextMenu={(e) => {
                e.preventDefault()
                setIsHolding(prev => !prev)
            }}
        >
            <CardHeader className="flex flex-col justify-center items-center">
                <CardTitle className="text-md text-wrap text-center">{title}</CardTitle>
                <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className={statusColors(status)}>{status}</Badge>
                    <Badge variant="outline" className={priorityColors(priority)}>{priority}</Badge>
                </div>
            </CardHeader>
            
            {isClicked && (
                <CardContent className="px-2 py-0">
                    <ScrollArea className="h-[120px] pr-2">
                        <div className="flex flex-wrap justify-center gap-2 pb-2">
                            {ALL_TASK_STATUSES.map((taskStatus) => (
                                <Button 
                                    key={taskStatus}
                                    size="sm" 
                                    variant={status === taskStatus ? "default" : "outline"} 
                                    className={`text-xs ${statusColors(taskStatus)}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(taskStatus);
                                    }}
                                    disabled={status === taskStatus}
                                >
                                    {taskStatus}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            )}
            
            <CardFooter className="flex flex-col gap-2">
                {isClicked && (
                    <div className="flex flex-wrap w-full gap-1 items-center justify-center">
                        {boards.map((board) => (
                            <Button
                                key={board.id}
                                size="sm"
                                variant={board.id === boardId ? "outline" : "secondary"}
                                className="text-xs h-7 px-2"
                                disabled={board.id === boardId || isMoving}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveTask(board.id);
                                }}
                            >
                                {board.title}
                            </Button>
                        ))}
                    </div>
                )}
                
                {isHolding && (
                    <div className="flex justify-end w-full mt-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/tasks/${id}`);
                                        }}
                                    >
                                        <EyeOpenIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ver detalles</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="ml-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/tasks/edit/${id}`);
                                        }}
                                    >
                                        <Pencil1Icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar tarea</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="ml-2 text-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        disabled={isDeleting}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Eliminar tarea</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
