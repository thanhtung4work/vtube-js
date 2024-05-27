import { Message } from "@/lib/validators/message";
import { ReactNode, createContext, useState } from "react";

export const MessagesContext = createContext<{
    messages: Message[]
    isMessageUpdating: boolean
    addMessages: (message: Message) => void
    removeMessage: (id: string) => void
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void
    setIsMessageUpdateing: (isUpdating: boolean) => void
}>({
    messages: [],
    isMessageUpdating: false,
    addMessages:() => {},
    removeMessage: () => {},
    updateMessage: () => {},
    setIsMessageUpdateing: () => {}
})

export function MessagesProvider({children}: {children: ReactNode}) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isMessageUpdating, setIsMessageUpdateing] = useState<boolean>(false)
    
    const addMessages = (message: Message) => {
        setMessages((prev) => [...prev, message])
    }

    const removeMessage = (id: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== id))
    }

    const updateMessage = () => {}



    return (
        <MessagesContext.Provider value={{
            messages,
            isMessageUpdating,
            addMessages,
            removeMessage,
            updateMessage,
            setIsMessageUpdateing
        }}>
            {children}
        </MessagesContext.Provider>
    )
}