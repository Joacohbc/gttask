import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'NOT_FOUND');
const MODEL = "gemini-2.0-flash";

export async function POST(request : Request) {
    try {
        const { messages } = await request.json();
        console.log("Received messages:", messages);
        
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Messages are required and must be an array" },
                { status: 400 }
            );
        }

        // Convert messages to the format expected by Gemini
        const formattedMessages = messages.map(message => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }]
        }));

        // Get the Gemini model
        const model = genAI.getGenerativeModel({ model: MODEL });

        // Start a chat session
        const chat = model.startChat({
            history: formattedMessages.slice(0, -1),
        });

        // Generate a response
        const result = await chat.sendMessage(formattedMessages[formattedMessages.length - 1].parts[0].text);
        const response = result.response.text();

        return NextResponse.json({ content: response });
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        return NextResponse.json(
            { error: "Failed to communicate with AI service" },
            { status: 500 }
        );
    }
}
