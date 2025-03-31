"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/index"

interface TaskSelectorProps {
    value: string
    onChange: (value: string) => void
    availableTasks: Task[]
    excludeTaskId?: string
    placeholder?: string
}

export function TaskSelector({
    value,
    onChange,
    availableTasks,
    excludeTaskId,
    placeholder = "Select parent task..."
}: TaskSelectorProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredTasks = availableTasks.filter(task =>
        task.id !== excludeTaskId && task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const displayValue = availableTasks.find(task => task.id === value)?.title

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="text-wrap text-center">{displayValue || placeholder}</div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-full p-0 bg-black border shadow-md">
                <Command className="rounded-lg border bg-card">
                    <CommandInput
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandEmpty className="py-2 px-4 text-sm text-muted-foreground">No task found</CommandEmpty>
                    <CommandGroup className="bg-card max-h-[300px] overflow-auto">
                        <CommandItem
                            key="none"
                            onSelect={() => {
                                onChange("")
                                setOpen(false)
                                setSearchTerm("")
                            }}
                            className="flex items-center gap-2 hover:bg-accent"
                        >
                            <Check
                                className={`h-4 w-4 ${value === "" ? "opacity-100" : "opacity-0"}`}
                            />
                            <span>None</span>
                        </CommandItem>

                        {filteredTasks.map(task => (
                            <CommandItem
                                key={task.id}
                                onSelect={() => {
                                    onChange(task.id)
                                    setOpen(false)
                                    setSearchTerm("")
                                }}
                                className="flex items-center gap-2 hover:bg-accent"
                            >
                                <Check
                                    className={`h-4 w-4 ${value === task.id ? "opacity-100" : "opacity-0"}`}
                                />
                                <span>{task.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}