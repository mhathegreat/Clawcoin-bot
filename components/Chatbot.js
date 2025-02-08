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
  
    if (messages.length === 0) {
      setMessages([
        { role: "model", parts: [{ text: "Meow! I am MARUxAI. Ask me anything... if you dare. 😼" }] },
      ]);
    }
  }, []);
  

  useEffect(() => {
    if (isMounted) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100); // Small delay to prevent flickering
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
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>

      {/* Navigation Menu */}
      {/* Navigation Bar */}
      <div className="navbar">
        <h1 className="navbar-title">MARUxAI</h1>
        <div className="flex gap-4">
          <a href="https://x.com/maruxai_sol" target="_blank" rel="noopener noreferrer"
            className="nav-button x-button">
            X
          </a>
          <a href="https://maruxai.xyz/" target="_blank" rel="noopener noreferrer"
            className="nav-button home-button">
            Home
          </a>
        </div>
      </div>

      {/* Underline Glow Effect */}
      <div className="nav-underline"></div>


      {/* Chatbox Container */}
      <div className="relative w-full min-w-[90vw] md:min-w-[75vw] lg:min-w-[900px] max-w-[95vw] md:max-w-[90vw] lg:max-w-[1400px] h-[70vh] bg-gray-900 bg-opacity-90 rounded-lg overflow-hidden border-4 border-neonBlue shadow-2xl flex flex-col mt-16 chat-container">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="User Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-cyan-300 shadow-md" />
              ) : (
                <img src="https://i.ibb.co/7NxkNnTw/5273737601016263300.jpg"
                  alt="MARU Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-pink-400 shadow-md" />
              )}

              <div className={`chat-message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start w-full">
              {/* MARU's Avatar */}
              <img src="https://i.imgur.com/aFGm2NG.jpeg"
                alt="MARU Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-pink-400 shadow-md" />

              {/* Typing Indicator Bubble */}
              <div className="typing-indicator ml-2">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Box & Send Button */}
        <div className="flex gap-2 p-4 bg-gray-900 w-full">
        <input
          ref={inputRef}
          className={`chat-input ${inputShake ? 'shake' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask MARU anything..."
          disabled={loading}
        />
        <button className="send-button"
          onClick={sendMessage}
          disabled={loading}>
          <Send size={28} color="#121212" />
        </button>

        </div>
      </div>
    </div>
  );
}
