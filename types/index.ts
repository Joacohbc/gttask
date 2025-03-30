// TaskStatus
export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}

// TaskPriority
export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date;
    updatedAt: Date;
}

export type Board = {
    id: string;
    title: string;
    tasks: Task[];
}