import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Add Nunito font to the application
const nunito = Nunito({ subsets: ["latin"] });

// Prepare the Metadata for the application
export const metadata: Metadata = {
  title: "Long-Term Care Providers",
  description: "Search for long-term care providers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className} suppressHydrationWarning={true}>
        <div className="mb-8 py-4 w-screen bg-lava text-white">
          <h1 className="text-3xl text-center">Long-Term Care Providers</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
