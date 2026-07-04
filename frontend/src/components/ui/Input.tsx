import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  labelRight?: React.ReactNode; // Untuk link "Lupa password?"
  rightElement?: React.ReactNode; // Untuk tombol toggle password (eye icon)
}

export default function Input({ label, icon, labelRight, rightElement, className = "", ...props }: InputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block">{label}</label>
        {labelRight && labelRight}
      </div>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">{icon}</div>}
        <input
          {...props}
          className={`w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 outline-none transition-colors ${icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-10' : 'pr-4'} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
