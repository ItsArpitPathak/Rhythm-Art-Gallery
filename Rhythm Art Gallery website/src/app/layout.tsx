import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Motion } from "@/components/site/motion";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rhythm Art Gallery (RAG)",
  description: "Boutique sarees, suits, jewellery and handbags.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Motion>
          <Header />
          {/* Slide-in reveals and the hero frame briefly poke past the edge; clip them here, not on body (keeps the sticky header). */}
          <div className="flex-1 overflow-x-clip">{children}</div>
          <Footer />
        </Motion>
      </body>
    </html>
  );
}
