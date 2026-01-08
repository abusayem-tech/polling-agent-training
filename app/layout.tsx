import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "পোলিং এজেন্ট প্রশিক্ষণ | Polling Agent Training",
  description: "বাংলাদেশ নির্বাচন কমিশন পোলিং এজেন্ট প্রশিক্ষণ প্রোগ্রাম",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

