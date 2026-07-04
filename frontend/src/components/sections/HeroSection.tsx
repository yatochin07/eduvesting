"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { usePageTransition } from "@/components/providers/PageTransitionProvider";

export default function HeroSection() {
  const { navigate } = usePageTransition();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-28 pb-32 text-center flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live Market Data Terintegrasi
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-jakarta text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1] mb-8 max-w-4xl"
        >
          Kuasai Market.
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-300 dark:via-indigo-200 dark:to-cyan-300 bg-clip-text text-transparent filter drop-shadow-sm">
            Tanpa Risiko Loss.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-normal"
        >
          Asah insting trading dan eksperimen strategi investasi kamu dengan data dunia nyata.
          Rakit portofolio multi-aset secara virtual sebelum terjun ke bursa sungguhan.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
            onClick={() => navigate("/login")}
          >
            Mulai Simulasi Gratis
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200/80 dark:hover:bg-white/10 flex items-center justify-center"
            onClick={() => document.querySelector("#discover")?.scrollIntoView({ behavior: "smooth" })}
          >
            Pelajari Fitur
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
