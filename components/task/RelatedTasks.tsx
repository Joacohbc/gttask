import { Task } from "@/types";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface RelatedTasksProps {
    parentTask?: Task;
    subtasks?: Task[];
}

export function RelatedTasks({ parentTask, subtasks }: RelatedTasksProps) {
    return (
        <div>
            <h3 className="text-md font-medium mb-2">Related Tasks</h3>

            {parentTask ? (
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Parent Task</h4>
                    <div className="p-3 border rounded-md">
                        <p className="font-medium">{parentTask.title}</p>
                        <p className="text-xs text-muted-foreground">ID: {parentTask.id}</p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground mb-4">No parent task</p>
            )}

            {subtasks && subtasks.length > 0 ? (
                <div>
                    <h4 className="text-sm font-medium mb-1">Subtasks ({subtasks.length})</h4>
                    <div className="space-y-2">
                        {subtasks.map((subtask) => (
                            <div key={subtask.id} className="p-3 border rounded-md">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{subtask.title}</p>
                                    <TaskStatusBadge status={subtask.status} />
                                </div>
                                <p className="text-xs text-muted-foreground">ID: {subtask.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No subtasks</p>
            )}
        </div>
    );
}
