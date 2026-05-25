import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import Providers from "@/components/Providers";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Hezekiah Olawale Ojenike | Full-Stack Developer",
  description: "Building Scalable Web Systems That Drive Real Results. Portfolio of Hezekiah Olawale Ojenike.",
  openGraph: {
    title: "Hezekiah Olawale Ojenike | Full-Stack Developer",
    description: "Building Scalable Web Systems That Drive Real Results.",
    url: "https://hezekiah.dev",
    siteName: "HOO Portfolio",
    images: [
      {
        url: "/og-image.png", // User can replace this with a real image in public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hezekiah Olawale Ojenike | Full-Stack Developer",
    description: "Building Scalable Web Systems That Drive Real Results.",
    creator: "@ProfHezzy",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-slate-900">
        <Providers>
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
