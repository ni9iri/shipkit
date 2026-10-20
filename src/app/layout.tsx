import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { config } from "@/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.domain),
  title: { default: config.appName, template: `%s | ${config.appName}` },
  description: config.appDescription,
  openGraph: { title: config.appName, description: config.appDescription, url: "/", siteName: config.appName },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
