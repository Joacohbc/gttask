"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Board } from "@/types/index"

export default function AddTaskPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("todo")
    const [priority, setPriority] = useState("medium")
    const [boardId, setBoardId] = useState("")
    const [boards, setBoards] = useState<Board[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchBoards = async () => {
            const response = await fetch("/api/boards")
            const data = await response.json()
            setBoards(data.boards)
            if (data.boards.length > 0) {
                setBoardId(data.boards[0].id)
            }
        }
        fetchBoards()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title || !boardId) return
        
        setIsSubmitting(true)
        
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
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
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container max-w-md p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Añadir Nueva Tarea</CardTitle>
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
                                {isSubmitting ? "Guardando..." : "Guardar Tarea"}
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
