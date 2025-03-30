import Chat from "@/components/Chat"
import { Project } from "@/components/Project"
import { TaskPriority, TaskStatus } from "@/types"

export default async function ChatBoardPage() {
    const data = await fetch("http://localhost:3000/api/tasks", {
        cache: "no-store",
    })

    const { boards } = await data.json()

    return (
        <div className="flex flex-row items-center justify-center min-h-screen p-4">
            <Project
                title={"Project Management App"}
                boards={boards}
            />
            <Chat boards={boards}/>
        </div>
    )
}
