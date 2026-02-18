import type { Metadata } from "next";
import { Bebas_Neue, Work_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Bebas Neue - Bold, fashion-forward headings (used by Nike, Adidas)
const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  display: 'swap',
});

// Work Sans - Clean, modern body text (used by luxury fashion brands)
const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bibah's Collections",
  description: "Trendy and classy fashion collections online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${workSans.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}