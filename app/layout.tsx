import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure({
  ...awsExports,
  ssr: true,
});

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
