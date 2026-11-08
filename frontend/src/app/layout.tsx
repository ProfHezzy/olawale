import type { Metadata } from "next";
import { inter, jetbrainsMono, calSans } from "@/lib/fonts";
import "./globals.css";
import Providers from "@/components/Providers";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { personSchema, webSiteSchema, organizationSchema, combineSchemas } from "@/lib/structured-data";

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
        url: "/og-image.png",
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
  other: {
    'script:ld+json': JSON.stringify(combineSchemas(personSchema, webSiteSchema, organizationSchema)),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${calSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
