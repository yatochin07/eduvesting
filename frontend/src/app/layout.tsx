import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "EduVesting - Manajemen Investasi Mahasiswa",
  description: "Kelola portofolio, transaksi, dan target finansialmu di satu tempat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
