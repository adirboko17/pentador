import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800"],
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
