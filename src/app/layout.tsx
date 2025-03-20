import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MoodProvider } from "@/context/MoodContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mood Tracker - Track Your Daily Activities and Mood",
  description:
    "A personal web application to track daily activities and monitor overall mood through a visual grid interface.",
  keywords: [
    "mood tracker",
    "activity tracking",
    "personal development",
    "habit tracking",
    "wellness",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full`}>
        <MoodProvider>{children}</MoodProvider>
      </body>
    </html>
  );
}
