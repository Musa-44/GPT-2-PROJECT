"use client";

import { useLLM } from "@/hook/useLLM";
import React from "react";

interface Chat {
  role: "user" | "llm";
  message: string;
}

export default function Home() {
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState<Chat[]>([]);
  const llm = useLLM();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChat((chat) => [...chat, { role: "user", message }]);
    setMessage("");

    llm.mutate(
      { prompt: message },
      {
        onSuccess: (data) => {
          setChat((chat) => [...chat, { role: "llm", message: data.message }]);
        },
        onError: () => {
          setChat((chat) => [
            ...chat,
            { role: "llm", message: "Something went wrong. Please try again." },
          ]);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800">
      <main className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-center mb-4">AI Chat Assistant</h1>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {chat.map(({ message, role }, index) => (
            <div
              key={index}
              className={flex ${role === "user" ? "justify-end" : "justify-start"}}
            >
              <div
                className={`px-5 py-3 rounded-xl shadow-md max-w-[80%] text-sm transition-all ${
                  role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {message}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="flex gap-3 items-center bg-white shadow-lg p-4 rounded-xl border border-gray-200"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Send
          </button>
        </form>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
