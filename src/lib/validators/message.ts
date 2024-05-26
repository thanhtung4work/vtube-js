import { z } from "zod";

export const MessageSchema = z.object({
    id: z.string(),
    isUserInput: z.boolean(),
    text: z.string()
})

export const MessageArraySchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>