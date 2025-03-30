import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Task as TaskType } from "@/types/index"

export function Task({ id, title, description, status, priority }: TaskType) {
    return (
        <Card className="mb-3">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <Badge variant={status === "done" ? "default" : status === "in-progress" ? "outline" : "secondary"}>
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
                <Badge className="mt-2" variant={priority === "high" ? "destructive" : priority === "medium" ? "outline" : "secondary"}>
                    {priority}
                </Badge>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="ml-2">Delete</Button>
            </CardFooter>
        </Card>
    )
}
