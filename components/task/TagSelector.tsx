"use client"

import { useState, useEffect, useRef } from "react"
import { Check, PlusCircle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tag } from "@/types/index"

interface TagSelectorProps {
    tags: Tag[]
    onTagsChange: (tags: Tag[]) => void
    existingTags?: Tag[]
}

export function TagSelector({ tags, onTagsChange, existingTags = [] }: TagSelectorProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [tagColor, setTagColor] = useState("#000000")
    const [searchResults, setSearchResults] = useState<Tag[]>([])
    const [allTags, setAllTags] = useState<Tag[]>(existingTags)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fetch all tags when component mounts
    useEffect(() => {
        const fetchTags = async () => {
            if (existingTags.length === 0) {
                setIsLoading(true)
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`)
                    if (response.ok) {
                        const data = await response.json()
                        setAllTags(data.tags)
                    }
                } catch (error) {
                    console.error("Error fetching tags:", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchTags()
    }, [existingTags])

    useEffect(() => {
        if (inputValue.trim() === "") {
            setSearchResults(allTags)
        } else {
            setSearchResults(
                allTags.filter(tag =>
                    tag.name.toLowerCase().includes(inputValue.toLowerCase())
                )
            )
        }
    }, [inputValue, allTags])

    const handleAddTag = (tag?: Tag) => {
        if (tag) {
            if (!tags.some(t => t.id === tag.id)) {
                onTagsChange([...tags, tag])
            }
        } else {
            const newTag: Tag = {
                id: crypto.randomUUID(),
                name: inputValue,
                color: tagColor,
            }
            onTagsChange([...tags, newTag])
            setInputValue("")
            setTagColor("#000000")
        }
    }

    const handleRemoveTag = (id: string) => {
        onTagsChange(tags.filter(tag => tag.id !== id))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <Badge
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                        className="flex items-center gap-1 px-3 py-1 text-white"
                        onClick={() => handleRemoveTag(tag.id)}
                    >
                        {tag.name}
                    </Badge>
                ))}
            </div>

            <div className="flex gap-2 text-wrap">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            Add Tags
                            <PlusCircle className="ml-2 h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-full p-0 bg-black border shadow-md" align="start">
                        <Command className="rounded-lg border bg-card">
                            <CommandInput
                                placeholder="Search or create tag..."
                                value={inputValue}
                                onValueChange={setInputValue}
                                ref={inputRef}
                            />
                            <CommandList className="bg-card max-h-[300px]">
                                {isLoading ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Loading tags...
                                    </div>
                                ) : (
                                    <>
                                        <CommandEmpty>
                                            <div className="p-2 bg-card">
                                                <div className="text-sm">Create new tag:</div>
                                                <div className="flex mt-2 space-x-2">
                                                    <Input
                                                        type="color"
                                                        value={tagColor}
                                                        onChange={(e) => setTagColor(e.target.value)}
                                                        className="w-10 p-1 h-10"
                                                    />
                                                    <Button
                                                        onClick={() => handleAddTag()}
                                                        className="flex-1"
                                                    >
                                                        Create "{inputValue}"
                                                    </Button>
                                                </div>
                                            </div>
                                        </CommandEmpty>

                                        {searchResults.length > 0 && (
                                            <CommandGroup heading="Existing Tags" className="bg-card">
                                                {searchResults.map(tag => (
                                                    <CommandItem
                                                        key={tag.id}
                                                        onSelect={() => {
                                                            handleAddTag(tag)
                                                            setOpen(false)
                                                        }}
                                                        className="flex items-center gap-2 hover:bg-accent"
                                                    >
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: tag.color }}
                                                        />
                                                        <span>{tag.name}</span>
                                                        <Check
                                                            className={`ml-auto h-4 w-4 ${tags.some(t => t.id === tag.id) ? "opacity-100" : "opacity-0"
                                                                }`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}