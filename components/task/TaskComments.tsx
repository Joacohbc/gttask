import { Comment } from "@/types";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TaskCommentsProps {
    comments: Comment[];
}

export function TaskComments({ comments }: TaskCommentsProps) {
    if (!comments || comments.length === 0) return null;

    return (
        <>
            <div>
                <h3 className="text-md font-medium mb-2">
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Comments ({comments.length})
                    </div>
                </h3>
                <div className="space-y-4">
                    {comments.map((comment) => (
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
    );
}
