"use client";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-center mb-4">Dantika Chatbot</h2>

        <div className="h-80 overflow-y-auto space-y-2 p-2 border border-gray-700 rounded">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 rounded-md ${msg.role === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700"} max-w-xs`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 text-white rounded-l focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
