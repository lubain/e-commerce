import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { QueryProvider } from "@/components/common/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  // Note: not all weight+style combos are available
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LUMIÈRE — Luxe Contemporain",
    template: "%s | LUMIÈRE",
  },
  description:
    "Maison de création française. Des pièces intemporelles alliant savoir-faire artisanal et design contemporain.",
  keywords: [
    "luxe",
    "bijoux",
    "mode",
    "artisanat",
    "haute joaillerie",
    "paris",
  ],
  authors: [{ name: "LUMIÈRE" }],
  creator: "LUMIÈRE",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lumiere.fr",
    siteName: "LUMIÈRE",
    title: "LUMIÈRE — Luxe Contemporain",
    description: "Maison de création française. L'excellence artisanale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMIÈRE",
    description: "Maison de création française. L'excellence artisanale.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
