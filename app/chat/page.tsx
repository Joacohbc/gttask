import Chat from "@/components/Chat"
import { Project } from "@/components/Project"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ChatBoardPage() {
    const data = await fetch("http://localhost:3000/api/tasks", {
        cache: "no-store",
    })

    const { boards } = await data.json()

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <Tabs defaultValue="boards" className="flex flex-col h-full">
                <TabsContent value="boards" className="flex-1 overflow-hidden p-2">
                    <Project
                        title={"Project Management App"}
                        boards={boards}
                    />
                </TabsContent>
                
                <TabsContent value="chat" className="flex-1 overflow-hidden p-2">
                    <Chat boards={boards}/>
                </TabsContent>

                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="boards">Tableros</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}
