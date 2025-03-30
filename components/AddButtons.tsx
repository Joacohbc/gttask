"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerTrigger 
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"

export function AddButtons() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                    <PlusIcon className="h-6 w-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-center">
                    <DrawerTitle>Add</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col space-y-4 p-4 items-center">
                    <Button className="w-full" onClick={() => {
                        router.push('/boards/add')
                        setOpen(false)
                    }}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Board
                    </Button>
                    <Button className="w-full" onClick={() => {
                        router.push('/tasks/add')
                        setOpen(false)
                    }}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Task
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
