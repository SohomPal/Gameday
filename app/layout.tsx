import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "GameDay",
  description: "Find your next favorite game here with our daily reccomendation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
