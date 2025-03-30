"use client";

import { Task, TaskStatus, TaskPriority } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Flag, MessageSquare, Tag } from "lucide-react";

interface TaskDetailsProps {
    task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
    
    // Helper function to render priority with appropriate color
    const renderPriority = (priority: TaskPriority) => {
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
    };

    // Helper function to render status with appropriate color
    const renderStatus = (status: TaskStatus) => {
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
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            ID: {task.id}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {renderStatus(task.status)}
                        {renderPriority(task.priority)}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Description */}
                <div>
                    <h3 className="text-md font-medium mb-2">Description</h3>
                    <div className="whitespace-pre-wrap text-sm">
                        {task.description || "No description provided."}
                    </div>
                </div>

                <Separator />

                {/* Dates */}
                <div>
                    <h3 className="text-md font-medium mb-2">Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Start Date:</span>
                            <span>{formatDate(task.startDate)}</span>
                        </div>

                        {task.dueDate && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Due Date:</span>
                                <span>{formatDate(task.dueDate)}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Created:</span>
                            <span>{formatDate(task.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Last Updated:</span>
                            <span>{formatDate(task.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <>
                        <div>
                            <h3 className="text-md font-medium mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag) => (
                                    <Badge key={tag.id} style={{ backgroundColor: tag.color, color: '#fff' }}>
                                        <Tag className="mr-1 h-3 w-3" />
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <Separator />
                    </>
                )}

                {/* Related Tasks */}
                <div>
                    <h3 className="text-md font-medium mb-2">Related Tasks</h3>

                    {task.parentTask ? (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Parent Task</h4>
                            <div className="p-3 border rounded-md">
                                <p className="font-medium">{task.parentTask.title}</p>
                                <p className="text-xs text-muted-foreground">ID: {task.parentTask.id}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground mb-4">No parent task</p>
                    )}

                    {task.subtasks && task.subtasks.length > 0 ? (
                        <div>
                            <h4 className="text-sm font-medium mb-1">Subtasks ({task.subtasks.length})</h4>
                            <div className="space-y-2">
                                {task.subtasks.map((subtask) => (
                                    <div key={subtask.id} className="p-3 border rounded-md">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">{subtask.title}</p>
                                            {renderStatus(subtask.status)}
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

                {/* Comments */}
                {task.comments && task.comments.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="text-md font-medium mb-2">
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    Comments ({task.comments.length})
                                </div>
                            </h3>
                            <div className="space-y-4">
                                {task.comments.map((comment) => (
                                    <div key={comment.id} className="p-3 bg-muted rounded-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-medium">User ID: {comment.userId}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-3 ml-6 space-y-3">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="p-3 bg-background rounded-md">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs font-medium">User ID: {reply.userId}</p>
                                                            <p className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</p>
                                                        </div>
                                                        <p className="text-sm">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Board ID: {task.boardId}</p>
            </CardFooter>
        </Card>
    );
}
