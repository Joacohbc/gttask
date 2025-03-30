import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from "./Task"
import { Board as BoardType } from "@/types/index"

export function Board({ id, title, tasks }: BoardType) {
    return (
        <Card className="min-w-[300px] max-w-[350px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        priority={task.priority}
                        createdAt={task.createdAt}
                        updatedAt={task.updatedAt}
                    />
                ))}
            </CardContent>
        </Card>
    )
}
