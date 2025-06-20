import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./main.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BW Stats: #1 Hypixel Bedwars Stats Checker",
  description: "This easy and detailed Bedwars stat checker is the best way to see your success. Get all of the info you need in one place.",
  keywords: "bw, bedwars, stat, stats, hypixel, checker, tracker, bot, bed, war, wars, online, bed wars, bwstats, bw stats, statistic, statistics",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=47xnmPod6a" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=47xnmPod6a" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=47xnmPod6a" />
        <link rel="manifest" href="/site.webmanifest?v=47xnmPod6a" />
        <link rel="shortcut icon" href="/favicon.ico?v=47xnmPod6a" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ minHeight: "100vh", position: "relative", paddingBottom: "6rem" }}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
