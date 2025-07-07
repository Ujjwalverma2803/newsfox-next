import "../styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata = {
  title: "NewsFox | Stay Updated",
  description: "A sleek Next.js News App fetching latest headlines by category",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto p-4 pt-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
