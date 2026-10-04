import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "MediLink | Student Healthcare Innovation",
    template: "%s | MediLink",
  },
  description:
    "MediLink is a student-founded high school network that trains members to solve healthcare through clinical thinking, financial reasoning, and technology.",
  openGraph: {
    type: "website",
    siteName: "MediLink",
    title: "MediLink | Student Healthcare Innovation",
    description:
      "A student-founded high school network of chapters, curriculum, and competition.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className={`${plusJakarta.className} min-h-full bg-background font-sans text-text`}>
        {children}
      </body>
    </html>
  );
}
