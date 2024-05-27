"use client"

import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { FC, HTMLAttributes, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({className, ...props}) => {
    const [input, setInput] = useState<string>("")

    const {mutate: sendMessage, isPending} = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({messages: [message]})
            })
            return response.body
        },
        onSuccess: async (stream) => {
            if (!stream) {throw new Error("No stream found")}

            const reader = stream.getReader()
            const decoder = new TextDecoder()

            let done = false

            while (!done) {
                const {value, done: doneReading} = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)
                console.log(chunkValue, '\n')
            }
        }
    })

    return (
        <div {...props} className={cn('border-t border-zinc-300', className)}>
            <div className="relative mt-4 flex-1 overfole-hidden rounded-lg border-none outline-none">
                <TextareaAutosize
                    rows={2}
                    maxRows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault()

                            const message: Message = {
                                id: nanoid(),
                                isUserInput: true,
                                text: input
                            }
                            sendMessage(message)
                        }
                    }}
                    autoFocus
                    placeholder="Say something..." 
                    className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 px-3 focus:outline-none rounded-md"
                />
            </div>
        </div>
    )
}

export default ChatInput