type Message = {
    role: "user" | "assistant"
    content: string
}

// MessageType Enum
export enum MessageType {
    USER = "user",
    ASSISTANT = "assistant",
}

export type { Message }