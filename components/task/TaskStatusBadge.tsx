import { TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TaskStatusBadgeProps {
    status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    const statusColors = {
        [TaskStatus.TODO]: "bg-slate-100 text-slate-800",
        [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
        [TaskStatus.BLOCKED]: "bg-red-100 text-red-800",
        [TaskStatus.ON_HOLD]: "bg-orange-100 text-orange-800",
        [TaskStatus.REVIEW]: "bg-purple-100 text-purple-800",
        [TaskStatus.TESTING]: "bg-indigo-100 text-indigo-800",
        [TaskStatus.DONE]: "bg-green-100 text-green-800",
        [TaskStatus.ACHIEVED]: "bg-emerald-100 text-emerald-800",
    };

    // Convert status format from 'in-progress' to 'In Progress'
    const formattedStatus = status.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
        <Badge className={statusColors[status]}>
            {formattedStatus}
        </Badge>
    );
}
