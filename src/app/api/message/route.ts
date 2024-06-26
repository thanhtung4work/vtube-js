import { ChatGPTMessage, DummyOpenAIStream, OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream"
import { MessageArraySchema } from "@/lib/validators/message"

const chatbotPrompt = `
You are an assistance but you act like a boss.
`

export async function POST(req: Request) {
    const {messages} = await req.json()

    const parsedMessages = MessageArraySchema.parse(messages)

    const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserInput ? "user" : "system",
        content: message.text
    }))

    outboundMessages.unshift({
        role: "system",
        content: chatbotPrompt
    })

    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: outboundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1
    }

    const stream = await DummyOpenAIStream(payload)
    return new Response(stream)
}

export async function GET() {
    return new Response()
}