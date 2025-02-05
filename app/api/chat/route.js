import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Define MARU's personality
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
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([systemPrompt, `User: ${message}\nMARUxAI:`]);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), { status: 200 });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ reply: "I don't understand you stupid human!" }), { status: 500 });
  }
}
