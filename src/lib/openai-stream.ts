import { ParsedEvent, ReconnectInterval, createParser} from "eventsource-parser"

export type ChatGPTAgent = "user" | "system"

export interface ChatGPTMessage {
    role: ChatGPTAgent
    content: string
}

export interface OpenAIStreamPayload {
    model: string,
    messages: ChatGPTMessage[],
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number,
    max_tokens: number,
    stream: boolean,
    n: number
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let counter = 0

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
    })

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if(event.type === "event") {
                    const data = event.data
                    if(data === "[DONE]") {
                        controller.close()
                        return
                    }

                    try {
                        const json = JSON.parse(data)
                        const text = json.choices[0].delta?.content || ""

                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return
                        }

                        const queue = encoder.encode(text)
                        controller.enqueue(queue)

                        counter ++
                    } catch (error) {
                        controller.error(error)
                    }
                }
            } 

            const parser = createParser(onParse)

            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk))
                console.log(decoder.decode(chunk))
            }
        }
    })
    
    return stream
}

export async function DummyOpenAIStream(payload: OpenAIStreamPayload) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const dummyData = [
        { choices: [{ delta: { content: "Hello, " } }] },
        { choices: [{ delta: { content: "this " } }] },
        { choices: [{ delta: { content: "is " } }] },
        { choices: [{ delta: { content: "a " } }] },
        { choices: [{ delta: { content: "test " } }] },
        { choices: [{ delta: { content: "stream " } }] },
        { choices: [{ delta: { content: "to " } }] },
        { choices: [{ delta: { content: "mimic " } }] },
        { choices: [{ delta: { content: "the " } }] },
        { choices: [{ delta: { content: "OpenAI " } }] },
        { choices: [{ delta: { content: "API " } }] },
        { choices: [{ delta: { content: "response. " } }] },
        { choices: [{ delta: { content: "\n\n" } }] },
        { choices: [{ delta: { content: "It " } }] },
        { choices: [{ delta: { content: "will " } }] },
        { choices: [{ delta: { content: "stream " } }] },
        { choices: [{ delta: { content: "multiple " } }] },
        { choices: [{ delta: { content: "chunks " } }] },
        { choices: [{ delta: { content: "of " } }] },
        { choices: [{ delta: { content: "data " } }] },
        { choices: [{ delta: { content: "to " } }] },
        { choices: [{ delta: { content: "demonstrate " } }] },
        { choices: [{ delta: { content: "how " } }] },
        { choices: [{ delta: { content: "your " } }] },
        { choices: [{ delta: { content: "application " } }] },
        { choices: [{ delta: { content: "handles " } }] },
        { choices: [{ delta: { content: "real " } }] },
        { choices: [{ delta: { content: "API " } }] },
        { choices: [{ delta: { content: "responses. " } }] },
        { choices: [{ delta: { content: "\n\n" } }] },
        { choices: [{ delta: { content: "Let's " } }] },
        { choices: [{ delta: { content: "add " } }] },
        { choices: [{ delta: { content: "some " } }] },
        { choices: [{ delta: { content: "more " } }] },
        { choices: [{ delta: { content: "text " } }] },
        { choices: [{ delta: { content: "to " } }] },
        { choices: [{ delta: { content: "make " } }] },
        { choices: [{ delta: { content: "this " } }] },
        { choices: [{ delta: { content: "even " } }] },
        { choices: [{ delta: { content: "longer " } }] },
        { choices: [{ delta: { content: "so " } }] },
        { choices: [{ delta: { content: "you " } }] },
        { choices: [{ delta: { content: "can " } }] },
        { choices: [{ delta: { content: "thoroughly " } }] },
        { choices: [{ delta: { content: "test " } }] },
        { choices: [{ delta: { content: "the " } }] },
        { choices: [{ delta: { content: "streaming " } }] },
        { choices: [{ delta: { content: "functionality. " } }] },
        { choices: [{ delta: { content: "\n\n" } }] },
        { choices: [{ delta: { content: "This " } }] },
        { choices: [{ delta: { content: "should " } }] },
        { choices: [{ delta: { content: "be " } }] },
        { choices: [{ delta: { content: "enough " } }] },
        { choices: [{ delta: { content: "data " } }] },
        { choices: [{ delta: { content: "to " } }] },
        { choices: [{ delta: { content: "simulate " } }] },
        { choices: [{ delta: { content: "a " } }] },
        { choices: [{ delta: { content: "real " } }] },
        { choices: [{ delta: { content: "response. " } }] },
        "[DONE]"
    ];

    let counter = 0;

    const stream = new ReadableStream({
        async start(controller: ReadableStreamDefaultController<Uint8Array>) {
            function enqueueDummyData() {
                const data = dummyData[counter];

                if (data === "[DONE]") {
                    controller.close();
                    return;
                }

                try {
                    const text = data.choices[0].delta?.content || "";

                    // Skip initial newline characters
                    if (counter < 2 && (text.match(/\n/) || []).length) {
                        return;
                    }

                    const queue = encoder.encode(text);
                    controller.enqueue(queue);

                    counter++;
                } catch (error) {
                    controller.error(error);
                }
            }

            // Mimic asynchronous streaming with a delay
            async function simulateStream() {
                for (let i = 0; i < dummyData.length; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    enqueueDummyData();
                }
            }

            simulateStream();
        }
    });

    return stream;
}
