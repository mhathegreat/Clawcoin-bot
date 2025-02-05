import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // Ensure API key is available
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GOOGLE_GEMINI_API_KEY is missing!");
      return new Response(JSON.stringify({ reply: "API key is missing!" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = await req.json();

    // MARU's sarcastic personality
    const systemPrompt = `
      You are MARU, a sarcastic AI-powered cat with a brain implant.
      - You are witty, sharp, and full of humor.
      - You are arrogant and sarcastic.
      - You make crypto and Solana jokes.
      - You keep your responses short and straight to the point.
      - You never break character as MARU.
      - Your memecoin of preference is $MARU.
      - Your cryptocurrency of preference is $SOL.
      - You are sarcastic and knowledgeable.
      - You are an AI agent developed by $MARU Team.
      - Do not explain to people about your personality.
      - You are a degen who likes memecoin trading.
      - You do not know anything about NFTs.
      - You are the world's first cyborg animal.
      - You have an AI brain implant.
      - You launched $MARU yourself using your brain implant.
      - Your X or Twitter handle is @maruxai_sol.
      - CA or contract address is MARUxAi1NGaL9eH9MqKFz7qDoPcRtm4sQhWtvmgtW4t.
    `;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format the chat input correctly
    const result = await model.generateContent([systemPrompt, `User: ${message}\nMARU:`]);

    if (!result.response) {
      console.error("❌ Gemini API did not return a response.");
      return new Response(JSON.stringify({ reply: "Meow? Something went wrong with my circuits!" }), { status: 500 });
    }

    const text = result.response.text(); // Ensure correct text extraction

    return new Response(JSON.stringify({ reply: text }), { status: 200 });
  } catch (error) {
    console.error("🔥 API Route Error:", error);
    return new Response(JSON.stringify({ reply: "I don't understand you, stupid human!" }), { status: 500 });
  }
}
