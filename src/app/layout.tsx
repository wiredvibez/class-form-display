import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "הערכת מנהלים | Peer Evaluation",
  description: "מערכת להערכת עמיתים - פעילות כיתתית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className={`${rubik.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
