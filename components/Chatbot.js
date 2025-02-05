"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([
        ...messages,
        { sender: "user", text: input },
        { sender: "maru", text: data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([
        ...messages,
        { sender: "maru", text: "Meow... I'm having trouble thinking right now." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
         style={{ 
           backgroundImage: "url('/images/background.png')", 
           fontFamily: "'Helvetica', Arial, sans-serif"
         }}>
      
      {/* Chatbox Container */}
      <div className="relative w-[900px] h-[650px] bg-gray-900 bg-opacity-85 rounded-lg overflow-hidden border-8 border-neonBlue shadow-2xl flex flex-col">

        {/* Chat Title */}
        <h1 className="text-4xl font-bold text-neonBlue text-center p-4 z-10" style={{ fontFamily: "'Helvetica', Arial, sans-serif" }}>
          MARUxAI
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 max-h-[500px] relative z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-center w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>

              {/* Profile Avatar */}
              {msg.sender === "user" ? (
                <img src={`https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg`} alt="User Avatar"
                     className="w-10 h-10 rounded-full border border-cyan-300 shadow-md mr-2" />
              ) : (
                <img src="https://i.imgur.com/GSzvJM8.png" alt="MARU Avatar"
                     className="w-10 h-10 rounded-full border border-pink-400 shadow-md mr-2" />
              )}

              {/* Chat Bubble */}
              <div className="p-3 text-white text-lg rounded-xl max-w-xs break-words shadow-lg"
                   style={{
                     backgroundColor: msg.sender === "user" ? "#00aaff" : "#ff1493", 
                     fontWeight: "bold",
                     textAlign: msg.sender === "user" ? "right" : "left",
                     fontFamily: "'Helvetica', Arial, sans-serif", 
                   }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Box & Send Button */}
        <div className="flex gap-2 p-4 bg-gray-900 bg-opacity-80 w-full relative z-10">
          <input className="p-3 bg-gray-800 text-white border border-neonBlue rounded-lg w-full outline-none focus:ring-2 focus:ring-neonBlue transition-all text-xl"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyPress}
                 placeholder="Ask MARU anything..."
                 style={{ fontFamily: "'Helvetica', Arial, sans-serif" }}
          />
          <button className="p-3 bg-neonBlue rounded-full flex items-center justify-center transition-all hover:scale-110 transform"
                  onClick={sendMessage}>
            <Send size={28} color="#121212" />
          </button>
        </div>
      </div>
    </div>
  );
}
