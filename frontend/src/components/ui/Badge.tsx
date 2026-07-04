import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "success" | "danger" | "neutral" | "warning";
}

const variantClasses = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
  warning: "bg-amber-100 text-amber-700",
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", variantClasses[variant])}>
      {label}
    </span>
  );
}
