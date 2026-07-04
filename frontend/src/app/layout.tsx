import type { Metadata } from "next";
import { Inter, Roboto, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import PageTransitionProvider from "../components/providers/PageTransitionProvider";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
// @ts-ignore: Allow importing global CSS in Next.js app directory
import "@/styles/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    template: "%s | EduVesting",
    default: "EduVesting",
  },
  description: "Platform edukasi & pelacak portofolio investasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${inter.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="font-sans text-slate-200 bg-[#07090f]">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AnimatedBackground />
          <div className="relative z-10">
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}