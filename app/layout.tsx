import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });

export const metadata: Metadata = {
  title: "Mustang | Uncompromising",
  description:
    "Unrestrained performance — introducing the most extreme road-legal Mustang ever built.",
  openGraph: {
    title: "Mustang | Uncompromising",
    description:
      "Unrestrained performance — introducing the most extreme road-legal Mustang ever built.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustang | Uncompromising",
    description:
      "Unrestrained performance — introducing the most extreme road-legal Mustang ever built.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&family=Barlow+Condensed:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
