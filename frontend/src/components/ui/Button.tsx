"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function Button({ children, loading, loadingText = "Memproses...", className = "", disabled, ...props }: ButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <motion.button
      {...(props as React.ComponentProps<typeof motion.button>)}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/40 group ${className}`}
    >
      {/* Efek shine yang lewat saat hover */}
      {!isDisabled && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.span
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
            />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
