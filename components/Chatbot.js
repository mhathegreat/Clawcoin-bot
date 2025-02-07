"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [inputShake, setInputShake] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) {
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
      return;
    }

    // Add user message to chat history
    const userMessage = { role: "user", parts: [{ text: input }] };
    const updatedHistory = [...messages, userMessage].slice(-10); // Keep last 10 messages

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: updatedHistory }),
      });

      const data = await response.json();
      setLoading(false);

      if (!data.reply) {
        throw new Error("No reply from server");
      }

      // Add MARU's response to chat history
      setMessages((prevMessages) => [...prevMessages, { role: "model", parts: [{ text: data.reply }] }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prevMessages) => [...prevMessages, { role: "model", parts: [{ text: "Meow... Something went wrong. Try again." }] }]);
      setLoading(false);
    }

    // Keep focus on input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [messages, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>

      {/* Navigation Menu */}
      <div className="absolute top-4 w-full flex justify-between px-6 md:px-12">
        <h1 className="text-3xl font-bold text-neonBlue">MARUxAI</h1>
        <div className="flex gap-4">
          <a href="https://x.com/maruxai_sol" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition">
            X
          </a>
          <a href="https://maruxai.xyz/" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition">
            Home
          </a>
        </div>
      </div>

      {/* Chatbox Container */}
      <div className="relative w-full min-w-[90vw] md:min-w-[75vw] lg:min-w-[900px] max-w-[95vw] md:max-w-[90vw] lg:max-w-[1400px] h-[70vh] bg-gray-900 bg-opacity-90 rounded-lg overflow-hidden border-4 border-neonBlue shadow-2xl flex flex-col mt-16">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="User Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-cyan-300 shadow-md" />
              ) : (
                <img src="https://i.imgur.com/aFGm2NG.jpeg"
                  alt="MARU Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-pink-400 shadow-md" />
              )}

              <div className={`p-3 text-white text-sm md:text-lg rounded-xl break-words shadow-lg fade-in ml-2
                max-w-[80%] md:max-w-[70%] lg:max-w-[60%]`}
                style={{
                  backgroundColor: msg.role === "user" ? "#00aaff" : "#ff1493",
                  fontWeight: "bold",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center">
              <img src="https://i.imgur.com/aFGm2NG.jpeg"
                alt="MARU Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-pink-400 shadow-md" />
              <div className="p-3 text-white text-sm md:text-lg rounded-xl bg-pink-500 ml-2">
                Meow... <span className="dots">.</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Box & Send Button */}
        <div className="flex gap-2 p-4 bg-gray-900 w-full">
          <input
            ref={inputRef}
            className={`p-3 bg-gray-800 text-white border border-neonBlue rounded-lg w-full outline-none focus:ring-2 focus:ring-neonBlue text-sm md:text-lg ${inputShake ? 'shake' : ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask MARU anything..."
            disabled={loading}
          />
          <button className={`p-3 bg-neonBlue rounded-full flex items-center justify-center transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 transform"}`}
            onClick={sendMessage}
            disabled={loading}>
            <Send size={28} color="#121212" />
          </button>
        </div>
      </div>
    </div>
  );
}
