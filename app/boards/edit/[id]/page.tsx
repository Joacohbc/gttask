"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Board } from "@/types/index"

export default function EditBoardPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [board, setBoard] = useState<Board | null>(null)
    const [title, setTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchBoard = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${params.id}`)
                const data = await response.json()
                
                if (data.board) {
                    setBoard(data.board)
                    setTitle(data.board.title)
                }
            } catch (error) {
                console.error("Error fetching board:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchBoard()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title) return
        
        setIsSubmitting(true)
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                }),
            })
            
            if (response.ok) {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            console.error("Error updating board:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este tablero? Se eliminarán todas las tareas asociadas.")) {
            return
        }
        
        setIsDeleting(true)
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${params.id}`, {
                method: "DELETE",
            })
            
            if (response.ok) {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            console.error("Error deleting board:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return <div className="container p-4">Cargando...</div>
    }

    if (!board) {
        return <div className="container p-4">Tablero no encontrado</div>
    }

    return (
        <div className="container max-w-md p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Tablero</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Título</label>
                            <Input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Actualizando..." : "Actualizar Tablero"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()} 
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete} 
                        className="w-full"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar Tablero"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
