import "@/app/global.css";
import QueryProvider from "@/components/providers/QueryProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent-Ease | Production Smart Property Management Platform",
  description:
    "Enterprise automation systems engine for multi-tenant assets configurations tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
