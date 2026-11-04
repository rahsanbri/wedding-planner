import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WeddingDataProvider } from "@/components/providers/WeddingDataProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fbf7f2",
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Our Wedding: Perjalanan Menuju Hari Bahagia",
  description: "Master Wedding Project Dashboard - Plan, Organize, Celebrate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`h-full antialiased ${playfair.variable} ${jakarta.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf7f2] text-[#3a281c] text-sm antialiased">
        <WeddingDataProvider>{children}</WeddingDataProvider>
      </body>
    </html>
  );
}
