"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Board, Task, TaskStatus, TaskPriority, ALL_TASK_STATUSES, ALL_TASK_PRIORITIES, Tag } from "@/types/index"
import { TagSelector } from "@/components/task/TagSelector"
import { TaskSelector } from "@/components/task/TaskSelector"

export default function EditTaskPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [task, setTask] = useState<Task | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO)
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.LOW)
    const [boardId, setBoardId] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [parentId, setParentId] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [availableTags, setAvailableTags] = useState<Tag[]>([])
    const [availableTasks, setAvailableTasks] = useState<Task[]>([])
    const [boards, setBoards] = useState<Board[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // Fetch the current task
                const response = await fetch(`/api/tasks/${params.id}`)
                const data = await response.json()
                
                if (data.task) {
                    setTask(data.task)
                    setTitle(data.task.title)
                    setDescription(data.task.description || "")
                    setStatus(data.task.status)
                    setPriority(data.task.priority)
                    setBoardId(data.task.boardId)
                    
                    // Handle dates - convert to yyyy-MM-dd for input fields
                    if (data.task.startDate) {
                        const startDateObj = new Date(data.task.startDate)
                        setStartDate(startDateObj.toISOString().split('T')[0])
                    }
                    
                    if (data.task.dueDate) {
                        const dueDateObj = new Date(data.task.dueDate)
                        setDueDate(dueDateObj.toISOString().split('T')[0])
                    }
                    
                    // Set parent task if exists
                    if (data.task.parentId) {
                        setParentId(data.task.parentId)
                    }
                    
                    // Set tags if exist
                    if (data.task.tags) {
                        setTags(data.task.tags)
                    }
                }
                
                // Fetch boards
                const boardsResponse = await fetch("/api/boards")
                const boardsData = await boardsResponse.json()
                setBoards(boardsData.boards)
                
                // Fetch available tasks for parent selection (excluding current task)
                const tasksResponse = await fetch("/api/tasks")
                const tasksData = await tasksResponse.json()
                
                // Flatten the tasks from all boards
                const allTasks = tasksData.boards.flatMap((board: Board) => board.tasks)
                setAvailableTasks(allTasks)
                
                // Collect all unique tags from all tasks for the tag selector
                const allTags = new Map<string, Tag>()
                allTasks.forEach((task: Task) => {
                    if (task.tags) {
                        task.tags.forEach(tag => {
                            allTags.set(tag.id, tag)
                        })
                    }
                })
                setAvailableTags(Array.from(allTags.values()))
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchData()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title || !boardId) return
        
        setIsSubmitting(true)
        
        try {
            const formData = {
                title,
                description,
                status,
                priority,
                boardId,
                tags,
                parentId: parentId || "N/A",
                startDate: startDate,
                dueDate: dueDate,
            }
            
            const response = await fetch(`/api/tasks/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            
            if (response.ok) {
                router.push("/")
                router.refresh()
            } else {
                const errorData = await response.json()
                console.error("Server error:", errorData)
            }
        } catch (error) {
            console.error("Error updating task:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="container p-4">Loading...</div>
    }

    if (!task) {
        return <div className="container p-4">Task not found</div>
    }

    return (
        <div className="container max-w-md p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Board</label>
                            <Select value={boardId} onValueChange={setBoardId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select board" />
                                </SelectTrigger>
                                <SelectContent className="bg-black">
                                    {boards.map((board) => (
                                        <SelectItem key={board.id} value={board.id}>
                                            {board.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block mb-1">Title</label>
                            <Input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Description</label>
                            <Textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Status</label>
                            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_TASK_STATUSES.map((statusOption) => (
                                        <SelectItem key={statusOption} value={statusOption}>
                                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1).replace(/-/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block mb-1">Priority</label>
                            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_TASK_PRIORITIES.map((priorityOption) => (
                                        <SelectItem key={priorityOption} value={priorityOption}>
                                            {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="block mb-1">Start Date</label>
                            <Input 
                                type="date"
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Due Date</label>
                            <Input 
                                type="date"
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Parent Task (optional)</label>
                            <TaskSelector
                                value={parentId}
                                onChange={setParentId}
                                availableTasks={availableTasks}
                                excludeTaskId={params.id}
                                placeholder="Select parent task (optional)"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Tags</label>
                            <TagSelector
                                tags={tags}
                                onTagsChange={setTags}
                                existingTags={availableTags}
                            />
                        </div>
                        
                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Saving..." : "Update Task"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={() => router.back()} className="w-full">
                        Cancel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
