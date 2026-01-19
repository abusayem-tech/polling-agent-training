import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "পোলিং এজেন্ট প্রশিক্ষণ | Polling Agent Training",
  description: "ত্রয়োদশ জাতীয় সংসদ নির্বাচন উপলক্ষ্যে নির্বাচনী ও পোলিং এজেন্টদের প্রশিক্ষণ কর্মশালা",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "পোলিং এজেন্ট প্রশিক্ষণ | Polling Agent Training",
    description: "ত্রয়োদশ জাতীয় সংসদ নির্বাচন উপলক্ষ্যে নির্বাচনী ও পোলিং এজেন্টদের প্রশিক্ষণ কর্মশালা",
    images: [
      {
        url: "/thumbnail.jpeg",
        width: 1200,
        height: 630,
        alt: "পোলিং এজেন্ট প্রশিক্ষণ",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "পোলিং এজেন্ট প্রশিক্ষণ | Polling Agent Training",
    description: "ত্রয়োদশ জাতীয় সংসদ নির্বাচন উপলক্ষ্যে নির্বাচনী ও পোলিং এজেন্টদের প্রশিক্ষণ কর্মশালা",
    images: ["/thumbnail.jpeg"],
  },
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

