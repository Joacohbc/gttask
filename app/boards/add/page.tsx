"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddBoardPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title) return
        
        setIsSubmitting(true)
        
        try {
            const response = await fetch("/api/boards", {
                method: "POST",
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
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container max-w-md p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nuevo Tablero</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Título</label>
                            <Input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                placeholder="Nombre del tablero"
                            />
                        </div>
                        
                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Creando..." : "Crear Tablero"}
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
