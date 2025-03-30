import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskStatus, Task as TaskType } from "@/types/index"
import { useState } from "react"
import { useRouter } from "next/navigation"

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

export function Task({ id, title, description, status, priority }: TaskType) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

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
            <CardFooter className="flex justify-end pt-2">
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
            </CardFooter>
        </Card>
    )
}
