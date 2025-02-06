import "./globals.css";

export const metadata = {
  title: "MARUxAI Chat",
  description: "A futuristic AI chatbot with a cyberpunk theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
