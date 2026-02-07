import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// We importeren nu de juiste Providers die we in components/providers.tsx hebben gemaakt
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