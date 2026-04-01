import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MesApp — Daily Mess Expense Tracker",
  description:
    "Track your daily mess and cafeteria purchases with AI-powered receipt scanning. Smart expense management made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-background text-foreground font-sans">
        <Sidebar />
        <main className="flex-1 min-h-screen lg:ml-64 pt-14 lg:pt-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
