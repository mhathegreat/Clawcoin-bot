import Chatbot from "../components/Chatbot";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-darkBg text-white">
      {/* This container ensures the chatbot stays centered */}
      <div className="relative w-full max-w-4xl h-full">
        <Chatbot />
      </div>
    </div>
  );
}
