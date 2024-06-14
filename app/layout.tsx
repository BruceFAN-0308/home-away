import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import {ThemeProvider} from "@/app/ThemeProvider";
import {ClerkProvider} from "@clerk/nextjs";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "HomeAway",
    description: "Feel at home, away from home",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                <Navbar/>
                <main className="container py-10">
                    {children}
                </main>
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}
