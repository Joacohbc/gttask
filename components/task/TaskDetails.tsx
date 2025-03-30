import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { TagsList } from "./TagsList";
import { TaskComments } from "./TaskComments";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { RelatedTasks } from "./RelatedTasks";
import { DateDisplay } from "./DateDisplay";

interface TaskDetailsProps {
    task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <div className="flex flex-col gap-2 items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            ID: {task.id}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <TaskPriorityBadge priority={task.priority} />
                        <TaskStatusBadge status={task.status} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-md font-medium mb-2">Description</h3>
                    <div className="whitespace-pre-wrap text-sm">
                        {task.description || "No description provided."}
                    </div>
                </div>
                <h3 className="text-md font-medium mb-2">Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DateDisplay label="Start Date" date={task.startDate} icon={Calendar} />
                    <DateDisplay label="Due Date" date={task.dueDate} icon={Calendar} />
                    <DateDisplay label="Created At" date={task.createdAt} icon={Clock} />
                    <DateDisplay label="Updated At" date={task.updatedAt} icon={Clock} />
                </div>
                {task.tags && task.tags.length > 0 &&  <TagsList tags={task.tags} />}
                <RelatedTasks parentTask={task.parentTask} subtasks={task.subtasks} />
                {task.comments && task.comments.length > 0 && <TaskComments comments={task.comments} />}
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Board ID: {task.boardId}</p>
            </CardFooter>
        </Card>
    );
}
