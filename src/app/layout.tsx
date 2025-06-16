import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shepherds Voice",
  description: "The sermon doesn't have to end at church.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header with logo */}
        <header className="sticky top-0 z-50 bg-white">
          <div className="container mx-auto px-4 py-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Shepherds Voice Logo"
                width={160}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
