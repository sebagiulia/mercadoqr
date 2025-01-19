import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/mercadoqr-logo.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mercadoqr",
  description: "comprá ahora, retirá después",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <Link href="/" >
            <Image
              src={Logo}
              alt="MercadoQR logo"
              width={50}
              height={50}
              style={{ objectFit: "contain"}}
            />
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
