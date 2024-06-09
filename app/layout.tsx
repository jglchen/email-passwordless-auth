import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
//import langData from '@/configdata/langData';
import Header from '@/components/Header';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Firebase Email Passwordless Link Authentication",
  description: "Firebase Email Passwordless Link Authentication Tutorial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
