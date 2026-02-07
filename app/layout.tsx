import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers"; // Zorg dat dit pad exact klopt


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
        {/* De Providers component moet alles wrappen om de 'useApp' fout te voorkomen */}
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