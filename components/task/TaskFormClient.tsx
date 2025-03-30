"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Board, Task, TaskStatus, TaskPriority, ALL_TASK_STATUSES, ALL_TASK_PRIORITIES, Tag } from "@/types/index"
import { TagSelector } from "@/components/task/TagSelector"
import { TaskSelector } from "@/components/task/TaskSelector"

const DATE_FORMAT = "dd/MM/yyyy"

interface TaskFormClientProps {
    taskId?: string;
    initialData?: Task;
    isLoading?: boolean;
    boards: Board[];
    availableTasks: Task[];
    availableTags: Tag[];
}

export function TaskFormClient({ 
    taskId, 
    initialData, 
    isLoading = false,
    boards,
    availableTasks,
    availableTags
}: TaskFormClientProps) {
    const router = useRouter()
    const isEditMode = !!taskId;

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO)
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
    const [boardId, setBoardId] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [parentId, setParentId] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize form with default board if available
    useEffect(() => {
        if (boards.length > 0 && !isEditMode && !boardId) {
            setBoardId(boards[0].id)
        }
    }, [boards, isEditMode, boardId])

    // If we have initial data (edit mode), populate the form
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description || "")
            setStatus(initialData.status)
            setPriority(initialData.priority)
            setBoardId(initialData.boardId)

            if (initialData.startDate) {
                setStartDate(new Date(initialData.startDate))
            }

            if (initialData.dueDate) {
                setDueDate(new Date(initialData.dueDate))
            }

            if (initialData.parentId && initialData.parentId !== "N/A") {
                setParentId(initialData.parentId)
            }

            if (initialData.tags) {
                setTags(initialData.tags)
            }
        }
    }, [initialData])

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
                parentId: parentId != "N/A" ? parentId : undefined,
                startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
                dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
            }

            const url = isEditMode ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
            const method = isEditMode ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
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
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="container p-4">Loading...</div>
    }

    return (
        <div className="container max-w-md p-4 overflow-hidden">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? "Edit Task" : "Add New Task"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Board</label>
                            <Select value={boardId} defaultValue={initialData?.boardId} onValueChange={setBoardId}>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Status</label>
                                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black">
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
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black">
                                        {ALL_TASK_PRIORITIES.map((priorityOption) => (
                                            <SelectItem key={priorityOption} value={priorityOption}>
                                                {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="block w-full">
                                <label className="block mb-1">Start Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, DATE_FORMAT) : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-black" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="block w-full">
                                <label className="block mb-1">Due Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, DATE_FORMAT) : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-black" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1">Parent Task (optional)</label>
                            <TaskSelector
                                value={parentId}
                                onChange={setParentId}
                                availableTasks={availableTasks}
                                excludeTaskId={taskId}
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
                                {isSubmitting ? "Saving..." : isEditMode ? "Update Task" : "Save Task"}
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
