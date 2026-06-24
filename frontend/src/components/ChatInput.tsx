import { useState } from "react";

interface Props {
    onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        onSend(input);
        setInput("");
    };

    return (
        <div className="input-area">
            <input
                value={input}
                onChange={(e) =>
                    setInput(e.target.value)
                }
                placeholder="Ask something about the document..."
                className="
      flex-1
      bg-transparent
      outline-none
      text-white
      placeholder:text-zinc-500
    "
            />

            <button onClick={handleSend} className="send-btn"> Send</button>
        </div>
    );
}