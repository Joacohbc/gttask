import { AddButtons } from "@/components/AddButtons"
import Chat from "@/components/Chat"
import { Project } from "@/components/Project"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ChatBoardPage() {
    const data = await fetch("http://localhost:3000/api/tasks", {
        cache: "no-store",
    })

    const { boards } = await data.json()

    return (
        <div className="h-screen w-full flex flex-col">
            <Tabs defaultValue="boards" className="flex flex-col h-full">

                <TabsContent value="boards" className="flex-1 p-1 overflow-hidden">
                    <div className="h-full overflow-auto">
                        <Project
                            title="Project Management App"
                            boards={boards}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 p-2">
                    <Chat boards={boards} />
                </TabsContent>

                <TabsList className="grid w-full grid-cols-2 shadow-md text-black">
                    <TabsTrigger value="boards" className="flex items-center justify-center">
                        <svg className="w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                        <span>Tableros</span>
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center justify-center">
                        <svg className="w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Chat</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="fixed bottom-6 right-1 p-4">
                <AddButtons />
            </div>
        </div>
    )
}
