"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type PageTransitionContextType = {
  navigate: (href: string, originEvent?: MouseEvent) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition harus dipakai di dalam <PageTransitionProvider>");
  }
  return ctx;
}

// Jeda sebelum router.push() ditembak, kasih waktu animasi "exit" (zoom masuk)
// selesai dulu di halaman lama sebelum konten diganti.
const EXIT_DURATION_MS = 380;

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      pendingHref.current = href;
      setIsExiting(true);

      timerRef.current = setTimeout(() => {
        if (pendingHref.current) router.push(pendingHref.current);
        setIsExiting(false);
      }, EXIT_DURATION_MS);
    },
    [router]
  );

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={
            isExiting
              ? // Klik terjadi di halaman ini: "terbang masuk" ke dalam layar.
                { opacity: 0, scale: 1.15, transition: { duration: EXIT_DURATION_MS / 1000, ease: [0.6, 0, 0.9, 0.2] } }
              : // Kondisi normal: settle ke ukuran asli, seolah baru saja "mendarat".
                { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
          }
          style={{
            transformOrigin: "center center",
            // Paksa browser bikin compositing layer terpisah untuk elemen ini,
            // supaya animasi scale/opacity murni digarap di GPU tanpa memicu
            // browser ikut repaint layer lain (termasuk canvas WebGL Neat
            // di belakangnya). Ini kunci utama biar transisi tidak "makan"
            // frame budget yang lagi dipakai Neat buat render tiap frame.
            willChange: "transform, opacity",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            isolation: "isolate",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
