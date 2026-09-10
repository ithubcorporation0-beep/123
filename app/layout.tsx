import type { Metadata } from "next";
import { DM_Serif_Display, Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IZBA Learning HUB — Production Learning Management System",
  description: "Production-ready Learning Management System with role-based panels for Admins, Instructors, and Students.",
};

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZW5nYWdpbmctcGFudGhlci04MC5jbGVyay5hY2NvdW50cy5kZXYk";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html
        lang="en"
        className={`${dmSerif.variable} ${openSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans text-foreground bg-background leading-relaxed">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
