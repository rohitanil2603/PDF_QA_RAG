
import type { Message as MessageType } from "../types/chat";
import ReactMarkdown from "react-markdown";
import { User, Bot } from "lucide-react";

interface Props {
    message: MessageType;
}

export default function Message({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex gap - 4 py - 4 ${isUser ? "justify-end" : "justify-start"
                } `}
        >
            {!isUser && (
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bot size={18} className="text-white" />
                    </div>
                </div>
            )}

            <div
                className={`
transition - all duration - 200
                    ${isUser
                        ? "max-w-[75%] bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "max-w-[85%] bg-zinc-900 border border-zinc-800 text-zinc-100"
                    }
rounded - 2xl px - 5 py - 4 shadow - lg
    `}
            >
                {isUser ? (
                    <p className="leading-7">{message.content}</p>
                ) : (
                    <div className="prose prose-invert max-w-none prose-p:my-2 prose-pre:bg-black prose-pre:border prose-pre:border-zinc-800">
                        <ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {isUser && (
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User size={18} className="text-zinc-300" />
                    </div>
                </div>
            )}
        </div>
    );
}

