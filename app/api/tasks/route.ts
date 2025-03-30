import { NextResponse } from "next/server";
import { TaskPriority, TaskStatus, Task, Board } from "@/types";

// Create dummy tasks data
function generateDummyTasks(): { boards: Board[] } {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todoTasks: Task[] = [
        {
            id: "task-1",
            title: "Design UI Components",
            description: "Create mockups for the new dashboard components",
            status: TaskStatus.TODO,
            priority: TaskPriority.HIGH,
            createdAt: yesterday,
            updatedAt: yesterday
        },
        {
            id: "task-2",
            title: "Setup API Authentication",
            description: "Configure JWT authentication for API endpoints",
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            createdAt: today,
            updatedAt: today
        },
        {
            id: "task-5",
            title: "User Testing",
            description: "Organize user testing sessions for the MVP",
            status: TaskStatus.TODO,
            priority: TaskPriority.LOW,
            createdAt: today,
            updatedAt: today
        }
    ];

    const inProgressTasks: Task[] = [
        {
            id: "task-3",
            title: "Implement Task Sorting",
            description: "Add ability to sort tasks by priority and date",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            createdAt: yesterday,
            updatedAt: today
        },
        {
            id: "task-6",
            title: "Responsive Design",
            description: "Ensure app works well on mobile devices",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.MEDIUM,
            createdAt: yesterday,
            updatedAt: today
        }
    ];

    const doneTasks: Task[] = [
        {
            id: "task-4",
            title: "Project Setup",
            description: "Initialize project and install dependencies",
            status: TaskStatus.DONE,
            priority: TaskPriority.LOW,
            createdAt: yesterday,
            updatedAt: yesterday
        },
        {
            id: "task-7",
            title: "Database Schema",
            description: "Define database schema for tasks and projects",
            status: TaskStatus.DONE,
            priority: TaskPriority.MEDIUM,
            createdAt: yesterday,
            updatedAt: today
        }
    ];

    const boards: Board[] = [
        {
            id: "board-1",
            title: "To Do",
            tasks: todoTasks
        },
        {
            id: "board-2",
            title: "In Progress",
            tasks: inProgressTasks
        },
        {
            id: "board-3",
            title: "Done",
            tasks: doneTasks
        }
    ];

    return { boards };
}

export async function GET() {
    // In a real application, you would likely:
    // 1. Authenticate the user
    // 2. Query the database for the user's tasks
    // 3. Return the tasks in the appropriate format

    // For now, just return dummy data
    const tasks = generateDummyTasks();

    return NextResponse.json(tasks);
}
