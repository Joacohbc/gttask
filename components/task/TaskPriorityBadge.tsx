import { TaskPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
    const priorityColors = {
        [TaskPriority.LOW]: "bg-blue-100 text-blue-800",
        [TaskPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
        [TaskPriority.HIGH]: "bg-red-100 text-red-800",
    };

    return (
        <Badge className={priorityColors[priority]}>
            <Flag className="mr-1 h-3 w-3" />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    );
}
