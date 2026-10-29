import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MakeSport — спортивные площадки рядом с тобой",
  description:
    "Краудсорсинговая платформа для поиска, добавления и оценки спортивных площадок. Находите бесплатные площадки на карте своего города.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
