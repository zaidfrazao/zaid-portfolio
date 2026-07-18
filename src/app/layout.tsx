import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zaidfrazao.com"),
  title: {
    default: "Zaid Frazao — AI-accelerated product builder",
    template: "%s · Zaid Frazao",
  },
  description:
    "Senior fullstack developer who ships complete products fast by pairing deep engineering experience with AI-powered workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
