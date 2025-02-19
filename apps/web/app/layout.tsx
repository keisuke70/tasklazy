// Root layout: app/layout.tsx
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import ConfigureAmplify from "@/lib/configureAmplify";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskLazy",
  description: "A simple task management app",
  other: {
    "apple-mobile-web-app-title": "TaskLazy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`${inter.className} h-full w-full m-0 p-0`}>
        <ConfigureAmplify />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
