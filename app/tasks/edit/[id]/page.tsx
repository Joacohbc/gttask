"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Board, Task } from "@/types/index"

export default function EditTaskPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [task, setTask] = useState<Task | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("todo")
    const [priority, setPriority] = useState("medium")
    const [boardId, setBoardId] = useState("")
    const [boards, setBoards] = useState<Board[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/tasks/${params.id}`)
                const data = await response.json()
                
                if (data.task) {
                    setTask(data.task)
                    setTitle(data.task.title)
                    setDescription(data.task.description || "")
                    setStatus(data.task.status)
                    setPriority(data.task.priority)
                    setBoardId(data.task.boardId)
                }
                
                const boardsResponse = await fetch("/api/boards")
                const boardsData = await boardsResponse.json()
                setBoards(boardsData.boards)
            } catch (error) {
                console.error("Error fetching task:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchTask()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title || !boardId) return
        
        setIsSubmitting(true)
        
        try {
            const response = await fetch(`/api/tasks/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    priority,
                    boardId,
                }),
            })
            
            if (response.ok) {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            console.error("Error updating task:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="container p-4">Cargando...</div>
    }

    if (!task) {
        return <div className="container p-4">Tarea no encontrada</div>
    }

    return (
        <div className="container max-w-md p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Tarea</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Tablero</label>
                            <Select value={boardId} onValueChange={setBoardId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tablero" />
                                </SelectTrigger>
                                <SelectContent>
                                    {boards.map((board) => (
                                        <SelectItem key={board.id} value={board.id}>
                                            {board.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block mb-1">Título</label>
                            <Input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Descripción</label>
                            <Textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Estado</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">Pendiente</SelectItem>
                                    <SelectItem value="in-progress">En Progreso</SelectItem>
                                    <SelectItem value="done">Completado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block mb-1">Prioridad</label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Guardando..." : "Actualizar Tarea"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => router.back()} className="w-full">
                        Cancelar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
