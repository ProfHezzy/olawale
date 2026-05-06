import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Hezekiah Olawale Ojenike | Full-Stack Developer",
  description: "Building Scalable Web Systems That Drive Real Results. Portfolio of Hezekiah Olawale Ojenike.",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
