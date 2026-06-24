import { useState } from "react";
import "./App.css";

import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

import type { Message } from "./types/chat";

function App() {
  const [fileName, setFileName] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Upload a PDF document and ask me anything about it.",
    },
  ]);

  const handleFileSelect = async (file: File) => {
    try {
      const formData = new FormData();


      formData.append("file", file);

      const res = await fetch(
        "http://localhost:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log(data);

      setFileName(file.name);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${file.name} uploaded successfully.`,
        },
      ]);
    } catch (err) {
      console.error(err);
    }


  };

  const handleSend = async (question: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);


    try {
      const res = await fetch(
        "http://localhost:8000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting backend.",
        },
      ]);
    }


  };

  return (<div className="page"> <div className="app-container">


    <div className="navbar">
      <div className="brand">
        <h1>📚 PDF Q/A Chatbot</h1>
        <p>AI Document Assistant</p>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
      />
    </div>

    <div className="content">

      {fileName && (
        <div className="file-card">
          <div className="file-icon">
            📄
          </div>

          <div>
            <div className="file-name">
              {fileName}
            </div>

            <div className="file-status">
              Ready
            </div>
          </div>
        </div>
      )}

      <ChatWindow
        messages={messages}
      />

      <ChatInput
        onSend={handleSend}
      />

    </div>
  </div>
  </div>


  );
}

export default App;
