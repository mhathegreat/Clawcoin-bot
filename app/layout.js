import "./globals.css";

export const metadata = {
  title: "Neon Clawz",
  description: "Welcome to Claw, the cyberpunk AI revolution. A fusion of AI intelligence and degen crypto spirit. The first AI-powered memecoin cat!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
