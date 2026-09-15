import type { Metadata } from "next";
import { fontSansAdmin } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin - TalenCo",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSansAdmin.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
