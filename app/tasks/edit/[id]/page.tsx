import { TaskForm } from "@/components/task/TaskForm"
import { Task } from "@/types/index"

// Esta es una función simulada para obtener una tarea por ID
async function getTaskById(id: string): Promise<Task | null> {
    try {
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

export default async function EditTaskPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const task = await getTaskById(id);
    
    if (!task) {
        return <div className="container p-4">Task not found</div>
    }

    return <TaskForm taskId={id} initialData={task} />
}
