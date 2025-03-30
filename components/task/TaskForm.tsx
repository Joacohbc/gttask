import { Board, Task, Tag } from "@/types/index"
import { TaskFormClient } from "./TaskFormClient"

interface TaskFormProps {
    taskId?: string;
    initialData?: Task;
    isLoading?: boolean;
}

export async function TaskForm({ taskId, initialData, isLoading = false }: TaskFormProps) {
    // Server-side data fetching
    let boards: Board[] = [];
    let availableTasks: Task[] = [];
    let availableTags: Tag[] = [];

    try {
        // Fetch boards
        const boardsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards`, { cache: 'no-store' });
        const boardsData = await boardsResponse.json();
        boards = boardsData.boards;

        // Fetch available tasks for parent selection
        const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, { cache: 'no-store' });
        const tasksData = await tasksResponse.json();

        // Flatten the tasks from all boards
        availableTasks = tasksData.boards.flatMap((board: Board) => board.tasks);

        // Collect all unique tags from all tasks for the tag selector
        const allTags = new Map<string, Tag>();
        availableTasks.forEach((task: Task) => {
            if (task.tags) {
                task.tags.forEach(tag => {
                    allTags.set(tag.id, tag);
                });
            }
        });
        availableTags = Array.from(allTags.values());
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return (
        <TaskFormClient 
            taskId={taskId}
            initialData={initialData}
            isLoading={isLoading}
            boards={boards}
            availableTasks={availableTasks}
            availableTags={availableTags}
        />
    );
}
