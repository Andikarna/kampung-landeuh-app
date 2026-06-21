import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kampung Landeuh Smart Tourism",
  description: "Platform wisata digital Kampung Landeuh - Temukan destinasi wisata, event budaya, dan pengalaman alam terbaik",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
