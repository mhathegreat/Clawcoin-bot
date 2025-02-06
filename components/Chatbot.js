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
  const inputRef = useRef(null); // Create reference for input field

  const sendMessage = async () => {
    if (!input.trim()) {
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); 
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setLoading(false);

      if (!data.reply) {
        throw new Error("No reply from server");
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "maru", text: data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "maru", text: "Meow... Something went wrong. Try again." },
      ]);
      setLoading(false);
    }

    // Keep focus on input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
      inputRef.current.focus(); // Set focus on input field when component mounts
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>

      {/* Fixed-width chat container */}
      <div className="relative w-[1200px] h-[600px] bg-gray-900 bg-opacity-90 rounded-lg overflow-hidden border-4 border-neonBlue shadow-2xl flex flex-col">
        
        <h1 className="text-3xl font-bold text-neonBlue text-center p-4">
          MARUxAI
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "user" ? (
                <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="User Avatar" className="w-10 h-10 rounded-full border border-cyan-300 shadow-md" />
              ) : (
                <img src="https://i.imgur.com/GSzvJM8.png"
                  alt="MARU Avatar" className="w-10 h-10 rounded-full border border-pink-400 shadow-md" />
              )}

              <div className={`p-3 text-white text-lg rounded-xl break-words shadow-lg fade-in ml-2
                max-w-[75%] md:max-w-[60%] lg:max-w-[50%]`}
                style={{
                  backgroundColor: msg.sender === "user" ? "#00aaff" : "#ff1493",
                  fontWeight: "bold",
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center">
              <img src="https://i.imgur.com/GSzvJM8.png"
                alt="MARU Avatar" className="w-10 h-10 rounded-full border border-pink-400 shadow-md" />
              <div className="p-3 text-white text-lg rounded-xl bg-pink-500 ml-2">
                Meow... <span className="dots">.</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Box & Send Button */}
        <div className="flex gap-4 p-4 bg-gray-900 w-full">
          <input
            ref={inputRef} // Attach reference to input field
            className={`p-4 bg-gray-800 text-white border border-neonBlue rounded-lg w-full outline-none focus:ring-2 focus:ring-neonBlue text-lg ${inputShake ? 'shake' : ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask MARU anything..."
            disabled={loading}
          />
          <button className={`p-4 bg-neonBlue rounded-full flex items-center justify-center transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 transform"}`}
            onClick={sendMessage}
            disabled={loading}>
            <Send size={32} color="#121212" />
          </button>
        </div>
      </div>
    </div>
  );
}
