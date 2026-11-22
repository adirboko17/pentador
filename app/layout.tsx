import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const heebo = localFont({
  src: "./fonts/Heebo-Variable.ttf",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pentador · מנעול חכם לדלת הבית",
  description:
    "זיהוי פנים תלת־ממדי, טביעת אצבע, קוד, כרטיס ואפליקציה. ומבפנים, מסך שמראה מי עומד בדלת.",
  icons: { icon: { url: "/favicon.png", type: "image/png" } },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.className}>
      <body>{children}</body>
    </html>
  );
}
