"use client"

import { useState, useRef, useEffect, useReducer } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Message, MessageType } from "@/app/api/chat/types"
import { Board as BoardType } from "@/types/index"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"

const API_URL = "/api/chat"

type ChatFunction = (newMessages: Message[]) => Promise<Message>

// Define the chat state interface
interface ChatState {
    messages: Message[];
    isLoading: boolean;
}

// Define action types
type ChatAction =
    | { type: 'ADD_USER_MESSAGE'; message: string }
    | { type: 'ADD_ASSISTANT_MESSAGE'; message: string }
    | { type: 'SET_LOADING'; isLoading: boolean }
    | { type: 'SET_ERROR'; error: string };

// Create the reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, { content: action.message, role: MessageType.USER }],
            };
        case 'ADD_ASSISTANT_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, { content: action.message, role: MessageType.ASSISTANT }],
                isLoading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.isLoading,
            };
        case 'SET_ERROR':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

const chatApi = (initMessage : Message[]): ChatFunction => {
    const messages: Message[] = initMessage;

    return async (newMessages: Message[]): Promise<Message> => {
        messages.push(...newMessages);
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: messages }),
        })

        if (!response.ok) {
            throw new Error("Failed to fetch chat response")
        }

        const data = await response.json()
        if (!data || !data.content) {
            throw new Error("Invalid response from chat API")
        }

        // Add the assistant's response to the messages array
        messages.push({ role: "assistant", content: data.content })
        return messages[messages.length - 1];
    }
}

const boardToMessage = (board: BoardType): string => {
    return `Board: ${board.title}\nTasks:\n${board.tasks.map(task => `- ${task.title} (${task.status})`).join("\n")}`;
}

const chatPrompt = (boards: BoardType[]): string => {
    return `You are a project management assistant. 
        Here are the boards and their tasks:\n${boards.map(board => boardToMessage(board)).join("\n")}`;
}

type ChatProps = {
    boards: BoardType[]
}

export default function Chat( { boards }: ChatProps) {
    const [chatState, dispatch] = useReducer(chatReducer, {
        messages: [],
        isLoading: false
    });
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { messages, isLoading } = chatState;

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
    }

    const handleSendMessage = async () => {
        if (!input.trim()) return

        dispatch({ type: 'ADD_USER_MESSAGE', message: input });
        dispatch({ type: 'SET_LOADING', isLoading: true });
        setInput("")

        try {
            const chatFunction = chatApi([{
                role: MessageType.USER,
                content: chatPrompt(boards)
            }]);

            const response = await chatFunction([...messages, { content: input, role: MessageType.USER }])
            dispatch({ type: 'ADD_ASSISTANT_MESSAGE', message: response.content });
        } catch (error) {
            console.error("Error sending message:", error)
            dispatch({ type: 'SET_ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <Card className="flex-1 p-4 overflow-hidden flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4 text-center">Chat with AI</h1>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className="flex items-start gap-2 max-w-[80%]">
                                {message.role === "assistant" && (
                                    <Avatar className="w-8 h-8 bg-blue-600">
                                        <span className="text-xs">AI</span>
                                    </Avatar>
                                )}
                                <div
                                    className={`p-3 rounded-lg ${message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-800 text-slate-100"
                                        }`}
                                >
                                    {message.role === "assistant" ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown 
                                                rehypePlugins={[rehypeSanitize]}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        message.content
                                    )}
                                </div>
                                {message.role === "user" && (
                                    <Avatar className="w-8 h-8">
                                        <span className="text-xs">You</span>
                                    </Avatar>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
                <Textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    className="resize-none"
                    rows={2}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="shrink-0"
                >
                    {isLoading ? "Thinking..." : "Send"}
                </Button>
            </div>
        </Card>
    )
}