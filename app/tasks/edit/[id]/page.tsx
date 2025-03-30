"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task/TaskForm"
import { Task } from "@/types/index"

export default function EditTaskPage({ params }: { params: { id: string } }) {
    const [task, setTask] = useState<Task | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/tasks/${params.id}`)
                const data = await response.json()
                
                if (data.task) {
                    setTask(data.task)
                }
            } catch (error) {
                console.error("Error fetching task:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchTask()
    }, [params.id])

    if (isLoading) {
        return <div className="container p-4">Loading task data...</div>
    }

    if (!task) {
        return <div className="container p-4">Task not found</div>
    }

    return <TaskForm taskId={params.id} initialData={task} />
}
