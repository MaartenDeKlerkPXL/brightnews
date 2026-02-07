import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Zorg dat dit pad naar je providers bestand wijst
import { Providers } from "@/components/providers"; 
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bright News",
  description: "Positief nieuws van over de hele wereld",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        {/* De Providers MOETEN alles hieronder wrappen */}
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}