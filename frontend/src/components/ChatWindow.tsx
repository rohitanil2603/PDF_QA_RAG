import { useEffect, useRef } from "react";
import Message from "./Message";
import type { Message as MessageType } from "../types/chat";

interface Props {
    messages: MessageType[];
}

export default function ChatWindow({ messages }: Props) {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (

        <div className="chat-wrapper">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                />
            ))}
        </div>

    );
}