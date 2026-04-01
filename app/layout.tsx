import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "sivutminttiin",
    template: "%s | sivutminttiin"
  },
  description:
    "Website redesign proposal tool for creating client-ready concept previews.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "sivutminttiin",
    description:
      "Website redesign proposal tool for creating client-ready concept previews.",
    siteName: "sivutminttiin",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className="min-h-screen bg-[#07111f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}