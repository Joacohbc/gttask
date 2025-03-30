import { TaskDetails } from "@/components/task/TaskDetails";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { notFound } from "next/navigation";

// Esta es una función simulada para obtener una tarea por ID
async function getTaskById(id: string): Promise<Task | null> {
    try {
        // Make a real API request to fetch task data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
            next: { revalidate: 60 } // Revalidate cache every minute
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch task: ${response.status}`);
        }
        
        const data = await response.json();
        return data.task;
    } catch (error) {
        console.error("Error fetching task:", error);
        return null;
    }
}

export default async function TaskView({ params }: { params: { id: string } }) {
    console.log("TaskView params:", params);
    
    // Obtener el ID de la tarea desde los parámetros de la URL
    // En Next.js 13+, params ya es resuelto de forma asíncrona, no es necesario await
    const { id } = params;
    
    // Obtener los datos de la tarea
    const task = await getTaskById(id);
    
    // Si no se encuentra la tarea, mostrar la página 404
    if (!task) {
        notFound();
    }
    
    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6">Task Details</h1>
            <TaskDetails task={task} />
        </div>
    );
}